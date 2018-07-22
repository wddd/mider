/**
 * tiny ajax
 * @param config
 */

// dependence
import {isObject, isArray, isFunction, isString} from "../../utils/isWhat";
import {buildURL} from "../../utils/url";
import {objClone, objCover} from "../../utils/objectOpt";

// default ajax params
const defaultOptions = {
    type: 'GET',
    url: '',
    data: null,
    // 只提供传统序列化方式
    traditional: true,
    dataType: 'json',
    jsonp: 'callback',
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    cache: true,
    success: new Function,
    error: new Function,
    uploading: new Function,
    beforeSend: new Function,
    dataFilter: null,
    headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/json; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest"
    }
};
//
let jsonpCounter = 100;

export default function ajax(config) {

    // init options
    let options = objCover(objClone(defaultOptions), config);
    options.headers["Content-Type"] = options.contentType || options.headers["Content-Type"];

    // jsonp process
    function jsonpProcess() {
        // create receive func
        let jsonpCallbackName = 'jQuery21400015739046590903527_' + options.jsonp + jsonpCounter++;
        let called = false;
        window[jsonpCallbackName] = function (data) {
            called = true;
            callback(data);
        };
        // script tag
        let pageScript = document.createElement('script');
        pageScript.type = 'text/javascript';
        let params = objClone(options.data);
        params[options.jsonp] = jsonpCallbackName;
        params["_"] = +new Date();
        pageScript.src = buildURL({
            url: options.url,
            params: params
        });
        document.head.appendChild(pageScript);
        pageScript.onload = function () {
            if (called == false) {
                errCallback({
                    message: 'Jsonp response illegal.',
                }, 'parsererror', {
                    status: 200,
                    readyState: 4
                });
            }
            delete window[jsonpCallbackName];
            document.head.removeChild(pageScript);
        };
        pageScript.onerror = function () {
            errCallback({
                message: 'Connection Refused.',
            }, '(failed)net::ERR_CONNECTION_REFUSED', {
                status: null
            });
            document.head.removeChild(pageScript);
        };
    }

    // xhr process
    function xhrProcess() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            // complete
            if (xhr.readyState == 4) {
                // success code 200
                if (xhr.status == 200) {
                    if (isFunction(options.dataFilter)) {
                        callback(options.dataFilter(xhr.responseText, xhr.responseType));
                    } else {
                        callback(xhr.responseText);
                    }
                }
                else {
                    errCallback(xhr.responseText, 'error', {status: xhr.status});
                }
            }
        };
        /**
         * 进度
         * @param {{loaded,total}} evt
         */
        xhr.upload.onprogress = function (evt) {
            let loaded = evt.loaded;
            let total = evt.total;
            let percent = Math.floor(100 * loaded / total);
            options.uploading && options.uploading(percent);
        };
        /**
         * 处理 xhr get
         */
        let xhrMethodGet = function () {
            // open
            xhr.open("GET",
                buildURL({
                    url: options.url,
                    params: options.data
                }));
            // append headers
            Object.keys(options.headers).forEach(name => {
                xhr.setRequestHeader(name, options.headers[name]);
            });
            // before send hook
            options.beforeSend(xhr);
            // send
            xhr.send();
        };

        /**
         * 处理 xhr post
         */
        let xhrMethodPost = function () {
            xhr.open("post", options.url);
            // append headers
            Object.keys(options.headers).forEach(name => {
                xhr.setRequestHeader(name, options.headers[name]);
            });
            // before send hook
            options.beforeSend(xhr);
            xhr.send(serialDataToQuery(options.data));
        };

        // xhr method process
        let xhrMethod = {
            GET() {
                xhrMethodGet();
            },
            POST() {
                xhrMethodPost();
            }
        };
        xhrMethod[options.type.toUpperCase()]();

    }

    // select branch
    if (options.dataType.toLocaleLowerCase() === "jsonp") {
        jsonpProcess();
    } else {
        xhrProcess();
    }

    /**
     * 成功回调处理
     * @param resourceData
     */
    function callback(resourceData) {
        let dataPreProcessing = {
            json() {
                return JSON.parse(resourceData);
            },
            jsonp() {
                return resourceData;
            },
            html() {
                return resourceData;
            }
        };
        const dataType = options.dataType.toLocaleLowerCase();
        let data, eop = false;
        try {
            data = dataPreProcessing[dataType]();
        } catch (msg) {
            eop = true;
            errCallback({
                message: `[${options.dataType}] parser error.`,
            }, 'parsererror', {
                status: 200,
                response: resourceData,
                msg: msg
            });
        }
        // 不存在异常则进行成功回调
        !eop && options.success(data);
    }

    /**
     * 失败回调
     */
    const errCallback = options.error && options.error;

    /**
     * 序列化对象为 URL Query
     * 形式 : a=1&b=2
     * @param data
     * @returns {string}
     */
    function serialDataToQuery(data) {
        if (isString(data)) {
            return data;
        }
        if (isObject(data)) {
            let queryList = [];
            for (let an in data) {
                if (!data.hasOwnProperty(an)) continue;
                if (isArray(data[an])) {
                    data[an].forEach(value => {
                        queryList.push(an + '=' + encodeURI(value));
                    });
                } else {
                    queryList.push(an + '=' + encodeURI(data[an]));
                }

            }
            return queryList.join('&');
        }
        console.error('Data serialization error..');
    }

};
