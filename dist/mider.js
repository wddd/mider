(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["$wd"] = factory();
	else
		root["$wd"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InterfaceProxy = exports.FileUploader = exports.$wd = undefined;

var _utils = __webpack_require__(1);

var _utils2 = _interopRequireDefault(_utils);

var _upload = __webpack_require__(6);

var _upload2 = _interopRequireDefault(_upload);

var _interfaceProxy = __webpack_require__(7);

var _interfaceProxy2 = _interopRequireDefault(_interfaceProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_utils2.default.FileUploader = _upload2.default; /**
                                                  * 入口文件
                                                  * @author wdzxc
                                                  */

_utils2.default.InterfaceProxy = _interfaceProxy2.default;

if (window) {
    window.$wd = _utils2.default;
    window.FileUploader = _upload2.default;
    window.InterfaceProxy = _interfaceProxy2.default;
}

exports.default = _utils2.default;
exports.$wd = _utils2.default;
exports.FileUploader = _upload2.default;
exports.InterfaceProxy = _interfaceProxy2.default;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isWhat = __webpack_require__(2);

var _objectOpt = __webpack_require__(3);

var _url = __webpack_require__(4);

__webpack_require__(5); /**
                                  * 公共函数库
                                  * @author wdzxc
                                  */

var $wd = {};

//=========================================================
//  兼容性处理
//=========================================================
// console
console.log || (console.log = new Function());
console.warn || (console.warn = console.log);
console.error || (console.error = console.log);

//=========================================================
// 链式调用 Promise
// $wd.promise( function(next){ next(data) }).then( function(next,data){ next() })
// 如果使用 .then.then.sync() 会同步开始调用过程
//=========================================================
/**
 * 链式调用&Promise
 * @param callback {function} 回调函数
 * @returns object
 * @memberof $wd
 * @example
 *
 * $wd.promise(function (next) {
 *    console.log('1');
 *    next();
 * })
 * .then(function (next) {
 *    console.log('2');
 *    next();
 * })
 * .then(function (next) {
 *    console.log('3');
 *    next();
 * }).sync();
 * console.log("start");
 *
 * // => 1 2 3 start
 * // 去掉 .sync()
 * // => start 1 2 3
 *
 */
function promise(callback) {
    var start = false,
        resolveQueue = [],
        rejectQueue = [],
        _resolve = void 0,
        reject = void 0;
    _resolve = function resolve() {
        rejectQueue.shift();
        (resolveQueue.shift() || function () {}).apply(this, [_resolve, reject].concat([].slice.call(arguments, 0)));
    };
    reject = function reject() {
        (rejectQueue.shift() || function () {}).apply(this, [].concat([].slice.call(arguments, 0)));
        rejectQueue = [];
    };
    setTimeout(function () {
        !start && callback(_resolve, reject);
    }, 1);
    return {
        then: function then(resolve, reject) {
            resolveQueue.push(resolve);
            rejectQueue.push(reject);
            return this;
        },
        sync: function sync() {
            start = true;
            callback(_resolve, reject);
        }
    };
}

//=========================================================
//  异步加载资源
//=========================================================
/**
 * 获取JS
 * @param {string} src JS路径
 * @param {function} callback 获取成功后回调
 * @returns {boolean} 返回true表示页面上没有这个JS开始进行加载，返回false表示已经存在这个JS文件不进行加载
 * @memberof $wd
 */
function getScript(src, callback) {
    // 页面脚本
    if (src) {
        var curScripts = document.querySelectorAll('script');
        for (var i = 0; i < curScripts.length; i++) {
            if (curScripts[i].getAttribute('src') === src) {
                callback('exist');
                return false;
            }
        }
        var pageScript = document.createElement('script');
        pageScript.type = 'text/javascript';
        pageScript.src = src;
        document.head.appendChild(pageScript);
        pageScript.onload = function () {
            console.log("script load success [" + this.getAttribute('src') + "]");
            callback(true);
        };
        pageScript.onerror = function () {
            console.log("script load error [" + this.getAttribute('src') + "]");
            callback('error');
        };
    }
}

//=========================================================
//  对外提供的功能
//=========================================================


$wd.objClone = _objectOpt.objClone;
$wd.getObjAttr = _objectOpt.getObjAttr;

$wd.parseURL = _url.parseURL;
$wd.buildURL = _url.buildURL;

$wd.objCover = _objectOpt.objCover;
$wd.objClear = _objectOpt.objClear;
$wd.objEqual = _objectOpt.objEqual;
$wd.objExtract = _objectOpt.objExtract;
$wd.objMix = _objectOpt.objMix;
$wd.setObjAttr = _objectOpt.setObjAttr;

$wd.getScript = getScript;

// export
$wd.$wd = $wd;
$wd.isArray = _isWhat.isArray;
$wd.isNumber = _isWhat.isNumber;
$wd.isObject = _isWhat.isObject;
$wd.isString = _isWhat.isString;
$wd.isFunction = _isWhat.isFunction;
$wd.isUndefined = _isWhat.isUndefined;

exports.default = $wd;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * 类型检查
 * @param type
 * @returns {function(*=): boolean}
 */
function isType(type) {
  return function (obj) {
    return {}.toString.call(obj) === "[object " + type + "]";
  };
}

/**
 * 类型检查 Undefined
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isUndefined = isType("Undefined");
/**
 * 类型检查 Object
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isObject = isType("Object");
/**
 * 类型检查 Number
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isNumber = isType("Number");
/**
 * 类型检查 Array
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isArray = Array.isArray || isType("Array");
/**
 * 类型检查 Function
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isFunction = isType("Function");
/**
 * 类型检查 String 验证 字符串字面量 和 new String()
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
var isString = function isString(obj) {
  return isType("String")(obj) || obj instanceof String;
};

exports.isUndefined = isUndefined;
exports.isObject = isObject;
exports.isArray = isArray;
exports.isFunction = isFunction;
exports.isString = isString;
exports.isNumber = isNumber;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.objMix = exports.objExtract = exports.objEqual = exports.objClear = exports.objCover = exports.setObjAttr = exports.getObjAttr = exports.objClone = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; //=========================================================
// Object Operate
//=========================================================


var _isWhat = __webpack_require__(2);

/**
 * 对象复制
 * 其中的成员如果为对象{object}，则也进行复制操作
 * @param {Object|Array|Number|String} obj 目标对象
 * @returns {*} 返回复制的对象
 * @memberof $wd
 */
function objClone(obj) {
    var newObj = {};
    if ((0, _isWhat.isArray)(obj)) {
        newObj = obj.map(function (e) {
            return objClone(e);
        });
        return newObj;
    }
    if ((0, _isWhat.isObject)(obj)) {
        for (var an in obj) {
            if (!obj.hasOwnProperty(an)) continue;
            if ((0, _isWhat.isArray)(obj[an])) newObj[an] = obj[an].slice();else newObj[an] = (0, _isWhat.isObject)(obj[an]) ? objClone(obj[an]) : obj[an];
        }
        return newObj;
    }
    return obj;
}

/**
 * 提取object对应路径的属性
 * @param data {object} 提取目标
 * @param path {string}提取路径 'a.b.c'
 * @returns {*} 如果找对对应路径的属性则返回属性值，找不到则返回undefined
 * @memberof $wd
 * @example
 *      // 示例
 *      let obj = {
     *         a: {
     *             ao: {
     *                aoo:100
     *             }
     *         }
     *      };
 *      $wd.getObjAttr(obj, 'a.ao');            // => {aoo:100}
 *      $wd.getObjAttr(obj, 'a.ao.aoo');        // => 100
 *      $wd.getObjAttr(obj, 'a.an.aoo');        // => undefined
 *
 */
function getObjAttr(data, path) {
    var result = data;
    if (!path) return result;
    try {
        path.split('.').forEach(function (name) {
            result = result[name];
        });
    } catch (e) {
        return;
    }
    return result;
}

/**
 * 设置object对应路径的属性
 * 如果中间路径不存在则自动创建
 * @param {object} data  设置目标
 * @param {string} path  设置路径 'a.b.c'
 * @param {*} value 设置的新值
 * @returns {*} 如果找对对应路径的属性则返回属性值
 * @memberof $wd
 * @example
 *
 *    $wd.setObjAttr({
     *       a: {a1:998},
     *       b: 2,
     *       c: {
     *           c1: 3
     *       }
     *    }, 'a.aa.aaa', 998);
 *
 *    // => { a:{aa:{aaa:998},a1:998},b:2...}
 */
function setObjAttr(data, path, value) {
    var result = data;
    if (!path) return result;
    try {
        path.split('.').forEach(function (name, index) {
            if (index === path.split('.').length - 1) {
                result[name] = value;
                return;
            }
            if (!(0, _isWhat.isObject)(result[name])) result[name] = {};
            result = result[name];
        });
    } catch (e) {
        return;
    }
    return data;
}

/**
 * 对象属性覆盖
 * @param {object} obj1 被覆盖对象 会被修改
 * @param {object} obj2 覆盖对象
 * @param {(string|function)=} process 处理每个覆盖属性的回调 可选参数 会使用函数返回值作为新值
 * @returns {object} 被覆盖处理后的对象
 * @memberof $wd
 * @example
 *
 *      // 示例
 *      let obj1 = {a:1,b:2},obj2={a:3,c:4};
 *      $wd.objCover(obj1,obj2);
 *      // => {a:3,b:2,c:4}
 *      // obj1 = {a:3,b:2,c:4}
 *
 */
function objCover(obj1, obj2, process) {
    for (var an in obj2) {
        if (!obj2.hasOwnProperty(an) || process === 'one-to-one' && !obj1.hasOwnProperty(an)) continue;
        obj1[an] = (0, _isWhat.isFunction)(process) ? process(obj2[an], an, obj1[an]) : obj2[an];
    }
    return obj1;
}

/**
 * 对象属性覆盖
 * @param {object} obj 清空的对象 会被修改
 * @param {Number} [degree=VeryBig] 清空的深度
 * @returns {object} 处理后的对象
 * @memberof $wd
 * @example
 *
 *      // 示例
 *      let obj1 = {a:1,b:2};
 *      $wd.objClear(obj1,obj2);
 *      // => {a:null,b:null}
 *      // obj1 = {a:null,b:null}
 *
 */
function objClear(obj, degree) {
    var searchDegree = degree >= 0 ? degree : -1 >>> 1;
    if (searchDegree < 1) return obj;
    if ((0, _isWhat.isObject)(obj)) {
        Object.keys(obj).forEach(function (pn) {
            if ((0, _isWhat.isObject)(obj[pn])) {
                objClear(obj[pn], degree - 1);
            } else if ((0, _isWhat.isArray)(obj[pn])) {
                obj[pn].splice(0, obj[pn].length);
            } else {
                obj[pn] = null;
            }
        });
    }
    return obj;
}

/**
 * 比较两个对象是否相等
 * 默认进行==比较 ""==false==[]
 * @param obj1 对象1
 * @param obj2 对象2
 * @param attr {(string|array)=} 对象属性   a,b,c ['a','b','c']
 * @returns {boolean}
 * @memberof $wd
 * @example
 *
 *      // 示例
 *      let obj1 = {a:1,b:2},obj2={a:1,c:2},obj3={a:2};
 *      $wd.objEqual(obj1,obj2);
 *      // => true
 *      $wd.objEqual(obj1,obj3);
 *      // => false
 *
 */
function objEqual(obj1, obj2, attr) {
    var attrList = [];
    if (obj1 === obj2) return true;
    if (!(0, _isWhat.isObject)(obj1) || !(0, _isWhat.isObject)(obj2)) return false;

    var _loop = function _loop(an) {
        if (attr) {
            if ((0, _isWhat.isString)(attr)) attrList = attr.split(",");
            if (attrList.filter(function (e) {
                return e === an;
            }).length <= 0) return 'continue';
        }
        if (!obj2.hasOwnProperty(an)) return 'continue';
        if (obj2[an] === obj1[an]) return 'continue';
        return {
            v: false
        };
    };

    for (var an in obj2) {
        var _ret = _loop(an);

        switch (_ret) {
            case 'continue':
                continue;

            default:
                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        }
    }
    return true;
}

/**
 * 对象属性提取
 * 现在主要用于构造提交的表单数据
 * @param {object} obj 被提取属性的目标对象 可以为对象的数组  [obj , ...]
 * @param {(string[]|string)} options 提取规则   数组 : [option , ...]  option: 'oldName=>newName' | 'oldName=newName' | 'oldName'   字符串 : 'oldName=>newName,oldName2=>newName2'
 * @param {(boolean)=} [except=false] 第二个配置项的属性列表是否为排除模式
 * @returns {object|Array.<object>} 使用提取属性构造的新对象或数组
 * @memberof $wd
 * @example
 *
 *      // 从对象中抽取数据
 *      let obj = {red:255,name:'peter'};
 *      $wd.objExtract(obj,["red=>colorRed","name=>lastName"]);     // => { colorRed:255,lastName:'peter' }
 *      $wd.objExtract(obj,"red=>colorRed,name"]);                  // => { colorRed:255,name:'peter' }
 *
 *      // 从对象数组中抽取数据
 *      let arr = [obj,obj];
 *      $wd.objExtract(obj,["red=>colorRed","lastName"]);           // => [{ colorRed:255,lastName:'peter' },{ colorRed:255,name:'peter' }]
 *
 *      // 自动生成路径
 *      $wd.objExtract({
     *             a: 1,
     *             b: { b1: 2 },
     *             c: 3
     *          },
 *          "a,b.b1=>bb1,c=>z.x.c.v.b.n.m"
 *      );
 *      // 结果如下 =>
 *      //      {
     *      //         a: 1,
     *      //         bb1: 2,
     *      //         z:{x:{c:{v:{b:{n:{m:3}}}}}}
     *      //      }
 *
 */
function objExtract(obj, options, except) {
    // 提取 对应名称的属性
    var result = [],
        temp = void 0,
        originObj = objClone(obj),
        originOpt = options;
    (0, _isWhat.isUndefined)(options) && (originOpt = []);
    // 支持 使用逗号分隔的字符串生成配置数组 "oldName=>newName , oldName=>newName"
    (0, _isWhat.isString)(options) && (temp = options) && (originOpt = options.split(','));
    // 支持 从数组提取对象数组 obj [{a:1},{a:2}]  => [{b:1},{b:2}]
    !(0, _isWhat.isArray)(obj) && (temp = originObj) && (originObj = []) && originObj.push(temp);
    originObj.forEach(function (unit) {
        // except pattern
        if (except) {
            temp = unit;
            originOpt.forEach(function (name) {
                delete temp[name];
            });
        }
        // extract pattern
        if (!except) {
            temp = {};
            originOpt.forEach(function (name) {
                var resolveReg = /([^=>,]+)=[>]?([^=>,]+)/; // 支持中文
                if (resolveReg.test(name)) {
                    // 支持 'oldName=>newName' 'oldName=newName'
                    var originName = resolveReg.exec(name)[1];
                    var replaceName = resolveReg.exec(name)[2];
                    !(0, _isWhat.isUndefined)(getObjAttr(unit, originName)) && setObjAttr(temp, replaceName, getObjAttr(unit, originName));
                } else {
                    // 支持 'name'
                    !(0, _isWhat.isUndefined)(getObjAttr(unit, name)) && setObjAttr(temp, name, getObjAttr(unit, name));
                }
            });
        }
        result.push(temp);
    });
    if (!(0, _isWhat.isArray)(obj)) return result[0];
    return result;
}

function objMix(options, coverOptions, degree) {
    var searchDegree = degree >= 0 ? degree : -1 >>> 1;
    if (searchDegree < 1) return false;
    if ((0, _isWhat.isUndefined)(options) || (0, _isWhat.isUndefined)(coverOptions)) {
        return false;
    }
    if ((0, _isWhat.isArray)(coverOptions)) {
        if (!(0, _isWhat.isArray)(options)) {
            options = [];
        }
        coverOptions.forEach(function (value, index) {
            if (!objMix(options[index], coverOptions[index], searchDegree - 1)) {
                options[index] = coverOptions[index];
            }
        });
        return true;
    }
    if ((0, _isWhat.isObject)(coverOptions)) {
        if (!(0, _isWhat.isObject)(options)) {
            options = {};
        }
        // keys & symbols
        Object.keys(coverOptions).concat(Object.getOwnPropertySymbols(coverOptions)).forEach(function (key) {
            if (!objMix(options[key], coverOptions[key], searchDegree - 1)) {
                options[key] = coverOptions[key];
            }
        });
        return true;
    }
    return false;
}

exports.objClone = objClone;
exports.getObjAttr = getObjAttr;
exports.setObjAttr = setObjAttr;
exports.objCover = objCover;
exports.objClear = objClear;
exports.objEqual = objEqual;
exports.objExtract = objExtract;
exports.objMix = objMix;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildURL = exports.parseURL = undefined;

var _isWhat = __webpack_require__(2);

var _objectOpt = __webpack_require__(3);

/**
 * 解析URL 返回 解析数据对象
 * @param {string} url 需要解析的URL
 * @return {{source: *, query, origin: (*|string|string), params: {}, hashQuery, hashParams: {}, protocol: (string|XML|void|*), host, port, file: (*|string), hash: (string|XML|void|*), path: (string|XML|void|*), relative: (*|string), segments: Array, rebuild: rebuild}}
 * @memberof $wd
 */
//=========================================================
//  URL解析
//=========================================================
function parseURL(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        query: a.search,
        origin: a.origin || a.href.match(/\w+:\/\/[^\/\\]+/),
        params: function () {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&');
            if (seg == false) return {};
            seg.forEach(function (e, index, arr) {
                arr[index] = {
                    name: e.split('=')[0],
                    value: decodeURI(e.split('=')[1])
                };
            });
            seg.forEach(function (e) {
                var name = e.name;
                var obj = [];
                if (typeof ret[name] === 'undefined') {
                    seg.forEach(function (e) {
                        if (e.name === name) obj.push(e.value);
                    });
                    if (obj.length === 1) ret[name] = obj[0];else ret[name] = obj;
                }
            });
            return ret;
        }(),
        hashQuery: function () {
            return a.hash.match(/(?=\?).*/) && a.hash.match(/(?=\?).*/)[0] || "";
        }(),
        hashParams: function () {
            if (!/.*\?/.test(a.hash)) return {};
            var ret = {},
                seg = a.hash.replace(/.*\?/g, '').split('&');
            seg.forEach(function (e, index, arr) {
                arr[index] = {
                    name: e.split('=')[0],
                    value: decodeURIComponent(e.split('=')[1])
                };
            });
            seg.forEach(function (e) {
                var name = e.name;
                var obj = [];
                if (typeof ret[name] === 'undefined') {
                    seg.forEach(function (e) {
                        if (e.name === name) obj.push(e.value);
                    });
                    if (obj.length === 1) ret[name] = obj[0];else ret[name] = obj;
                }
            });
            return ret;
        }(),
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || ['', ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || ['', ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/'),
        rebuild: function rebuild() {
            return buildURL({
                url: this.url,
                hash: this.hash,
                origin: this.origin,
                source: this.source,
                path: this.path,
                params: this.params
            });
        }
    };
}

/**
 * 构建URL
 * @param {object} options
 * @param {string} [options.url=]       具体url
 * @param {string} [options.hash=]      hash
 * @param {string} [options.origin=]    域名
 * @param {string} [options.source=]    source
 * @param {string} [options.path=]      路径
 * @param {object} [options.params=]    参数
 * @returns {string}
 */
function buildURL(options) {
    var urlInfo = parseURL(options.url || options.source);
    (0, _objectOpt.objCover)(urlInfo, (0, _objectOpt.objExtract)(options, "url", true));
    urlInfo.path = urlInfo.path.replace(/^(?=[^\/])/, '/');

    var paramsStr = "";
    Object.keys(urlInfo.params).forEach(function (key) {
        var value = urlInfo.params[key];
        if (value === null || value === undefined) return;
        if (!(0, _isWhat.isArray)(value)) value = [value];
        value.forEach(function (value) {
            if ((0, _isWhat.isObject)(value)) value = encodeURIComponent(JSON.stringify(value));
            paramsStr += (paramsStr ? "&" : "") + key + '=' + encodeURIComponent(value);
        });
    });
    return urlInfo.origin + urlInfo.path + (paramsStr ? "?" + paramsStr : "") + (urlInfo.hash ? "#" + urlInfo.hash : "");
}

exports.parseURL = parseURL;
exports.buildURL = buildURL;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 数组操作兼容低版本浏览器
 */
// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function value(predicate) {
            // 1. Let O be ? ToObject(this value).
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If IsCallable(predicate) is false, throw a TypeError exception.
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
            var thisArg = arguments[1];

            // 5. Let k be 0.
            var k = 0;

            // 6. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ! ToString(k).
                // b. Let kValue be ? Get(O, Pk).
                // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                // d. If testResult is true, return kValue.
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                // e. Increase k by 1.
                k++;
            }

            // 7. Return undefined.
            return undefined;
        },
        configurable: true,
        writable: true
    });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _isWhat = __webpack_require__(2);

