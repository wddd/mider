/**
 * jsonp
 */
import {buildURL} from "../../utils/url";
import {objClone, objCover} from "../../utils/objectOpt";

// default ajax params
const defaultOptions = {
    url: '',
    data: null,
    dataType: 'json',
    jsonp: 'callback',
    success: new Function,
    error: new Function,
};
//
let jsonpCounter = 100;

export default function ajaxJsonp(config) {
    // init options
    let options = objCover(objClone(defaultOptions), config);
    // create receive func
    let jsonpCallbackName = 'jsonp_cb' + jsonpCounter++;
    let called = false;
    window[jsonpCallbackName] = function (data) {
        called = true;
        options.success(data);
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
        if (called === false) {
            options.error({
                message: 'Jsonp response illegal',
            });
        }
        delete window[jsonpCallbackName];
        document.head.removeChild(pageScript);
    };
    pageScript.onerror = function () {
        options.error({
            message: 'Jsonp request error',
        });
        document.head.removeChild(pageScript);
    };
};
