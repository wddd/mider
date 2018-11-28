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

function bind(fn, thisArg) {
    return function wrap() {
        let args = new Array(arguments.length);
        for (let i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

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

//=========================================================
//  参数说明 & 默认参数
//=========================================================
let defaultOptions = {
    //----------------------------------
    //  接口数据默认配置
    //----------------------------------
    // 默认域名
    origin: null,
    // xhr send 前钩子函数
    beforeSend: new Function,
    // 参数过滤 - 默认过滤掉null字段
    paramsFilter(params) {
        Object.keys(params).forEach(key => {
            if (params[key] === null) delete params[key];
        });
        return params;
    },
    // 成功回调的数据预处理
    dataFilter: null,
    // 默认失败回调
    callback: new Function,
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
 * 接口配置项
 * @typedef {Object}    OriginAjaxConfig
 * // 基础配置
 * @property {string}   [pathname=]             - 接口路径 路径可以是相对路径也可以是绝对路径，按书写方式区分
 * @property {string}   [url=]                  - url 通常是绝对路径
 * @property {string}   [origin=""]             - 接口域名 如果一个接口存在origin配置，则会和pathname进行拼接作为具体路径。
 * @property {string}   [type="GET"]            - 操作方法 GET|POST
 * @property {string}   [dataType="json"]       - 数据类型 json|jsonp
 * @property {string}   [jsonp="jsonpCallback"] - jsonp 回调函数名
 * @property {string}   [paramsType=""]         - 参数类型
 * @property {function} [paramsFilter=""]       - 参数预处理
 * @property {string}   [dataPath=""]           - 数据路径
 * @property {function} [dataFilter=""]         - 数据预处理
 * @property {object}   [pathParams=]           - 路径参数
 * @property {boolean}  [merge=false]           - 合并
 * @property {boolean}  [queue=false]           - 排队
 * @property {boolean}  [single=false]          - 单一最后有效
 * @property {number}   [validTime=0]           - 有效时间，单位为秒，可以为浮点数
 * @property {*}        [params=null]           - 接口查询参数，{} [] "" ， 如果没有接口调用时没有对应参数，会使用这里配置的默认配置进行补充
 * @property {string}   [name=""]               - 描述接口名称，参考使用
 * @property {*}        [returns=null]          - 接口成功状态返回数据的参考格式，只是针对数据部分。例如: 返回数据:{ success:true,data:{} } => returns : {} （为data对象）
 * // 高级配置
 * @property {function} [errCallback=]          - 默认失败回调函数
 * @property {function} [ajax=]                 - ajax 调用
 * @property {function} [beforeSend=]           - 发送前钩子函数，可以用于修改header等
 * @property {function} [model=]                - 接口模型
 * @property {function} [successHandler=]       - 返回数据成功状态判断过滤器
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

// 接口请求装配工具箱
const toolkit = {

    // 生成接口最终配置
    getInterfaceConfig(key, proxyObj) {
        // 接口配置列表
        const configList = objClone(proxyObj.$configMap);

        // 预处理optionsList
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
                            // 循环mixin处理
                            result = objCover(doMixin(mixin), result);
                        } else {
                            result = objCover(objClone(mixin), objClone(result));
                        }
                    });
                }
            }
            return result;
        }

        // 拼装配置列表
        let unitOptions = doMixin(configList[key]);
        let troopOptions = proxyObj.$additionalOptions;
        let finalConfig = objCover(objCover(objClone(defaultOptions), troopOptions), unitOptions);
        finalConfig.$unitOptions = unitOptions;
        finalConfig.$troopOptions = troopOptions;
        finalConfig.$defaultOptions = defaultOptions;
        return finalConfig;
    },
    // 生成Ajax最终配置
    getAjaxConfig(args, interfaceConfig, baseConfig) {
        // 基础AJAX配置
        let ajaxConfig = objCover(objClone(interfaceConfig), baseConfig);
        /*----------------------------------------------------
         支持参数传入格式
         > callback
         > callback,errCallback
         > params,callback,errCallback
         > [pArg1,pArg2...],callback,errCallback
         > 依照Res配置默认构造方法填充未传入参数值
         ----------------------------------------------------*/
        let defaultParams = ajaxConfig.params;
        // 捕获参数
        let captureParams = {};
        let captureCallback = null;
        let captureErrCallback = null;
        let _Symbol = null;
        if (typeof Symbol !== 'undefined') {
            _Symbol = Symbol;
        }
        // 默认参数值 由接口配置生成 如果默认参数配置的类型为函数，则获取函数执行结果
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
            // 根据args捕获参数
            // 分析函数传入参数列表，提取 params,callback,errCallback
            let multiParamPattern = true;
            let multiParamNum = 0;
            [].forEach.call(args, function (param) {
                // 提取成功与失败回调函数
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
                // 提取参数列表  单独 {} 配置
                if (isObject(param)) {
                    objCover(captureParams, param);
                    multiParamPattern = false;
                }
                // 多参数配置
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
        // URL处理基本参数处理
        let url = (function () {
            if (ajaxConfig.url) return ajaxConfig.url;
            if (ajaxConfig.origin) {
                return ajaxConfig.origin + ajaxConfig.pathname;
            }
            else return ajaxConfig.pathname;
        })(ajaxConfig);
        // url path重构 pathParams
        let pathParams = ajaxConfig.pathParams;
        if (pathParams) {
            Object.keys(pathParams).forEach(key => {
                let value = pathParams[key];
                url = url.replace(new RegExp(`:${key}`), value);
            });
        }

        // ! 参数过滤器 -------------------------------------------------
        if (isFunction(ajaxConfig.paramsFilter)) {
            captureParams = ajaxConfig.paramsFilter(captureParams);
        }
        // --------------------------------------------------------------

        ajaxConfig.method = ajaxConfig.method || ajaxConfig.type;
        ajaxConfig.url = url;
        ajaxConfig.data = ajaxConfig.data || captureParams;
        if(!~['post','put','patch'].indexOf(ajaxConfig.method.toLowerCase())){
            ajaxConfig.params = captureParams;
        }
        ajaxConfig.callback = captureCallback;
        ajaxConfig.errCallback = captureErrCallback;
        // 生成请求标记
        if (ajaxConfig.validTime > 0) {
            ajaxConfig.requestMark = this.generateDataMark(ajaxConfig);
        }
        return ajaxConfig;
    },
    /**
     * 生成接口数据交换操作函数
     * @this module:InterfaceProxy
     * @param key 单个接口配置
     * @param proxyObj 接口代理对象配置
     * @returns {Function}
     * @ignore
     */
    buildInterfaceMethod: function (key, proxyObj) {
        /**
         * 构造接口调用函数
         * @param {*=} params        - 查询参数
         * @param {*=} callback      - 成功回调
         * @param {*=} errCallback   - 失败回调
         * @param {*=} methodConfig  - 代理方法配置
         */
        let proxyMethod = function (params, callback, errCallback, methodConfig) {
            let args = [].slice.call(arguments);
            // 根据各级配置生成最终配置
            let interfaceConfig = toolkit.getInterfaceConfig(key, proxyObj);
            let baseConfig = null;

            args = args.filter(function (arg) {
                if (isObject(arg) && arg[PROXY_METHOD_CONFIG_MARK]) {
                    baseConfig = arg;
                    return false;
                }
                return true;
            });

            // 根据参数和接口配置生成ajaxConfig
            let ajaxConfig = toolkit.getAjaxConfig(args, interfaceConfig, baseConfig);

            // 重新包装callback
            let wrapCallback = function () {
                /**
                 * 默认失败回调
                 * 1. 如果没有配置通用回调和专用回调，则使用默认回调
                 * 2. 如果配置了通用回调，没有专用回调，则使用通用回调
                 * 3. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回true则继续调用通用回调
                 * 4. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回false，则过程结束
                 * 专用回调[cb,then] -> 通用回调[unitOptions,troopOptions,defaultOptions]
                 */
                // 在存在配置回调 和 默认回调的情况下，包装新的回调函数
                if (ajaxConfig.errCallback && interfaceConfig.errCallback && (ajaxConfig.errCallback !== interfaceConfig.errCallback)) {
                    ajaxConfig.errCallback = (function (callback, defaultCallback) {
                        return function () {
                            return callback.apply(this, arguments) && defaultCallback.apply(this, arguments);
                        };
                    })(ajaxConfig.errCallback, interfaceConfig.errCallback);
                }
                // 无参数回调 则先使用默认回调作为ajax回调
                if (!ajaxConfig.errCallback) {
                    ajaxConfig.errCallback = interfaceConfig.errCallback;
                }
                /**
                 * 默认成功回调
                 */
                if (!ajaxConfig.callback) {
                    ajaxConfig.callback = interfaceConfig.callback;
                }
            };

            // Promise形式封装
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
                    // ajax回调 = 默认回调 则 参数回调不存在
                    // ajax回调替换为 链式回调
                    if (ajaxConfig.errCallback === interfaceConfig.errCallback) {
                        ajaxConfig.errCallback = errCallback;
                    } else {
                        // 参数回调 默认回调 都存在则先执行参数回调再执行链式回调
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
                // catch方法是 .then(null,rejection)的包装
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
    // 发起请求
    doAjax(interfaceConfig, ajaxConfig) {
        // Ajax 开始前 interceptor
        if (this.beforeAjax(interfaceConfig, ajaxConfig)) return;
        // 请求响应统一处理
        let onResponse = (type, data) => {
            // Ajax 结束后 interceptor
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
        // 绑定请求处理函数
        ajaxConfig.success = function (data, status) {
            onResponse('success', {
                data: data,
                status: status
            });
        };
        ajaxConfig.error = function (status) {
            onResponse('error', status);
        };
        // ------------------------------ 开始请求数据 ----------------------------
        // 尝试搜索本地数据
        if (interfaceConfig.validTime) {
            let localData = this.getAlreadyObtain(ajaxConfig.requestMark);
            if (localData) {
                // 匹配到本地数据
                onResponse('localSuccess', {
                    data: localData,
                    status: 200
                });
                return;
            }
        }
        // ajax 获取数据
        if (ajaxConfig.dataType === 'jsonp') {
            AjaxJsonp(objClone(ajaxConfig));
            return;
        }
        (interfaceConfig.ajax || extendAxios)(objClone(ajaxConfig));
    },
    // 请求前
    beforeAjax(interfaceConfig, ajaxConfig) {
        let flag = this.requestManager.start(interfaceConfig, ajaxConfig);
        if (!flag) {
            // 加载中开关
            if (isFunction(interfaceConfig.optLoadingSwitch)) {
                interfaceConfig.optLoadingSwitch(true);
            }
        }
        return flag;
    },
    // 请求后
    afterAjax(interfaceConfig, ajaxConfig) {
        // 加载中开关
        if (isFunction(interfaceConfig.optLoadingSwitch)) {
            interfaceConfig.optLoadingSwitch(false);
        }
        return this.requestManager.finish(interfaceConfig, ajaxConfig);
    },
    /**
     * Ajax数据预处理
     * 200+>接收数据处理:成功
     * @param response
     * @param {} response.data
     * @param interfaceConfig
     * @param ajaxConfig
     * @this module:InterfaceProxy
     * @ignore
     */
    AjaxGetSuccessProcess: function (response, interfaceConfig, ajaxConfig) {
        // 基础配置
        let opt = objCover({}, response);

        // 配置项转化
        let data = opt.data;
        let status = opt.status;
        let callback = ajaxConfig.callback;
        let errCallback = ajaxConfig.errCallback;
        let isLocalObtain = opt.isLocalObtain;

        // 数据缓存处理
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
                // 提取数据
                arguments[0] = interfaceConfig.dataPath ? getObjAttr(extractData, interfaceConfig.dataPath) : arguments[0];
                arguments[0] = isFunction(interfaceConfig.dataFilter) ? interfaceConfig.dataFilter(arguments[0], interfaceConfig.dataType) : arguments[0];
                return callback.apply(null, arguments);
            };
        }

        /*----------------------------------------------------
         接口返回值类型（200）
         > 空 : 视为成功
         > {success:true,...}
         判断后进行成功或失败回调
         > data | msg  : 成功时尝试提取data，失败时尝试提取msg
         ----------------------------------------------------*/

        // 自定义成功状态判断机制
        if (isFunction(interfaceConfig.successHandler)) {
            let result = interfaceConfig.successHandler(data) || {};
            if (result.success === true) {
                return callbackEx && callbackEx(result.data);
            }
            if (result.success === false) {
                return errCallback(result.msg, data);
            }
        }
        // 当返回数据为空 > 直接当做成功
        if (!data) {
            return callbackEx && callbackEx(null);
        }
        // 依据success标识提取返回数据
        if (data.success === true) {
            // 提取data数据
            if (!isUndefined(data.data)) {
                return callbackEx && callbackEx(data.data, data, status);
            }
            return callbackEx && callbackEx(data, data, status);
        }
        if (data.success === false) {
            return errCallback && errCallback(data.msg, data);
        }
        // 当返回数据不包含success字段 > 视为成功
        if (isUndefined(data.success)) {
            return callbackEx && callbackEx(data, data);
        }
    },
    /**
     * 200X>接收数据处理:失败
     * @param error
     * @param interfaceConfig
     * @param ajaxConfig
     * @this module:InterfaceProxy
     * @ignore
     */
    AjaxGetFailProcess: function (error, interfaceConfig, ajaxConfig) {
        // AJAX 失败
        ajaxConfig.errCallback && ajaxConfig.errCallback(error.message, error);
    },
    /**
     * 生成数据标记
     * @param ajaxConfig
     * @returns {string}
     * @this module:InterfaceProxy
     * @ignore
     */
    generateDataMark: function (ajaxConfig) {
        let dataMark = JSON.stringify(ajaxConfig);
        dataMark = Hashes.hex_hmac(dataMark, '888');
        return dataMark;
    },
    /**
     * 获得数据
     * @param key
     * @returns {*}
     * @this module:InterfaceProxy
     * @ignore
     */
    getAlreadyObtain: function (key) {
        let data = this.repository.get(key);
        if (data) {
            return data.responseData;
        }
        return null;
    },
    // 请求队列
    requestManager: (function () {
        function RequestManager() {
            // 写点啥呢...
        }

        RequestManager.prototype = [];
        RequestManager.prototype.constructor = RequestManager;
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
        RequestManager.prototype.start = function (interfaceConfig, ajaxConfig) {
            // 唯一
            if (interfaceConfig.single) {
                this.removeItem(interfaceConfig);
            }
            // 合并
            if (interfaceConfig.merge) {
                const sameRequest = this.find(r => this.requestQueryEqual(r, {
                    interfaceConfig: interfaceConfig,
                    ajaxConfig: ajaxConfig
                }));
                if (sameRequest) {
                    // 异步执行包装回调的代码 Reason : .then .error .finally
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
            // 入队
            this.push.call(this, {
                interfaceConfig: interfaceConfig,
                ajaxConfig: ajaxConfig,
                timeStamp: new Date()
            });
        };
        RequestManager.prototype.finish = function (interfaceConfig, ajaxConfig) {
            // 排队
            if (interfaceConfig.queue) {
                // 找到同接口存在的前一个请求
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
                    // 将回调附加到next函数上，等待队列前的请求调用next进行回调触发
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
            // 清除
            if (!this.removeItem(interfaceConfig, ajaxConfig)) {
                // single : 如果请求已从队列中移除，则终止处理流程
                if (interfaceConfig.single) return true;
            }
        };
        return new RequestManager();
    })(),
    // 持久化存储
    repository: (function () {
        let ls = window.localStorage;
        return {
            push: function (params) {
                // 保存新的数据
                ls[params.key] = JSON.stringify({
                    timeStamp: params.timeStamp,
                    validTime: params.validTime,
                    responseData: params.data
                });
            },
            get: function (key) {
                this.clean();
                return JSON.parse(ls.getItem(key) || 'null');
            },
            // 清理过期缓存
            clean: function () {
                // 清除过期缓存
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
 * 接口管理器
 * new InterfaceProxy(interfaceConfig,additionalOptions) 来生成接口操作对象(return)
 * @module InterfaceProxy
 * @param {object}              configMap 接口描述配置信息unitInfo[]
 * @param {OriginAjaxConfig|Array}    additionalOptions 接口基础配置信息
 * @constructor
 */
function InterfaceProxy(configMap, additionalOptions) {
    // 基础配置信息
    this.$additionalOptions = (isArray(additionalOptions) ? additionalOptions : [additionalOptions || {}]).reduce((obj1, obj2) => {
        return objCover(objClone(obj1), obj2);
    }, {});
    // 接口配置JSON
    this.$configMap = configMap;
    // 装配工具箱
    this.$toolkit = toolkit;
    // model
    this.$model = this.$additionalOptions.model || null;
    // 初始化接口 - 自动生成所有接口操作方法
    this.__init__();
}

InterfaceProxy.prototype = /**@lends module:InterfaceProxy# */{
    /**
     * 初始化
     * @this module:InterfaceProxy
     * @ignore
     */
    __init__: function () {
        // 变量交换
        let configList = this.$configMap;
        // 提供 iProxy[name] 操作方法 | 将 构造的getData在调用时的this指向getData[pn]本体
        let iProxy = this;
        // 动态生成接口代理对象操作方法
        for (let pn in configList) {
            if (!configList.hasOwnProperty(pn)) continue;
            /**
             * @typedef {function} interfaceMethod          - 自动生成的接口操作方法
             * @property {OriginAjaxConfig} interfaceInfo   - 接口信息，来源接口配置
             * @property {OriginAjaxConfig} info            - 接口信息，来源接口配置
             * @property {string} url                       - 接口URL
             */
            iProxy[pn] = toolkit.buildInterfaceMethod(pn, this);
            iProxy[pn].$options = iProxy[pn].info = configList[pn];
            iProxy[pn].url = iProxy[pn].info.url || (iProxy[pn].info.origin || '') + iProxy[pn].info.pathname;
        }
    }
};

// 导出Hashes
InterfaceProxy.Hashes = Hashes;
// 导出Ajax
// InterfaceProxy.Ajax = Ajax;
InterfaceProxy.Ajax = extendAxios;
InterfaceProxy.axios = axios;
// 修改全局默认配置API
InterfaceProxy.setDefault = options => {
    objCover(defaultOptions, options);
};

window.InterfaceProxy = InterfaceProxy;
export default InterfaceProxy;