/**
 * 分析返回值  object | string => object
 * @param resContent
 */
function parseRetData(resContent) {
    var retData = void 0;
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
/**
 * 文件上传组件
 * @author wdzxc
 */

/**
 * 扩展元素组件
 * @module FileUploader
 */

// 依赖
var FileUploader = function FileUploader(config) {
    var options = {
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
    for (var an in config) {
        if (!config.hasOwnProperty(an)) continue;
        options[an] = config[an];
    }

    // 文件类型&大小检查
    function fileInspect(file) {
        if (!file) {
            options.errCallback && options.errCallback("没有选中任何文件");
            return false;
        }
        // 检查文件类型是否符合标准
        var typeMatch = true;
        if (options.fileType) {
            typeMatch = false;
            if ((0, _isWhat.isString)(options.fileType)) {
                options.fileType = options.fileType.split(',');
            }
            if ((0, _isWhat.isArray)(options.fileType)) {
                options.fileType.forEach(function (type) {
                    (0, _isWhat.isString)(type) && file.name.match(/\.[^.]*$/) && file.name.match(/\.[^.]*$/)[0].toLowerCase().indexOf(type) >= 0 && (typeMatch = true);
                });
            }
        }
        if (!typeMatch) {
            options.errCallback && options.errCallback("文件类型错误！正确类型:" + options.fileType.join(','));
            return false;
        }
        if ((0, _isWhat.isString)(options.fileSize)) {
            var fileLimit = options.fileSize.split(/~|-|,/);
            var compareSize = file.size / 1024;
            if (fileLimit.length == 2) {
                if (compareSize < fileLimit[0] || compareSize > fileLimit[1]) {
                    options.errCallback && options.errCallback("文件大小错误(" + parseInt(compareSize) + "kb)!尺寸范围：" + fileLimit.join('~') + ' kb');
                    return false;
                }
            } else if (fileLimit.length == 1) {
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
    var xhr = new XMLHttpRequest();
    options.uploadElem.addEventListener('change', function () {
        previewImage();
    });

    // 创建文件的URL
    var createObjectURL = function createObjectURL(blob) {
        return window[window["webkitURL"] ? 'webkitURL' : 'URL']['createObjectURL'](blob);
    };

    // 预览图片
    function previewImage(imageFile) {

        // 预览参数图片 或 表单图片
        var file = imageFile || options.uploadElem.files[0];
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
        extractFiles: function extractFiles(targetFiles) {
            var files = targetFiles || options.uploadElem.files;
            var file = files[0];
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
        send: function send(targetFiles) {
            var file = this.extractFiles(targetFiles);
            // 构造表单数据
            var formData = new FormData();
            (0, _isWhat.isFunction)(options.beforeSend) && options.beforeSend(file);
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
                var loaded = evt.loaded;
                var total = evt.total;
                var percent = Math.floor(100 * loaded / total);
                console.log(percent);
                options.imgElem.style.opacity = percent / 100;
                options.uploading && options.uploading(percent);
            };
            xhr.open("post", options.uploadUrl);
            xhr.send(formData);
        },
        // 传递协同 额外文件
        synergy: function synergy(remainFiles) {
            if (options.partner && remainFiles) {
                setTimeout(function () {
                    options.partner.send(remainFiles);
                }, 300);
            }
            previewImage(remainFiles[0]);
        },
        options: options
    };
};
FileUploader.prototype = {};

// module.exports = FileUploader;
exports.default = FileUploader;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sha = __webpack_require__(8);

var _sha2 = _interopRequireDefault(_sha);

var _jsonp = __webpack_require__(9);

var _jsonp2 = _interopRequireDefault(_jsonp);

var _axios = __webpack_require__(10);

var _axios2 = _interopRequireDefault(_axios);

var _isWhat = __webpack_require__(2);

var _objectOpt = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
} /**
   * 接口代理模块
   * @author wdzxc
   */
/*===============================================================================================*/

function ExtendAxios() {
    return bind(function (options) {
        var axiosOptions = (0, _objectOpt.objClone)(options);
        var callback = options.success;
        var errCallback = options.error;
        // method & type
        axiosOptions.method = axiosOptions.method || axiosOptions.type;
        // responseType & dataType
        axiosOptions.responseType = axiosOptions.responseType || axiosOptions.dataType;
        // headers
        axiosOptions.headers = axiosOptions.headers || {};
        if (axiosOptions.responseType === 'html') {
            axiosOptions.headers["Accept"] = "text/html, */*";
        }
        if (axiosOptions.responseType === 'text') {
            axiosOptions.headers["Accept"] = "text/plain, */*";
        }
        // options polyfill
        if (axiosOptions.method === 'post') {
            axiosOptions.data = axiosOptions.data || axiosOptions.params;
            axiosOptions.params = null;
            axiosOptions.headers["Content-Type"] = axiosOptions.headers["Content-Type"] || "application/json";
        }
        if (axiosOptions.beforeSend) {
            var fakeXhr = {
                setRequestHeader: function setRequestHeader(key, value) {
                    axiosOptions.headers[key] = value;
                }
            };
            axiosOptions.beforeSend(fakeXhr);
        }
        (0, _axios2.default)(axiosOptions).then(function (response) {
            callback(response.data, response.status);
        }).catch(function (error) {
            errCallback(error);
        });
    }, _axios2.default);
}

var extendAxios = new ExtendAxios();

//=========================================================
//  参数说明 & 默认参数
//=========================================================
var defaultOptions = {
    //----------------------------------
    //  接口数据默认配置
    //----------------------------------
    // 默认域名
    origin: null,
    // xhr send 前钩子函数
    beforeSend: new Function(),
    // 参数过滤 - 默认过滤掉null字段
    paramsFilter: function paramsFilter(params) {
        Object.keys(params).forEach(function (key) {
            if (params[key] === null) delete params[key];
        });
        return params;
    },

    // 成功回调的数据预处理
    dataFilter: null,
    // 默认失败回调
    callback: new Function(),
    errCallback: new Function(),
    // ajax default
    type: "get",
    dataType: "json",
    contentType: "application/json; charset=utf-8",
    traditional: true,
    jsonp: null, // jsonpCallback
    // modify header
    fakeHeaders: null
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
 * @property {object}   [pathParams=]           - 加载中提示
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
var toolkit = {

    // 生成接口最终配置
    getInterfaceConfig: function getInterfaceConfig(key, proxyObj) {
        // 接口配置列表
        var configList = (0, _objectOpt.objClone)(proxyObj.$configMap);

        // 预处理optionsList
        function doMixin(config) {
            var result = config;
            if (config.mixins) {
                var mixinTarget = config.mixins;
                if ((0, _isWhat.isString)(mixinTarget) || (0, _isWhat.isObject)(mixinTarget)) {
                    mixinTarget = [mixinTarget];
                }
                if ((0, _isWhat.isArray)(mixinTarget)) {
                    mixinTarget.reverse().map(function (mixin) {
                        if ((0, _isWhat.isString)(mixin)) {
                            return configList[mixin];
                        }
                        if ((0, _isWhat.isObject)(mixin)) return mixin;
                        // console.error("InterfaceProxy Mixin ERROR.");
                    }).forEach(function (mixin) {
                        if (mixin.mixins) {
                            // 循环mixin处理
                            result = (0, _objectOpt.objCover)(doMixin(mixin), result);
                        } else {
                            result = (0, _objectOpt.objCover)((0, _objectOpt.objClone)(mixin), (0, _objectOpt.objClone)(result));
                        }
                    });
                }
            }
            return result;
        }

        // 拼装配置列表
        var unitOptions = doMixin(configList[key]);
        var troopOptions = proxyObj.$additionalOptions;
        var finalConfig = (0, _objectOpt.objCover)((0, _objectOpt.objCover)((0, _objectOpt.objClone)(defaultOptions), troopOptions), unitOptions);
        finalConfig.$unitOptions = unitOptions;
        finalConfig.$troopOptions = troopOptions;
        finalConfig.$defaultOptions = defaultOptions;
        return finalConfig;
    },

    // 生成Ajax最终配置
    getAjaxConfig: function getAjaxConfig(args, interfaceConfig, baseConfig) {
        // 基础AJAX配置
        var ajaxConfig = (0, _objectOpt.objCover)((0, _objectOpt.objClone)(interfaceConfig), baseConfig);
        /*----------------------------------------------------
         支持参数传入格式
         > callback
         > callback,errCallback
         > params,callback,errCallback
         > [pArg1,pArg2...],callback,errCallback
         > 依照Res配置默认构造方法填充未传入参数值
         ----------------------------------------------------*/
        var defaultParams = ajaxConfig.params;
        // 捕获参数
        var captureParams = {};
        var captureCallback = null;
        var captureErrCallback = null;
        var _Symbol = null;
        if (typeof Symbol !== 'undefined') {
            _Symbol = Symbol;
        }
        // 默认参数值 由接口配置生成 如果默认参数配置的类型为函数，则获取函数执行结果
        Object.keys(defaultParams || {}).forEach(function (key) {
            var value = defaultParams[key];
            if (value === Number || value === String || value === Array || value === Boolean || value === Function || value === _Symbol || value === Object) {
                captureParams[key] = null;
                return;
            }
            if ((0, _isWhat.isObject)(value)) {
                value = value.default || null;
            }
            if ((0, _isWhat.isFunction)(value)) {
                captureParams[key] = value();
                return;
            }
            captureParams[key] = value;
        });
        if (baseConfig) {
            if ((0, _isWhat.isObject)(interfaceConfig.params)) {
                (0, _objectOpt.objCover)(captureParams, ajaxConfig.params);
            }
            if ((0, _isWhat.isObject)(interfaceConfig.data)) {
                ajaxConfig.data = (0, _objectOpt.objCover)(interfaceConfig.data, ajaxConfig.data);
            }
        } else {
            // 根据args捕获参数
            // 分析函数传入参数列表，提取 params,callback,errCallback
            var multiParamPattern = true;
            var multiParamNum = 0;
            [].forEach.call(args, function (param) {
                // 提取成功与失败回调函数
                if ((0, _isWhat.isFunction)(param)) {
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
                if ((0, _isWhat.isObject)(param)) {
                    (0, _objectOpt.objCover)(captureParams, param);
                    multiParamPattern = false;
                }
                // 多参数配置
                if (multiParamPattern && !(0, _isWhat.isFunction)(param)) {
                    var attrNum = 0;
                    for (var an in defaultParams) {
                        if (!defaultParams.hasOwnProperty(an)) continue;
                        if (attrNum++ == multiParamNum) {
                            captureParams[an] = param;
                            multiParamNum++;
                            break;
                        }
                    }
                }
            });
        }

        // URL处理基本参数处理
        var url = function () {
            if (ajaxConfig.url) return ajaxConfig.url;
            if (ajaxConfig.origin) {
                return ajaxConfig.origin + ajaxConfig.pathname;
            } else return ajaxConfig.pathname;
        }(ajaxConfig);
        // url path重构 pathParams
        var pathParams = ajaxConfig.pathParams;
        if (pathParams) {
            Object.keys(pathParams).forEach(function (key) {
                var value = pathParams[key];
                url = url.replace(new RegExp(':' + key), value);
            });
        }

        // ! 参数过滤器 -------------------------------------------------
        if ((0, _isWhat.isFunction)(ajaxConfig.paramsFilter)) {
            captureParams = ajaxConfig.paramsFilter(captureParams);
        }
        // --------------------------------------------------------------
        // post 处理 将data转化为json字符串
        if (ajaxConfig.type.toLocaleLowerCase() == "post" && ajaxConfig.contentType != "application/x-www-form-urlencoded") {
            captureParams = JSON.stringify(captureParams);
        }

        ajaxConfig.url = url;
        ajaxConfig.data = ajaxConfig.data || captureParams;
        ajaxConfig.params = captureParams;
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
    buildInterfaceMethod: function buildInterfaceMethod(key, proxyObj) {
        // extendAxios
        /**
         * 构造接口调用函数
         * @param {*=} params        - 查询参数
         * @param {*=} callback      - 成功回调
         * @param {*=} errCallback   - 失败回调
         * @param {*=} methodConfig  - 代理方法配置
         */
        var proxyMethod = function proxyMethod(params, callback, errCallback, methodConfig) {
            var args = [].slice.call(arguments);
            // 根据各级配置生成最终配置
            var interfaceConfig = toolkit.getInterfaceConfig(key, proxyObj);
            var baseConfig = null;
            args = args.filter(function (arg) {
                if ((0, _isWhat.isObject)(arg) && arg['_proxy_method_config_mark_666_']) {
                    baseConfig = arg;
                    return false;
                }
                return true;
            });

            // 根据参数和接口配置生成ajaxConfig
            var ajaxConfig = toolkit.getAjaxConfig(args, interfaceConfig, baseConfig);

            // 重新包装callback
            var wrapCallback = function wrapCallback() {
                /**
                 * 默认失败回调
                 * 1. 如果没有配置通用回调和专用回调，则使用默认回调
                 * 2. 如果配置了通用回调，没有专用回调，则使用通用回调
                 * 3. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回true则继续调用通用回调
                 * 4. 如果配置了通用回调和专用回调，则先调用专用回调，专用回调返回false，则过程结束
                 * 专用回调[cb,then] -> 通用回调[unitOptions,troopOptions,defaultOptions]
                 */
                // 在存在配置回调 和 默认回调的情况下，包装新的回调函数
                if (ajaxConfig.errCallback && interfaceConfig.errCallback && ajaxConfig.errCallback !== interfaceConfig.errCallback) {
                    ajaxConfig.errCallback = function (callback, defaultCallback) {
                        return function () {
                            return callback.apply(this, arguments) && defaultCallback.apply(this, arguments);
                        };
                    }(ajaxConfig.errCallback, interfaceConfig.errCallback);
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
            var agent = {};

            // .then
            agent.then = function (callback, errCallback) {
                if (callback) {
                    var _captureCallback = ajaxConfig.callback;
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
                        var _captureErrCallback = ajaxConfig.errCallback;
                        ajaxConfig.errCallback = function () {
                            return _captureErrCallback && _captureErrCallback.apply(this, arguments) || errCallback.apply(this, arguments);
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
                var _captureCallback = ajaxConfig.callback;
                var _captureErrCallback = ajaxConfig.errCallback;
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
                var _target = target,
                    _key = key;
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
                var methodConfig = config || {};
                methodConfig['_proxy_method_config_mark_666_'] = true;
                methodConfig['method'] = method;
                methodConfig['params'] = (0, _objectOpt.objCover)(methodConfig['params'] || {}, params || {});
                return proxyMethod(methodConfig);
            };
        });
        ['post', 'put', 'patch'].forEach(function (method) {
            proxyMethod[method] = function (data, config) {
                var methodConfig = config || {};
                methodConfig['_proxy_method_config_mark_666_'] = true;
                methodConfig['method'] = method;
                if ((0, _isWhat.isObject)(methodConfig['data']) && (0, _isWhat.isObject)(data)) {
                    methodConfig['data'] = (0, _objectOpt.objCover)(methodConfig['data'] || {}, data || {});
                } else {
                    methodConfig['data'] = methodConfig['data'] || data;
                }
                return proxyMethod(methodConfig);
            };
        });
        return proxyMethod;
    },
    // 发起请求
    doAjax: function doAjax(interfaceConfig, ajaxConfig) {
        var _this = this;

        // Ajax 开始前 interceptor
        if (this.beforeAjax(interfaceConfig, ajaxConfig)) return;
        // 请求响应统一处理
        var onResponse = function onResponse(type, data) {
            // Ajax 结束后 interceptor
            if (_this.afterAjax(interfaceConfig, ajaxConfig)) return;
            var resMap = {
                success: function success(data) {
                    _this.AjaxGetSuccessProcess({
                        data: data.data,
                        status: data.status
                    }, interfaceConfig, ajaxConfig);
                },
                localSuccess: function localSuccess(data) {
                    _this.AjaxGetSuccessProcess({
                        data: data.data,
                        status: data.status,
                        isLocalObtain: true
                    }, interfaceConfig, ajaxConfig);
                },
                error: function error(_error) {
                    _this.AjaxGetFailProcess(_error, interfaceConfig, ajaxConfig);
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
            var localData = this.getAlreadyObtain(ajaxConfig.requestMark);
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
            (0, _jsonp2.default)((0, _objectOpt.objClone)(ajaxConfig));
            return;
        }
        (interfaceConfig.ajax || extendAxios)((0, _objectOpt.objClone)(ajaxConfig));
    },

    // 请求前
    beforeAjax: function beforeAjax(interfaceConfig, ajaxConfig) {
        var flag = this.requestManager.start(interfaceConfig, ajaxConfig);
        if (!flag) {
            // 加载中开关
            if ((0, _isWhat.isFunction)(interfaceConfig.optLoadingSwitch)) {
                interfaceConfig.optLoadingSwitch(true);
            }
        }
        return flag;
    },

    // 请求后
    afterAjax: function afterAjax(interfaceConfig, ajaxConfig) {
        // 加载中开关
        if ((0, _isWhat.isFunction)(interfaceConfig.optLoadingSwitch)) {
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
    AjaxGetSuccessProcess: function AjaxGetSuccessProcess(response, interfaceConfig, ajaxConfig) {
        // 基础配置
        var opt = (0, _objectOpt.objCover)({}, response);

        // 配置项转化
        var data = opt.data;
        var status = opt.status;
        var callback = ajaxConfig.callback;
        var errCallback = ajaxConfig.errCallback;
        var isLocalObtain = opt.isLocalObtain;

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
        var callbackEx = null;
        if (callback) {
            callbackEx = function callbackEx(extractData) {
                // 提取数据
                arguments[0] = interfaceConfig.dataPath ? (0, _objectOpt.getObjAttr)(extractData, interfaceConfig.dataPath) : arguments[0];
                arguments[0] = (0, _isWhat.isFunction)(interfaceConfig.dataFilter) ? interfaceConfig.dataFilter(arguments[0], interfaceConfig.dataType) : arguments[0];
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
        if ((0, _isWhat.isFunction)(interfaceConfig.successHandler)) {
            var result = interfaceConfig.successHandler(data) || {};
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
            if (!(0, _isWhat.isUndefined)(data.data)) {
                return callbackEx && callbackEx(data.data, data, status);
            }
            return callbackEx && callbackEx(data, data, status);
        }
        if (data.success === false) {
            return errCallback && errCallback(data.msg, data);
        }
        // 当返回数据不包含success字段 > 视为成功
        if ((0, _isWhat.isUndefined)(data.success)) {
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
    AjaxGetFailProcess: function AjaxGetFailProcess(error, interfaceConfig, ajaxConfig) {
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
    generateDataMark: function generateDataMark(ajaxConfig) {
        var dataMark = JSON.stringify(ajaxConfig);
        dataMark = _sha2.default.hex_hmac(dataMark, '888');
        return dataMark;
    },
    /**
     * 获得数据
     * @param key
     * @returns {*}
     * @this module:InterfaceProxy
     * @ignore
     */
    getAlreadyObtain: function getAlreadyObtain(key) {
        var data = this.repository.get(key);
        if (data) {
            return data.responseData;
        }
        return null;
    },
    // 请求队列
    requestManager: function () {
        function RequestManager() {
            // 写点啥呢...
        }

        RequestManager.prototype = [];
        RequestManager.prototype.constructor = RequestManager;
        RequestManager.prototype.requestQueryEqual = function (a, b) {
            return this.interfaceConfigEqual(a.interfaceConfig, b.interfaceConfig) && (0, _objectOpt.objEqual)(a.ajaxConfig.data, b.ajaxConfig.data);
        };
        RequestManager.prototype.interfaceConfigEqual = function (a, b) {
            return JSON.stringify(a) === JSON.stringify(b);
        };
        RequestManager.prototype.requestEqual = function (a, b) {
            return this.interfaceConfigEqual(a.interfaceConfig, b.interfaceConfig) && a.ajaxConfig.data == b.ajaxConfig.data;
        };
        RequestManager.prototype.removeItem = function (interfaceConfig, ajaxConfig) {
            var _this2 = this;

            var removed = null;
            this.find(function (r, index) {
                if (interfaceConfig && ajaxConfig) {
                    if (_this2.requestEqual(r, {
                        interfaceConfig: interfaceConfig,
                        ajaxConfig: ajaxConfig
                    })) {
                        removed = r;
                        _this2.splice(index, 1);
                        return true;
                    }
                } else if (interfaceConfig && _this2.interfaceConfigEqual(interfaceConfig, interfaceConfig)) {
                    removed = r;
                    _this2.splice(index, 1);
                    return true;
                }
            });
            return removed;
        };
        RequestManager.prototype.start = function (interfaceConfig, ajaxConfig) {
            var _this3 = this;

            // 唯一
            if (interfaceConfig.single) {
                this.removeItem(interfaceConfig);
            }
            // 合并
            if (interfaceConfig.merge) {
                var sameRequest = this.find(function (r) {
                    return _this3.requestQueryEqual(r, {
                        interfaceConfig: interfaceConfig,
                        ajaxConfig: ajaxConfig
                    });
                });
                if (sameRequest) {
                    // 异步执行包装回调的代码 Reason : .then .error .finally
                    var callback = sameRequest.ajaxConfig.callback,
                        errCallback = sameRequest.ajaxConfig.errCallback;
                    if (callback) {
                        sameRequest.ajaxConfig.callback = function () {
                            callback.apply(this, arguments);
                            ajaxConfig.callback.apply(this, arguments);
                        };
                    }
                    if (errCallback) {
                        sameRequest.ajaxConfig.errCallback = function () {
                            errCallback.apply(this, arguments);
                            ajaxConfig.errCallback.apply(this, arguments);
                        };
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
            var _this4 = this;

            // 排队
            if (interfaceConfig.queue) {
                // 找到同接口存在的前一个请求
                var r = null;
                this.find(function (request) {
                    if (_this4.requestEqual(request, { interfaceConfig: interfaceConfig, ajaxConfig: ajaxConfig })) {
                        return false;
                    }
                    if (_this4.interfaceConfigEqual(request.interfaceConfig, interfaceConfig) && request.ajaxConfig != ajaxConfig) {
                        r = request;
                        return true;
                    }
                });
                if (r) {
                    var callback = r.ajaxConfig.callback,
                        errCallback = r.ajaxConfig.errCallback;
                    var nextCallback = ajaxConfig.callback,
                        nextErrCallback = ajaxConfig.errCallback;
                    // 将回调附加到next函数上，等待队列前的请求调用next进行回调触发
                    var next = void 0;
                    ajaxConfig.callback = function () {
                        var arg = (0, _objectOpt.objClone)(arguments);
                        next = function next() {
                            nextCallback.apply(this, arg);
                        };
                    };
                    ajaxConfig.errCallback = function () {
                        var arg = (0, _objectOpt.objClone)(arguments);
                        next = function next() {
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
    }(),
    // 持久化存储
    repository: function () {
        var ls = window.localStorage;
        return {
            push: function push(params) {
                // 保存新的数据
                ls[params.key] = JSON.stringify({
                    timeStamp: params.timeStamp,
                    validTime: params.validTime,
                    responseData: params.data
                });
            },
            get: function get(key) {
                this.clean();
                return JSON.parse(ls.getItem(key) || 'null');
            },
            // 清理过期缓存
            clean: function clean() {
                // 清除过期缓存
                for (var i = 0; i < ls.length; i++) {
                    // 42db81629a 3582822d6b b6b83bbe1d 2378e6aeeb
                    if (/\w{40}/.test(ls.key(i))) {
                        var storeData = JSON.parse(ls.getItem(ls.key(i)) || 'null');
                        if (storeData) {
                            if ((new Date().getTime() - storeData.timeStamp) / 1000 > storeData.validTime) {
                                ls.removeItem(ls.key(i));
                            }
                        }
                    }
                }
            }
        };
    }()
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
    this.$additionalOptions = ((0, _isWhat.isArray)(additionalOptions) ? additionalOptions : [additionalOptions || {}]).reduce(function (obj1, obj2) {
        return (0, _objectOpt.objCover)((0, _objectOpt.objClone)(obj1), obj2);
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
    __init__: function __init__() {
        // 变量交换
        var configList = this.$configMap;
        // 提供 iProxy[name] 操作方法 | 将 构造的getData在调用时的this指向getData[pn]本体
        var iProxy = this;
        // 动态生成接口代理对象操作方法
        for (var pn in configList) {
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
            // iProxy[pn].getUrl = (proxyObj => {
            //     const key = pn;
            //     return function (query) {
            //         const options = toolkit.getInterfaceConfig(key, proxyObj);
            //         var url = options.url || options.origin + options.pathname;
            //         var params = objCover(objClone(options.params) || {}, query);
            //         return buildURL({url: url, params: params})
            //     }
            // })(this);
        }
    }
};

// 导出Hashes
InterfaceProxy.Hashes = _sha2.default;
// 导出Ajax
// InterfaceProxy.Ajax = Ajax;
InterfaceProxy.Ajax = extendAxios;
InterfaceProxy.axios = _axios2.default;
// 修改全局默认配置API
InterfaceProxy.setDefault = function (options) {
    (0, _objectOpt.objCover)(defaultOptions, options);
};

window.InterfaceProxy = InterfaceProxy;
exports.default = InterfaceProxy;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * component-sha1
 */

/**
 * Configurable variables
 */

(function ($) {
    'use strict';

    var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase        */
    var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */
    var chrsz = 8; /* bits per input character. 8 - ASCII; 16 - Unicode      */

    /**
     * Perform a simple self-test to see if the VM is working
     */

    var sha1_vm_test = function sha1_vm_test() {
        return hex_sha1("abc") == "a9993e364706816aba3e25717850c26c9cd0d89d";
    };

    /**
     * Calculate the SHA-1 of an array of big-endian words, and a bit length
     */

    var core_sha1 = function core_sha1(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << 24 - len % 32;
        x[(len + 64 >> 9 << 4) + 15] = len;

        var w = Array(80);
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        var e = -1009589776;

        var i;
        var j;

        for (i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;
            var olde = e;

            for (j = 0; j < 80; j += 1) {
                if (j < 16) {
                    w[j] = x[i + j];
                } else {
                    w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                }

                var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                e = d;
                d = c;
                c = rol(b, 30);
                b = a;
                a = t;
            }

            a = safe_add(a, olda);
            b = safe_add(b, oldb);
            c = safe_add(c, oldc);
            d = safe_add(d, oldd);
            e = safe_add(e, olde);
        }

        return Array(a, b, c, d, e);
    };

    /**
     * Perform the appropriate triplet combination function
     * for the current iteration
     */

    var sha1_ft = function sha1_ft(t, b, c, d) {
        if (t < 20) return b & c | ~b & d;
        if (t < 40) return b ^ c ^ d;
        if (t < 60) return b & c | b & d | c & d;

        return b ^ c ^ d;
    };

    /**
     * Determine the appropriate additive constant for the current iteration
     */

    var sha1_kt = function sha1_kt(t) {
        return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
    };

    /**
     * Calculate the HMAC-SHA1 of a key and some data
     */

    var core_hmac_sha1 = function core_hmac_sha1(key, data) {
        var bkey = str2binb(key);
        if (bkey.length > 16) {
            bkey = core_sha1(bkey, key.length * chrsz);
        }
        var ipad = Array(16);
        var opad = Array(16);
        var i;

        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * chrsz);

        return core_sha1(opad.concat(hash), 512 + 160);
    };

    /**
     * Add integers, wrapping at 2^32.
     * This uses 16-bit operations internally to work around bugs in some JS interpreters.
     */

    var safe_add = function safe_add(x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

        return msw << 16 | lsw & 0xFFFF;
    };

    /**
     * Bitwise rotate a 32-bit number to the left.
     */

    var rol = function rol(num, cnt) {
        return num << cnt | num >>> 32 - cnt;
    };

    /**
     * Convert an 8-bit or 16-bit string to an array of big-endian words
     * In 8-bit function, characters >255 have their hi-byte silently ignored.
     */

    var str2binb = function str2binb(str) {
        var bin = [];
        var mask = (1 << chrsz) - 1;
        var i;

        for (i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << 32 - chrsz - i % 32;
        }

        return bin;
    };

    /**
     * Convert an array of big-endian words to a string
     */

    var binb2str = function binb2str(bin) {
        var str = "";
        var mask = (1 << chrsz) - 1;
        var i;

        for (i = 0; i < bin.length * 32; i += chrsz) {
            str += String.fromCharCode(bin[i >> 5] >>> 32 - chrsz - i % 32 & mask);
        }

        return str;
    };

    /*
     * Convert an array of big-endian words to a hex string.
     */
    var binb2hex = function binb2hex(binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        var i;

        for (i = 0; i < binarray.length * 4; i += 1) {
            str += hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 + 4 & 0xF) + hex_tab.charAt(binarray[i >> 2] >> (3 - i % 4) * 8 & 0xF);
        }

        return str;
    };

    /**
     * Convert an array of big-endian words to a base-64 string
     */

    var binb2b64 = function binb2b64(binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        var i;
        var j;

        for (i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (binarray[i >> 2] >> 8 * (3 - i % 4) & 0xFF) << 16 | (binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4) & 0xFF) << 8 | binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4) & 0xFF;
            for (j = 0; j < 4; j += 1) {
                if (i * 8 + j * 6 > binarray.length * 32) {
                    str += b64pad;
                } else {
                    str += tab.charAt(triplet >> 6 * (3 - j) & 0x3F);
                }
            }
        }

        return str;
    };

    /**
     * export
     */

    var exports = {};

    /**
     * hex
     * Hashes a string using SHA1 and returns a hex representation of it.
     *
     * @param {String} s
     * @returns {String}
     * @api public
     */

    exports.hex = function (s) {
        return binb2hex(core_sha1(str2binb(s), s.length * chrsz));
    };

    /**
     * base64
     * Hashes a string using SHA1 and returns a base64 representation of it.
     *
     * @param {String} s
     * @returns {String}
     * @api public
     */

    exports.base64 = function (s) {
        return binb2b64(core_sha1(str2binb(s), s.length * chrsz));
    };

    /**
     * str
     * Hashes a string using SHA1 and returns a string representation of it.
     *
     * @param {String} s
     * @returns {String}
     * @api public
     */

    exports.str = function (s) {
        return binb2str(core_sha1(str2binb(s), s.length * chrsz));
    };

    /**
     * hex_hmac
     * Calculates the HMAC-SHA1 of a key and some data,
     * returning a hex representation of it.
     *
     * @param {String} key
     * @param {String} data
     * @returns {String}
     * @api public
     */

    exports.hex_hmac = function (key, data) {
        return binb2hex(core_hmac_sha1(key, data));
    };

    /**
     * base64_hmac
     * Calculates the HMAC-SHA1 of a key and some data,
     * returning a base64 representation of it.
     *
     * @param {String} key
     * @param {String} data
     * @returns {String}
     * @api public
     */

    exports.base64_hmac = function (key, data) {
        return binb2b64(core_hmac_sha1(key, data));
    };

    /**
     * str_hmac
     * Calculates the HMAC-SHA1 of a key and some data,
     * returning a string representation of it.
     *
     * @param {String} key
     * @param {String} data
     * @returns {String}
     * @api public
     */

    exports.str_hmac = function (key, data) {
        return binb2str(core_hmac_sha1(key, data));
    };

    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return exports;
        }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
})(undefined);

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ajaxJsonp;

var _url = __webpack_require__(4);

var _objectOpt = __webpack_require__(3);

// default ajax params
/**
 * jsonp
 */
var defaultOptions = {
    url: '',
    data: null,
    dataType: 'json',
    jsonp: 'callback',
    success: new Function(),
    error: new Function()
};
//
var jsonpCounter = 100;

function ajaxJsonp(config) {
    // init options
    var options = (0, _objectOpt.objCover)((0, _objectOpt.objClone)(defaultOptions), config);
    // create receive func
    var jsonpCallbackName = 'jsonp_cb' + jsonpCounter++;
    var called = false;
    window[jsonpCallbackName] = function (data) {
        called = true;
        options.success(data);
    };
    // script tag
    var pageScript = document.createElement('script');
    pageScript.type = 'text/javascript';
    var params = (0, _objectOpt.objClone)(options.data);
    params[options.jsonp] = jsonpCallbackName;
    params["_"] = +new Date();
    pageScript.src = (0, _url.buildURL)({
        url: options.url,
        params: params
    });
    document.head.appendChild(pageScript);
    pageScript.onload = function () {
        if (called === false) {
            options.error({
                message: 'Jsonp response illegal'
            });
        }
        delete window[jsonpCallbackName];
        document.head.removeChild(pageScript);
    };
    pageScript.onerror = function () {
        options.error({
            message: 'Jsonp request error'
        });
        document.head.removeChild(pageScript);
    };
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(11);

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);
var bind = __webpack_require__(13);
var Axios = __webpack_require__(15);
var defaults = __webpack_require__(16);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(34);
axios.CancelToken = __webpack_require__(35);
axios.isCancel = __webpack_require__(31);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(36);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var bind = __webpack_require__(13);
var isBuffer = __webpack_require__(14);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge() /* obj1, obj2, obj3, ... */{
  var result = {};
  function assignValue(val, key) {
    if (_typeof(result[key]) === 'object' && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
};

function isBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj);
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0));
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(16);
var utils = __webpack_require__(12);
var InterceptorManager = __webpack_require__(28);
var dispatchRequest = __webpack_require__(29);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, { method: 'get' }, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(12);
var normalizeHeaderName = __webpack_require__(18);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(19);
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(19);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) || utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {/* Ignore */}
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(17)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);
var settle = __webpack_require__(20);
var buildURL = __webpack_require__(23);
var parseHeaders = __webpack_require__(24);
var isURLSameOrigin = __webpack_require__(25);
var createError = __webpack_require__(21);
var btoa = typeof window !== 'undefined' && window.btoa && window.btoa.bind(window) || __webpack_require__(26);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ("none" !== 'test' && typeof window !== 'undefined' && window.XDomainRequest && !('withCredentials' in request) && !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || request.readyState !== 4 && !xDomain) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(27);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(21);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError('Request failed with status code ' + response.status, response.config, null, response.request, response));
  }
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(22);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */

module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

function encode(val) {
  return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = ['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent'];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) {
    return parsed;
  }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
  var msie = /(msie|trident)/i.test(navigator.userAgent);
  var urlParsingNode = document.createElement('a');
  var originURL;

  /**
  * Parse a URL to discover it's components
  *
  * @param {String} url The URL to be parsed
  * @returns {Object}
  */
  function resolveURL(url) {
    var href = url;

    if (msie) {
      // IE needs attribute set twice to normalize properties
      urlParsingNode.setAttribute('href', href);
      href = urlParsingNode.href;
    }

    urlParsingNode.setAttribute('href', href);

    // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
    return {
      href: urlParsingNode.href,
      protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
      host: urlParsingNode.host,
      search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
      hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
      hostname: urlParsingNode.hostname,
      port: urlParsingNode.port,
      pathname: urlParsingNode.pathname.charAt(0) === '/' ? urlParsingNode.pathname : '/' + urlParsingNode.pathname
    };
  }

  originURL = resolveURL(window.location.href);

  /**
  * Determine if a URL shares the same origin as the current location
  *
  * @param {String} requestURL The URL to test
  * @returns {boolean} True if URL shares the same origin, otherwise false
  */
  return function isURLSameOrigin(requestURL) {
    var parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
    return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
  };
}() :

// Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return function isURLSameOrigin() {
    return true;
  };
}();

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error();
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
  // initialize result and counter
  var block, charCode, idx = 0, map = chars;
  // if the next str index does not exist:
  //   change the mapping table to "="
  //   check if d has no fractional digits
  str.charAt(idx | 0) || (map = '=', idx % 1);
  // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
  output += map.charAt(63 & block >> 8 - idx % 1 * 8)) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

module.exports = utils.isStandardBrowserEnv() ?

// Standard browser envs support document.cookie
function standardBrowserEnv() {
  return {
    write: function write(name, value, expires, path, domain, secure) {
      var cookie = [];
      cookie.push(name + '=' + encodeURIComponent(value));

      if (utils.isNumber(expires)) {
        cookie.push('expires=' + new Date(expires).toGMTString());
      }

      if (utils.isString(path)) {
        cookie.push('path=' + path);
      }

      if (utils.isString(domain)) {
        cookie.push('domain=' + domain);
      }

      if (secure === true) {
        cookie.push('secure');
      }

      document.cookie = cookie.join('; ');
    },

    read: function read(name) {
      var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
      return match ? decodeURIComponent(match[3]) : null;
    },

    remove: function remove(name) {
      this.write(name, '', Date.now() - 86400000);
    }
  };
}() :

// Non standard browser env (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
  return {
    write: function write() {},
    read: function read() {
      return null;
    },
    remove: function remove() {}
  };
}();

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);
var transformData = __webpack_require__(30);
var isCancel = __webpack_require__(31);
var defaults = __webpack_require__(16);
var isAbsoluteURL = __webpack_require__(32);
var combineURLs = __webpack_require__(33);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(config.data, config.headers, config.transformRequest);

  // Flatten headers
  config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers || {});

  utils.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], function cleanHeaderConfig(method) {
    delete config.headers[method];
  });

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(response.data, response.headers, config.transformResponse);

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(reason.response.data, reason.response.headers, config.transformResponse);
      }
    }

    return Promise.reject(reason);
  });
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(12);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */

module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return (/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
  );
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */

module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */

function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(34);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */

module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

/***/ })
/******/ ]);
});