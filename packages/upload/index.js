/**
 * @module FileUploader
 */

import {isArray,isFunction,isString} from "../utils/isWhat";

/**
 * Parses the return value from a string to an object.
 * @param {string} resContent - The response content.
 * @returns {Object|string} The parsed data.
 */
function parseRetData(resContent) {
    let retData;
    try {
        retData = JSON.parse(resContent);
    } catch (e) {
        retData = resContent;
    }
    return retData;
}

/**
 * A file uploader component.
 * @param {Object} config - The base configuration object.
 * @param {string} config.uploadUrl - The file upload API URL.
 * @param {string} [config.crossOriginSrc] - The cross-origin upload iframe proxy URL.
 * @param {string|Array<string>} [config.fileType] - The allowed file types, e.g., "txt,js,jpg,png,jpeg" or ['text','js'].
 * @param {string} [config.fileSize] - The file size limit in KB, e.g., "10-200", "10~200", or "200".
 * @param {HTMLElement} config.uploadElem - The file upload form element.
 * @param {HTMLElement} [config.imgElem] - The image preview element.
 * @param {Function} [config.callback] - The success callback.
 * @param {Function} [config.errCallback] - The error callback.
 * @param {Function} [config.uploading] - The progress callback.
 * @param {Function} [config.beforeSend] - The callback before sending the file.
 * @param {Function} [config.onchange] - The callback when the file is selected or changed.
 * @returns {{send: function, extractFiles: function, synergy: function, options: Object}} An object containing the control methods.
 * @constructor
 * @alias module:FileUploader
 * @example
 *   var fp = new FileUploader({
     *   	uploadUrl : "http://example.com/upload",
     *   	uploadElem: fileUploadElem,
     *   	fileType:"txt,js,jpg,png,jpeg",
     *   	fileSize:"10-200",
     *   	crossOriginSrc:"http://example.com/fileSpy.html",
     *   	imgElem : document.querySelector('img'),
     *   	callback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	errCallback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	uploading: function(percent) {
     *   	    console.log("Uploading:" + percent);
     *   	},
     *   	onchange:function(){
     *   	    console.log("change");
     *   	    this.send();
     *   	}
     * });
 * // Send the file
 * fp.send();
 */
