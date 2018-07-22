/**
 * 文件上传组件
 * @author wdzxc
 */

/**
 * 扩展元素组件
 * @module FileUploader
 */

// 依赖
import {isArray,isFunction,isString} from "../utils/isWhat";

/**
 * 分析返回值  object | string => object
 * @param resContent
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
 * 文件上传组件
 * @param {Object} config                        - 基础配置对象
 * @param {string} config.uploadUrl                - 文件上传接口URL
 * @param {string=} config.crossOriginSrc           - 跨域上传iframe代理URL
 * @param {string=} config.fileType                - 文件类型 需要小写字母 示例："txt,js,jpg,png,jpeg" | ['text','js']
 * @param {string=} config.fileSize                - 文件大小，单位kb 示例: "10-200" | "10~200" |"200"
 * @param {element} config.uploadElem                - 文件上传表单元素
 * @param {element=} config.imgElem                    - 图片文件预览元素
 * @param {function=} config.callback            - 成功回调
 * @param {function=} config.errCallback            - 失败回调
 * @param {function=} config.uploading            - 上传中回调
 * @param {function=} config.beforeSend            - 上传开始回调
 * @param {function=} config.onchange            - 文件选中、改变回调，可以在这个回调函数中写入 send方法
 * @returns {{send: send}}                            - 返回包含操作方法的对象
 * @constructor
 * @alias module:FileUploader
 * @example
 *   var fp = new FileUploader({
     *   	uploadUrl : "http://dove.zol.com.cn/saas.pin/ftp/fileUpload",
     *   	// 上传Form
     *   	uploadElem: fileUploadElem,
     *   	// 文件类型限制
     *   	fileType:"txt,js,jpg,png,jpeg",
     *   	// 文件大小限制
     *   	fileSize:"10-200",
     *   	// 跨域模式
     *   	crossOriginSrc:"http://dove.zol.com.cn/saas.pin/upload/fileSpy.html",
     *   	// 图片
     *   	imgElem : document.querySelector('img'),
     *   	//文件上传完成后回调函数
     *   	callback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	errCallback: function(resContent) {
     *   	    console.log(resContent);
     *   	},
     *   	// 进度
     *   	uploading: function(percent) {
     *   	    console.log("Uploading:" + percent);
     *   	},
     *   	// onchange
     *   	onchange:function(){
     *   	    console.log("change");
     *   	}
     * });
 * // 发送文件
 * fp.send();
 *
 *
 *
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

    // 文件类型&大小检查
    function fileInspect(file) {
        if (!file) {
            options.errCallback && options.errCallback("没有选中任何文件");
            return false;
        }
        // 检查文件类型是否符合标准
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
            options.errCallback && options.errCallback("文件类型错误！正确类型:" + options.fileType.join(','));
            return false;
        }
        if (isString(options.fileSize)) {
            let fileLimit = options.fileSize.split(/~|-|,/);
            let compareSize = file.size / 1024;
            if (fileLimit.length == 2) {
                if (compareSize < fileLimit[0] || compareSize > fileLimit[1]) {
                    options.errCallback && options.errCallback("文件大小错误(" + parseInt(compareSize) + "kb)!尺寸范围：" + fileLimit.join('~') + ' kb');
                    return false;
                }
            }
            else if (fileLimit.length == 1) {
                if (compareSize > fileLimit[0]) {
                    options.errCallback && options.errCallback("文件大小错误(" + parseInt(compareSize) + "kb)！文件需要小于 " + fileLimit[0] + " kb");
                    return false;
                }
            } else {
                console.log("Error : 文件大小配置错误！");
                return false;
            }
        }
        return true;
    }

    /*
     * XHR上传文件
     */
    let xhr = new XMLHttpRequest();
    options.uploadElem.addEventListener('change', function () {
        previewImage();
    });

    // 创建文件的URL
    let createObjectURL = function (blob) {
        return window[window["webkitURL"] ? 'webkitURL' : 'URL']['createObjectURL'](blob);
    };

    // 预览图片
    function previewImage(imageFile) {

        // 预览参数图片 或 表单图片
        let file = imageFile || options.uploadElem.files[0];
        if (!fileInspect(file)) {
            options.uploadElem.value = "";
            return;
        }

        // IE10
        if (options.imgElem) {
            options.imgElem.src = createObjectURL(file);
            options.imgElem.style.opacity = 0.2;
        }

        // 触发change事件
        options.onchange && options.onchange();
    }

    return {
        extractFiles: function (targetFiles) {
            let files = targetFiles || options.uploadElem.files;
            let file = files[0];
            if (!file) {
                options.errCallback && options.errCallback("没有选中任何文件");
                return;
            }
            // 处理多选的文件
            if (options.partner && files.length > 1) {
                options.partner.synergy([].slice.call(files, 1));
            }
            return file;
        },
        send: function (targetFiles) {
            let file = this.extractFiles(targetFiles);
            // 构造表单数据
            let formData = new FormData();
            isFunction(options.beforeSend) && options.beforeSend(file);
            formData.append("files", file);
            // 上传状态
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
             * 上传进度
             * @param {{loaded,total}} evt
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
        // 传递协同 额外文件
        synergy: function (remainFiles) {
            if (options.partner && remainFiles) {
                setTimeout(function () {
                    options.partner.send(remainFiles);
                }, 300);
            }
            previewImage(remainFiles[0]);
        },
        options: options
    }
};
FileUploader.prototype = {};

// module.exports = FileUploader;
export default  FileUploader;

