/**
 * 接口代理模块
 * @author wdzxc
 */
/*===============================================================================================*/

import Hashes from './src/vendor/sha1';
import AjaxJsonp from './src/jsonp.js';
import axios from 'axios';
import {isObject, isArray, isFunction, isString, isUndefined} from "../utils/isWhat";
import {objClone, getObjAttr, objCover, objEqual} from "../utils/objectOpt";

/**
 * Binds a function to a specific context.
 * @param {Function} fn - The function to bind.
 * @param {*} thisArg - The context to bind the function to.
 * @returns {Function} The bound function.
 */
function bind(fn, thisArg) {
    return function wrap() {
        let args = new Array(arguments.length);
        for (let i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

/**
 * Extends axios with additional options and callbacks.
 * @returns {Function} An extended axios instance.
 */
function ExtendAxios() {
    return bind(function (options) {
        let callback = options.success;
        let errCallback = options.error;
        // method & type
        options.method = options.method || options.type;
        // responseType & dataType
        options.responseType = options.responseType || options.dataType;
        // headers
        options.headers = options.headers || {};
        if (options.responseType === 'html') {
            options.headers["Accept"] = "text/html, */*";
        }
        if (options.responseType === 'text') {
            options.headers["Accept"] = "text/plain, */*";
        }
        // options polyfill
        if (options.method === 'post' || options.method === 'put' || options.method === 'patch') {
            options.data = options.data || options.params;
            // if (JSON.stringify(axiosOptions.params) === JSON.stringify(axiosOptions.data)) {
            //     delete axiosOptions.params;
            // }
            options.headers["Content-Type"] = options.headers["Content-Type"]
                || "application/json";
        }
        if (options.beforeSend) {
            let fakeXhr = {
                setRequestHeader(key, value) {
                    options.headers[key] = value;
                }
            };
            options.beforeSend(fakeXhr);
        }
        axios(options).then((response) => {
            callback(response.data, response.status);
        }).catch((error) => {
            errCallback(error);
        });
    }, axios);
}

const extendAxios = new ExtendAxios();
const PROXY_METHOD_CONFIG_MARK = "__proxy_method_config_mark__";

/**
 * @typedef {Object} DefaultOptions
 * @property {string|null} origin - The default domain.
 * @property {Function} beforeSend - A pre-request callback function.
 * @property {Function} paramsFilter - A function to filter request parameters.
 * @property {Function|null} dataFilter - A function to preprocess the data upon a successful response.
 * @property {Function} callback - The default success callback.
 * @property {Function} errCallback - The default error callback.
 * @property {string} type - The default request type.
 * @property {string} dataType - The default data type.
 * @property {string} contentType - The default content type.
 * @property {boolean} traditional - A flag for traditional parameter serialization.
 * @property {string|null} jsonp - The JSONP callback name.
 * @property {Object|null} fakeHeaders - Custom headers to be added to the request.
 */

/**
 * The default options for the interface proxy.
 * @type {DefaultOptions}
 */
let defaultOptions = {
    // Default domain
    origin: null,
    // A pre-request callback function
    beforeSend: new Function,
    // A function to filter request parameters, by default it filters out null fields
    paramsFilter(params) {
        Object.keys(params).forEach(key => {
            if (params[key] === null) delete params[key];
        });
        return params;
    },
    // A function to preprocess the data upon a successful response
    dataFilter: null,
    // The default success callback
    callback: new Function,
    // The default error callback
    errCallback: new Function,
    // ajax default
    type: "get",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    traditional: true,
    jsonp: null,        // jsonpCallback
    // modify header
    fakeHeaders: null,
};

/**
 * @typedef {Object} OriginAjaxConfig
 * @property {string} [pathname] - The interface path. This can be a relative or absolute path.
 * @property {string} [url] - The URL, which is usually an absolute path.
 * @property {string} [origin=""] - The domain of the interface. If an origin is configured, it will be concatenated with the pathname to form the full URL.
 * @property {string} [type="GET"] - The request method, e.g., GET, POST.
 * @property {string} [dataType="json"] - The data type, e.g., json, jsonp.
 * @property {string} [jsonp="jsonpCallback"] - The JSONP callback function name.
 * @property {string} [paramsType=""] - The parameter type.
 * @property {function} [paramsFilter=""] - A function to preprocess the parameters.
 * @property {string} [dataPath=""] - The data path.
 * @property {function} [dataFilter=""] - A function to preprocess the data.
 * @property {object} [pathParams] - The path parameters.
 * @property {boolean} [merge=false] - A flag to indicate whether to merge requests.
 * @property {boolean} [queue=false] - A flag to indicate whether to queue requests.
 * @property {boolean} [single=false] - A flag to indicate whether only the last request is valid.
 * @property {number} [validTime=0] - The valid time in seconds.
 * @property {*} [params=null] - The query parameters for the interface. If no parameters are provided when the interface is called, the default configuration will be used.
 * @property {string} [name=""] - The name of the interface, for reference.
 * @property {*} [returns=null] - The reference format of the returned data in a successful state, only for the data part. For example: if the returned data is { success:true,data:{} }, then returns should be {}.
 * @property {function} [errCallback] - The default error callback function.
 * @property {function} [ajax] - The ajax call.
 * @property {function} [beforeSend] - A pre-request hook function that can be used to modify headers, etc.
 * @property {function} [model] - The interface model.
 * @property {function} [successHandler] - A filter to determine the success status of the returned data.
 *
 * @example
 * {
 *      getGoodsList: {
 *           name: "GoodsList",
 *           pathname: "/goods/findAll",
 *           params: {type:1},
 *           returns: [{
 *              "id": "001",
 *              "name": "Iphone4"
 *           }]
 *      }
 *      // ...
 * }
 */

/**
 * A toolkit for assembling interface requests.
 * @namespace
 */
const toolkit = {

    /**
     * Generates the final interface configuration.
     * @param {string} key - The key of the interface configuration.
     * @param {InterfaceProxy} proxyObj - The InterfaceProxy instance.
     * @returns {Object} The final interface configuration.
     */
    getInterfaceConfig(key, proxyObj) {
        // A list of all interface configurations
        const configList = objClone(proxyObj.$configMap);

        // Preprocesses the options list
        function doMixin(config) {
            let result = config;
            if (config.mixins) {
                let mixinTarget = config.mixins;
                if (isString(mixinTarget) || isObject(mixinTarget)) {
                    mixinTarget = [mixinTarget];
                }
                if (isArray(mixinTarget)) {
                    mixinTarget.reverse().map(mixin => {
                        if (isString(mixin)) {
                            return configList[mixin];
                        }
                        if (isObject(mixin)) return mixin;
                        // console.error("InterfaceProxy Mixin ERROR.");
                    }).forEach(mixin => {
                        if (mixin.mixins) {
                            // Handles mixins recursively
                            result = objCover(doMixin(mixin), result);
                        } else {
                            result = objCover(objClone(mixin), objClone(result));
                        }
                    });
                }
            }
            return result;
        }

        // Assembles the final configuration
        let unitOptions = doMixin(configList[key]);
        let troopOptions = proxyObj.$additionalOptions;
        let finalConfig = objCover(objCover(objClone(defaultOptions), troopOptions), unitOptions);
        finalConfig.$unitOptions = unitOptions;
        finalConfig.$troopOptions = troopOptions;
        finalConfig.$defaultOptions = defaultOptions;
        return finalConfig;
    },
    /**
     * Generates the final Ajax configuration.
     * @param {Array} args - The arguments passed to the interface method.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} baseConfig - The base configuration.
     * @returns {Object} The final Ajax configuration.
     */
    getAjaxConfig(args, interfaceConfig, baseConfig) {
        // The basic AJAX configuration
        let ajaxConfig = objCover(objClone(interfaceConfig), baseConfig);
        /*----------------------------------------------------
         Supported argument formats:
         > callback
         > callback, errCallback
         > params, callback, errCallback
         > [pArg1, pArg2...], callback, errCallback
         > Fills in the missing parameter values according to the default constructor method of the Res configuration
         ----------------------------------------------------*/
        let defaultParams = ajaxConfig.params;
        // Captures the parameters
        let captureParams = {};
        let captureCallback = null;
        let captureErrCallback = null;
        let _Symbol = null;
        if (typeof Symbol !== 'undefined') {
            _Symbol = Symbol;
        }
        // The default parameter values are generated by the interface configuration.
        // If the type of the default parameter configuration is a function, the result of the function execution is obtained
        Object.keys(defaultParams || {}).forEach(key => {
            let value = defaultParams[key];
            if (value === Number
                || value === String
                || value === Array
                || value === Boolean
                || value === Function
                || value === _Symbol
                || value === Object) {
                captureParams[key] = null;
                return;
            }
            if (isObject(value)) {
                value = value.default || null;
            }
            if (isFunction(value)) {
                captureParams[key] = value();
                return;
            }
            captureParams[key] = value;
        });
        if (baseConfig) {
            if (isObject(interfaceConfig.params)) {
                objCover(captureParams, ajaxConfig.params);
            }
            if (isObject(interfaceConfig.data)) {
                ajaxConfig.data = objCover(interfaceConfig.data, ajaxConfig.data);
            }
        } else {
            // Captures the parameters based on the arguments
            // Analyzes the function's incoming parameter list and extracts params, callback, and errCallback
            let multiParamPattern = true;
            let multiParamNum = 0;
            [].forEach.call(args, function (param) {
                // Extracts the success and error callback functions
                if (isFunction(param)) {
                    if (!captureCallback) {
                        captureCallback = param;
                        return;
                    }
                    if (!captureErrCallback) {
                        captureErrCallback = param;
                        return;
                    }
                }
                // Extracts the parameter list and configures it separately
                if (isObject(param)) {
                    objCover(captureParams, param);
                    multiParamPattern = false;
                }
                // Multi-parameter configuration
                if (multiParamPattern && !isFunction(param)) {
                    let attrNum = 0;
                    for (let an in defaultParams) {
                        if (!defaultParams.hasOwnProperty(an)) continue;
                        if (attrNum++ === multiParamNum) {
                            captureParams[an] = param;
                            multiParamNum++;
                            break;
                        }
                    }
                }
            });
        }
        // Handles the URL and basic parameters
        let url = (function () {
            if (ajaxConfig.url) return ajaxConfig.url;
            if (ajaxConfig.origin) {
                return ajaxConfig.origin + ajaxConfig.pathname;
            }
            else return ajaxConfig.pathname;
        })(ajaxConfig);
        // Reconstructs the URL path with pathParams
        let pathParams = ajaxConfig.pathParams;
        if (pathParams) {
            Object.keys(pathParams).forEach(key => {
                let value = pathParams[key];
                url = url.replace(new RegExp(`:${key}`), value);
            });
        }

        // Parameter filter
        if (isFunction(ajaxConfig.paramsFilter)) {
            captureParams = ajaxConfig.paramsFilter(captureParams);
        }

        ajaxConfig.method = ajaxConfig.method || ajaxConfig.type;
        ajaxConfig.url = url;
        ajaxConfig.data = ajaxConfig.data || captureParams;
        if(!~['post','put','patch'].indexOf(ajaxConfig.method.toLowerCase())){
            ajaxConfig.params = captureParams;
        }
        ajaxConfig.callback = captureCallback;
        ajaxConfig.errCallback = captureErrCallback;
        // Generates the request mark
        if (ajaxConfig.validTime > 0) {
            ajaxConfig.requestMark = this.generateDataMark(ajaxConfig);
        }
        return ajaxConfig;
    },
    /**
     * Builds the interface method for data exchange.
     * @param {string} key - The key of the interface configuration.
     * @param {InterfaceProxy} proxyObj - The InterfaceProxy instance.
     * @returns {Function} The constructed interface method.
     * @ignore
     */
    buildInterfaceMethod: function (key, proxyObj) {
        /**
         * The constructed interface call function.
         * @param {*} [params] - The query parameters.
         * @param {*} [callback] - The success callback.
         * @param {*} [errCallback] - The error callback.
         * @param {*} [methodConfig] - The proxy method configuration.
         */
        let proxyMethod = function (params, callback, errCallback, methodConfig) {
            let args = [].slice.call(arguments);
            // Generates the final configuration based on the configurations at each level
            let interfaceConfig = toolkit.getInterfaceConfig(key, proxyObj);
            let baseConfig = null;

            args = args.filter(function (arg) {
                if (isObject(arg) && arg[PROXY_METHOD_CONFIG_MARK]) {
                    baseConfig = arg;
                    return false;
                }
                return true;
            });

            // Generates the ajaxConfig based on the parameters and interface configuration
            let ajaxConfig = toolkit.getAjaxConfig(args, interfaceConfig, baseConfig);

            // Rewraps the callback
            let wrapCallback = function () {
                /**
                 * The default error callback.
                 * 1. If no general callback and dedicated callback are configured, the default callback is used.
                 * 2. If a general callback is configured but no dedicated callback, the general callback is used.
                 * 3. If both a general callback and a dedicated callback are configured, the dedicated callback is called first. If the dedicated callback returns true, the general callback is called.
                 * 4. If both a general callback and a dedicated callback are configured, the dedicated callback is called first. If the dedicated callback returns false, the process ends.
                 * Dedicated callback [cb, then] -> General callback [unitOptions, troopOptions, defaultOptions]
                 */
                // Wraps a new callback function if a configured callback and a default callback both exist
                if (ajaxConfig.errCallback && interfaceConfig.errCallback && (ajaxConfig.errCallback !== interfaceConfig.errCallback)) {
                    ajaxConfig.errCallback = (function (callback, defaultCallback) {
                        return function () {
                            return callback.apply(this, arguments) && defaultCallback.apply(this, arguments);
                        };
                    })(ajaxConfig.errCallback, interfaceConfig.errCallback);
                }
                // If there is no parameter callback, the default callback is used as the ajax callback
                if (!ajaxConfig.errCallback) {
                    ajaxConfig.errCallback = interfaceConfig.errCallback;
                }
                /**
                 * The default success callback.
                 */
                if (!ajaxConfig.callback) {
                    ajaxConfig.callback = interfaceConfig.callback;
                }
            };

            // Encapsulates in a Promise-like form
            let agent = {};

            // .then
            agent.then = function (callback, errCallback) {
                if (callback) {
                    let _captureCallback = ajaxConfig.callback;
                    ajaxConfig.callback = function () {
                        _captureCallback && _captureCallback.apply(this, arguments);
                        callback.apply(this, arguments);
                    };
                }
                if (errCallback) {
                    // If the ajax callback is the default callback, then the parameter callback does not exist
                    // Replaces the ajax callback with a chained callback
                    if (ajaxConfig.errCallback === interfaceConfig.errCallback) {
                        ajaxConfig.errCallback = errCallback;
                    } else {
                        // If both the parameter callback and the default callback exist, the parameter callback is executed first, and then the chained callback is executed
                        let _captureErrCallback = ajaxConfig.errCallback;
                        ajaxConfig.errCallback = function () {
                            return (_captureErrCallback && _captureErrCallback.apply(this, arguments))
                                || errCallback.apply(this, arguments);
                        };
                        wrapCallback();
                    }
                }
                return agent;
            };

            // .catch .error
            agent.catch = agent.error = function (errCallback) {
                // The catch method is a wrapper for .then(null, rejection)
                agent.then(null, errCallback);
                return agent;
            };

            // .finally
            agent.finally = function (callback) {
                let _captureCallback = ajaxConfig.callback;
                let _captureErrCallback = ajaxConfig.errCallback;
                ajaxConfig.callback = function () {
                    _captureCallback && _captureCallback.apply(this, arguments);
                    callback.apply(this, arguments);
                };
                ajaxConfig.errCallback = function () {
                    _captureErrCallback && _captureErrCallback.apply(this, arguments);
                    callback.apply(this, arguments);
                };
                ajaxConfig.finallyCallback = callback;
                return {};
            };

            // errCallback
            wrapCallback();

            // .loadingSwitch
            agent.loadingSwitch = function (target, key) {
                let _target = target, _key = key;
                interfaceConfig.optLoadingSwitch = function (value) {
                    _target[_key] = value;
                };
                return agent;
            };

            // do ajax => async start
            setTimeout(function () {
                toolkit.doAjax(interfaceConfig, ajaxConfig);
            }, 1);

            return agent;
        };
        // wrap axios methods with base config
        ['delete', 'get', 'head', 'options'].forEach(function (method) {
            proxyMethod[method] = function (params, config) {
                let methodConfig = config || {};
                methodConfig[PROXY_METHOD_CONFIG_MARK] = true;
                methodConfig['method'] = method;
                methodConfig['params'] = objCover(methodConfig['params'] || {}, params || {});
                return proxyMethod(methodConfig);
            };
        });
        ['post', 'put', 'patch'].forEach(function (method) {
            proxyMethod[method] = function (data, config) {
                let methodConfig = config || {};
                methodConfig[PROXY_METHOD_CONFIG_MARK] = true;
                methodConfig['method'] = method;
                methodConfig['data'] = data;
                return proxyMethod(methodConfig);
            };
        });
        return proxyMethod;
    },
    /**
     * Initiates the request.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} ajaxConfig - The Ajax configuration.
     */
    doAjax(interfaceConfig, ajaxConfig) {
        // An interceptor before the Ajax request starts
        if (this.beforeAjax(interfaceConfig, ajaxConfig)) return;
        // A unified handler for the request response
        let onResponse = (type, data) => {
            // An interceptor after the Ajax request ends
            if (this.afterAjax(interfaceConfig, ajaxConfig)) return;
            let resMap = {
                success: data => {
                    this.AjaxGetSuccessProcess({
                        data: data.data,
                        status: data.status,
                    }, interfaceConfig, ajaxConfig);
                },
                localSuccess: data => {
                    this.AjaxGetSuccessProcess({
                        data: data.data,
                        status: data.status,
                        isLocalObtain: true
                    }, interfaceConfig, ajaxConfig);
                },
                error: error => {
                    this.AjaxGetFailProcess(error, interfaceConfig, ajaxConfig);
                }
            };
            resMap[type] && resMap[type](data);
        };
        // Binds the request processing function
        ajaxConfig.success = function (data, status) {
            onResponse('success', {
                data: data,
                status: status
            });
        };
        ajaxConfig.error = function (status) {
            onResponse('error', status);
        };
        // Starts requesting data
        // Tries to search for local data
        if (interfaceConfig.validTime) {
            let localData = this.getAlreadyObtain(ajaxConfig.requestMark);
            if (localData) {
                // Matches local data
                onResponse('localSuccess', {
                    data: localData,
                    status: 200
                });
                return;
            }
        }
        // Obtains data via ajax
        if (ajaxConfig.dataType === 'jsonp') {
            AjaxJsonp(objClone(ajaxConfig));
            return;
        }
        (interfaceConfig.ajax || extendAxios)(objClone(ajaxConfig));
    },
    /**
     * A pre-request handler.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} ajaxConfig - The Ajax configuration.
     * @returns {boolean} Whether to intercept the request.
     */
    beforeAjax(interfaceConfig, ajaxConfig) {
        let flag = this.requestManager.start(interfaceConfig, ajaxConfig);
        if (!flag) {
            // A switch for the loading state
            if (isFunction(interfaceConfig.optLoadingSwitch)) {
                interfaceConfig.optLoadingSwitch(true);
            }
        }
        return flag;
    },
    /**
     * A post-request handler.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} ajaxConfig - The Ajax configuration.
     * @returns {*}
     */
    afterAjax(interfaceConfig, ajaxConfig) {
        // A switch for the loading state
        if (isFunction(interfaceConfig.optLoadingSwitch)) {
            interfaceConfig.optLoadingSwitch(false);
        }
        return this.requestManager.finish(interfaceConfig, ajaxConfig);
    },
    /**
     * Preprocesses the Ajax data upon a successful response (200+).
     * @param {Object} response - The response object.
     * @param {*} response.data - The response data.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} ajaxConfig - The Ajax configuration.
     * @ignore
     */
    AjaxGetSuccessProcess: function (response, interfaceConfig, ajaxConfig) {
        // Basic configuration
        let opt = objCover({}, response);

        // Converts configuration items
        let data = opt.data;
        let status = opt.status;
        let callback = ajaxConfig.callback;
        let errCallback = ajaxConfig.errCallback;
        let isLocalObtain = opt.isLocalObtain;

        // Handles data caching
        if (!isLocalObtain && interfaceConfig.validTime) {
            this.repository.push({
                key: ajaxConfig.requestMark,
                timeStamp: +new Date(),
                data: data,
                validTime: interfaceConfig.validTime
            });
        }

        // callback
        let callbackEx = null;
        if (callback) {
            callbackEx = function (extractData) {
                // Extracts data
                arguments[0] = interfaceConfig.dataPath ? getObjAttr(extractData, interfaceConfig.dataPath) : arguments[0];
                arguments[0] = isFunction(interfaceConfig.dataFilter) ? interfaceConfig.dataFilter(arguments[0], interfaceConfig.dataType) : arguments[0];
                return callback.apply(null, arguments);
            };
        }

        /*----------------------------------------------------
         Interface return value types (200)
         > Empty: treated as success
         > {success:true,...}
         Determines whether to call the success or error callback
         > data | msg: tries to extract data on success, tries to extract msg on failure
         ----------------------------------------------------*/

        // Custom success status judgment mechanism
        if (isFunction(interfaceConfig.successHandler)) {
            let result = interfaceConfig.successHandler(data) || {};
            if (result.success === true) {
                return callbackEx && callbackEx(result.data);
            }
            if (result.success === false) {
                return errCallback(result.msg, data);
            }
        }
        // If the returned data is empty, it is treated as success
        if (!data) {
            return callbackEx && callbackEx(null);
        }
        // Extracts the returned data based on the success flag
        if (data.success === true) {
            // Extracts the data
            if (!isUndefined(data.data)) {
                return callbackEx && callbackEx(data.data, data, status);
            }
            return callbackEx && callbackEx(data, data, status);
        }
        if (data.success === false) {
            return errCallback && errCallback(data.msg, data);
        }
        // If the returned data does not contain the success field, it is treated as success
        if (isUndefined(data.success)) {
            return callbackEx && callbackEx(data, data);
        }
    },
    /**
     * Processes the received data upon failure (200X).
     * @param {Error} error - The error object.
     * @param {Object} interfaceConfig - The interface configuration.
     * @param {Object} ajaxConfig - The Ajax configuration.
     * @ignore
     */
    AjaxGetFailProcess: function (error, interfaceConfig, ajaxConfig) {
        // AJAX failure
        ajaxConfig.errCallback && ajaxConfig.errCallback(error.message, error);
    },
    /**
     * Generates a data mark.
     * @param {Object} ajaxConfig - The Ajax configuration.
     * @returns {string} The data mark.
     * @ignore
     */
    generateDataMark: function (ajaxConfig) {
        let dataMark = JSON.stringify(ajaxConfig);
        dataMark = Hashes.hex_hmac(dataMark, '888');
        return dataMark;
    },
    /**
     * Retrieves data.
     * @param {string} key - The key of the data to retrieve.
     * @returns {*} The retrieved data.
     * @ignore
     */
    getAlreadyObtain: function (key) {
        let data = this.repository.get(key);
        if (data) {
            return data.responseData;
        }
        return null;
    },
    /**
     * The request manager.
     * @namespace
     */
    requestManager: (function () {
        function RequestManager() {
            // ...
        }

        RequestManager.prototype = [];
        // This operation slows down the array performance...
        // RequestManager.prototype.constructor = RequestManager;
        RequestManager.prototype.requestQueryEqual = function (a, b) {
            return this.interfaceConfigEqual(a.interfaceConfig, b.interfaceConfig) && objEqual(a.ajaxConfig.data, b.ajaxConfig.data);
        };
        RequestManager.prototype.interfaceConfigEqual = function (a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        };
        RequestManager.prototype.requestEqual = function (a, b) {
            return this.interfaceConfigEqual(a.interfaceConfig, b.interfaceConfig) && a.ajaxConfig.data === b.ajaxConfig.data;
        };
        RequestManager.prototype.removeItem = function (interfaceConfig, ajaxConfig) {
            let removed = null;
            this.find((r, index) => {
                if (interfaceConfig && ajaxConfig) {
                    if (this.requestEqual(r, {
                        interfaceConfig: interfaceConfig,
                        ajaxConfig: ajaxConfig
                    })) {
                        removed = r;
                        this.splice(index, 1);
                        return true;
                    }
                } else if (interfaceConfig && this.interfaceConfigEqual(interfaceConfig, interfaceConfig)) {
                    removed = r;
                    this.splice(index, 1);
                    return true;
                }
            });
            return removed;
        };
        /**
         * Starts a request.
         * @param {Object} interfaceConfig - The interface configuration.
         * @param {Object} ajaxConfig - The Ajax configuration.
         * @returns {boolean|undefined} Returns true if the request is merged, otherwise undefined.
         */
        RequestManager.prototype.start = function (interfaceConfig, ajaxConfig) {
            // Unique
            if (interfaceConfig.single) {
                this.removeItem(interfaceConfig);
            }
            // Merge
            if (interfaceConfig.merge) {
                const sameRequest = this.find(r => this.requestQueryEqual(r, {
                    interfaceConfig: interfaceConfig,
                    ajaxConfig: ajaxConfig
                }));
                if (sameRequest) {
                    // Asynchronously executes the wrapped callback code. Reason: .then, .error, .finally
                    const callback = sameRequest.ajaxConfig.callback,
                        errCallback = sameRequest.ajaxConfig.errCallback;
                    if (callback) {
                        sameRequest.ajaxConfig.callback = function () {
                            callback.apply(this, arguments);
                            ajaxConfig.callback.apply(this, arguments);
                        }
                    }
                    if (errCallback) {
                        sameRequest.ajaxConfig.errCallback = function () {
                            errCallback.apply(this, arguments);
                            ajaxConfig.errCallback.apply(this, arguments);
                        }
                    }
                    return true;
                }
            }
            // Enqueue
            this.push.call(this, {
                interfaceConfig: interfaceConfig,
                ajaxConfig: ajaxConfig,
                timeStamp: new Date()
            });
        };
        /**
         * Finishes a request.
         * @param {Object} interfaceConfig - The interface configuration.
         * @param {Object} ajaxConfig - The Ajax configuration.
         * @returns {boolean|undefined} Returns true if the request is terminated, otherwise undefined.
         */
        RequestManager.prototype.finish = function (interfaceConfig, ajaxConfig) {
            // Queue
            if (interfaceConfig.queue) {
                // Finds the previous request with the same interface
                let r = null;
                this.find(request => {
                    if (this.requestEqual(request, {interfaceConfig: interfaceConfig, ajaxConfig: ajaxConfig})) {
                        return false;
                    }
                    if (this.interfaceConfigEqual(request.interfaceConfig, interfaceConfig) && request.ajaxConfig !== ajaxConfig) {
                        r = request;
                        return true;
                    }
                });
                if (r) {
                    const callback = r.ajaxConfig.callback, errCallback = r.ajaxConfig.errCallback;
                    const nextCallback = ajaxConfig.callback, nextErrCallback = ajaxConfig.errCallback;
                    // Attaches the callback to the next function and waits for the request in front of the queue to call next to trigger the callback
                    let next;
                    ajaxConfig.callback = function () {
                        const arg = objClone(arguments);
                        next = function () {
                            nextCallback.apply(this, arg);
                        };
                    };
                    ajaxConfig.errCallback = function () {
                        const arg = objClone(arguments);
                        next = function () {
                            nextErrCallback.apply(this, arg);
                        };
                    };
                    if (callback) {
                        r.ajaxConfig.callback = function () {
                            callback.apply(this, arguments);
                            next && next();
                        };
                    }
                    if (errCallback) {
                        r.ajaxConfig.errCallback = function () {
                            errCallback.apply(this, arguments);
                            next && next();
                        };
                    }
                }
            }
            // Clear
            if (!this.removeItem(interfaceConfig, ajaxConfig)) {
                // single: if the request has been removed from the queue, the processing flow is terminated
                if (interfaceConfig.single) return true;
            }
        };
        return new RequestManager();
    })(),
    /**
     * The persistent storage.
     * @namespace
     */
    repository: (function () {
        let ls = window.localStorage;
        return {
            /**
             * Pushes data to the repository.
             * @param {Object} params - The parameters.
             * @param {string} params.key - The key.
             * @param {number} params.timeStamp - The timestamp.
             * @param {*} params.data - The data.
             * @param {number} params.validTime - The valid time.
             */
            push: function (params) {
                // Saves new data
                ls[params.key] = JSON.stringify({
                    timeStamp: params.timeStamp,
                    validTime: params.validTime,
                    responseData: params.data
                });
            },
            /**
             * Gets data from the repository.
             * @param {string} key - The key.
             * @returns {*} The data.
             */
            get: function (key) {
                this.clean();
                return JSON.parse(ls.getItem(key) || 'null');
            },
            /**
             * Clears expired data from the repository.
             */
            clean: function () {
                // Clears expired cache
                for (let i = 0; i < ls.length; i++) {
                    // 42db81629a 3582822d6b b6b83bbe1d 2378e6aeeb
                    if (/\w{40}/.test(ls.key(i))) {
                        let storeData = JSON.parse(ls.getItem(ls.key(i)) || 'null');
                        if (storeData) {
                            if ((new Date().getTime() - storeData.timeStamp) / 1000 > storeData.validTime) {
                                ls.removeItem(ls.key(i));
                            }
                        }
                    }
                }
            }
        };
    })()
};


/**
 * The InterfaceProxy class.
 * @class
 * @param {Object} configMap - The interface description configuration information.
 * @param {OriginAjaxConfig|Array} additionalOptions - The basic interface configuration information.
 */
function InterfaceProxy(configMap, additionalOptions) {
    // Basic configuration information
    this.$additionalOptions = (isArray(additionalOptions) ? additionalOptions : [additionalOptions || {}]).reduce((obj1, obj2) => {
        return objCover(objClone(obj1), obj2);
    }, {});
    // Interface configuration JSON
    this.$configMap = configMap;
    // Toolkit
    this.$toolkit = toolkit;
    // model
    this.$model = this.$additionalOptions.model || null;
    // Initializes the interface and automatically generates all interface operation methods
    this.__init__();
}

InterfaceProxy.prototype = {
    /**
     * Initializes the InterfaceProxy instance.
     * @ignore
     */
    __init__: function () {
        // Variable exchange
        let configList = this.$configMap;
        // Provides the iProxy[name] operation method and points the `this` of the constructed getData to the getData[pn] itself when called
        let iProxy = this;
        // Dynamically generates the interface proxy object operation method
        for (let pn in configList) {
            if (!configList.hasOwnProperty(pn)) continue;
            /**
             * @typedef {function} interfaceMethod
             * @property {OriginAjaxConfig} interfaceInfo - The interface information from the interface configuration.
             * @property {OriginAjaxConfig} info - The interface information from the interface configuration.
             * @property {string} url - The interface URL.
             */
            iProxy[pn] = toolkit.buildInterfaceMethod(pn, this);
            iProxy[pn].$options = iProxy[pn].info = configList[pn];
            iProxy[pn].url = iProxy[pn].info.url || (iProxy[pn].info.origin || '') + iProxy[pn].info.pathname;
        }
    }
};

/**
 * The Hashes library.
 * @type {Object}
 */
InterfaceProxy.Hashes = Hashes;
/**
 * The extended axios instance.
 * @type {Function}
 */
InterfaceProxy.Ajax = extendAxios;
/**
 * The axios library.
 * @type {Object}
 */
InterfaceProxy.axios = axios;
/**
 * Sets the default options for the interface proxy.
 * @param {Object} options - The default options.
 */
InterfaceProxy.setDefault = options => {
    objCover(defaultOptions, options);
};

export default InterfaceProxy;