let FileUploader = function (config) {
    let options = {
        // url
        uploadUrl: "",
        // formElem
        uploadElem: null,
        // success
        callback: null,
        errCallback: null,
        // uploading
        uploading: null,
        // beforeSend
        beforeSend: null,
        // img preview elem
        imgElem: null,
        // onchange
        onchange: null,
        // 文件类型
        fileType: '',
        // 文件大小 kb
        fileSize: null,
        // Authorization
        Authorization: false,
        // synergy {FileUploader}
        partner: null
    };
    // 参数合并
    for (let an in config) {
        if (!config.hasOwnProperty(an))continue;
        options[an] = config[an];
    }

    /**
     * Inspects the file type and size.
     * @param {File} file - The file to inspect.
     * @returns {boolean} Whether the file is valid.
     * @private
     */
    function fileInspect(file) {
        if (!file) {
            options.errCallback && options.errCallback("No file selected.");
            return false;
        }
        // Checks if the file type meets the standard
        let typeMatch = true;
        if (options.fileType) {
            typeMatch = false;
            if (isString(options.fileType)) {
                options.fileType = options.fileType.split(',');
            }
            if (isArray(options.fileType)) {
                options.fileType.forEach(function (type) {
                    isString(type) && file.name.match(/\.[^.]*$/) && file.name.match(/\.[^.]*$/)[0].toLowerCase().indexOf(type) >= 0 && (typeMatch = true);
                });
            }
        }
        if (!typeMatch) {
            options.errCallback && options.errCallback("Incorrect file type! Allowed types: " + options.fileType.join(','));
            return false;
        }
        if (isString(options.fileSize)) {
            let fileLimit = options.fileSize.split(/~|-|,/);
            let compareSize = file.size / 1024;
            if (fileLimit.length == 2) {
                if (compareSize < fileLimit[0] || compareSize > fileLimit[1]) {
                    options.errCallback && options.errCallback("Incorrect file size (" + parseInt(compareSize) + "kb)! Size range: " + fileLimit.join('~') + ' kb');
                    return false;
                }
            }
            else if (fileLimit.length == 1) {
                if (compareSize > fileLimit[0]) {
                    options.errCallback && options.errCallback("Incorrect file size (" + parseInt(compareSize) + "kb)! File needs to be smaller than " + fileLimit[0] + " kb");
                    return false;
                }
            } else {
                console.log("Error: Incorrect file size configuration!");
                return false;
            }
        }
        return true;
    }

    /**
     * The XMLHttpRequest instance.
     * @type {XMLHttpRequest}
     * @private
     */
    let xhr = new XMLHttpRequest();
    options.uploadElem.addEventListener('change', function () {
        previewImage();
    });

    /**
     * Creates a URL for the file.
     * @param {Blob} blob - The file blob.
     * @returns {string} The object URL.
     * @private
     */
    let createObjectURL = function (blob) {
        return window[window["webkitURL"] ? 'webkitURL' : 'URL']['createObjectURL'](blob);
    };

    /**
     * Previews the image.
     * @param {File} [imageFile] - The image file to preview.
     * @private
     */
    function previewImage(imageFile) {
        // Previews the parameter image or the form image
        let file = imageFile || options.uploadElem.files[0];
        if (!fileInspect(file)) {
            options.uploadElem.value = "";
            return;
        }

        if (options.imgElem) {
            options.imgElem.src = createObjectURL(file);
            options.imgElem.style.opacity = 0.2;
        }

        // Triggers the change event
        options.onchange && options.onchange.call({ send: returnedObject.send });
    }

    const returnedObject = {
        /**
         * Extracts files from the input element.
         * @param {FileList} [targetFiles] - A FileList object to extract files from.
         * @returns {File|undefined} The extracted file.
         */
        extractFiles: function (targetFiles) {
            let files = targetFiles || options.uploadElem.files;
            let file = files[0];
            if (!file) {
                options.errCallback && options.errCallback("No file selected.");
                return;
            }
            // Handles multiple selected files
            if (options.partner && files.length > 1) {
                options.partner.synergy([].slice.call(files, 1));
            }
            return file;
        },
        /**
         * Sends the file.
         * @param {FileList} [targetFiles] - A FileList object to send.
         */
        send: function (targetFiles) {
            let file = this.extractFiles(targetFiles);
            // Constructs the form data
            let formData = new FormData();
            isFunction(options.beforeSend) && options.beforeSend(file);
            formData.append("files", file);
            // Upload status
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        options.callback && options.callback(parseRetData(xhr.responseText));
                    } else {
                        options.errCallback && options.errCallback("ServerError:" + xhr.responseText);
                    }
                }
            };
            /**
             * The upload progress event.
             * @param {ProgressEvent} evt - The progress event.
             */
            xhr.upload.onprogress = function (evt) {
                let loaded = evt.loaded;
                let total = evt.total;
                let percent = Math.floor(100 * loaded / total);
                console.log(percent);
                options.imgElem.style.opacity = percent / 100;
                options.uploading && options.uploading(percent);
            };
            xhr.open("post", options.uploadUrl);
            xhr.send(formData);
        },
        /**
         * Passes additional files for synergy.
         * @param {Array<File>} remainFiles - The remaining files.
         */
        synergy: function (remainFiles) {
            if (options.partner && remainFiles) {
                setTimeout(function () {
                    options.partner.send(remainFiles);
                }, 300);
            }
            previewImage(remainFiles[0]);
        },
        /**
         * The configuration options.
         * @type {Object}
         */
        options: options
    };
    return returnedObject;
};
FileUploader.prototype = {};

// module.exports = FileUploader;
export default  FileUploader;

