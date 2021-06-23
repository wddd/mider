/**
 * 公共函数库
 * @author wdzxc
 */

import {
    isUndefined,
    isObject,
    isArray,
    isFunction,
    isString,
    isNumber,
} from "./isWhat";
import {objClone, getObjAttr, setObjAttr, objCover, objClear, objEqual, objExtract, objMix} from "./objectOpt";
import {parseURL, buildURL} from "./url";

import("./src/array-polyfill");

const $wd = {};

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
    let start = false, resolveQueue = [], rejectQueue = [], resolve, reject;
    resolve = function () {
        rejectQueue.shift();
        (resolveQueue.shift() || function () {
        }).apply(this, [resolve, reject].concat([].slice.call(arguments, 0)));
    };
    reject = function () {
        (rejectQueue.shift() || function () {
        }).apply(this, [].concat([].slice.call(arguments, 0)));
        rejectQueue = [];
    };
    setTimeout(function () {
        !start && callback(resolve, reject);
    }, 1);
    return {
        then: function (resolve, reject) {
            resolveQueue.push(resolve);
            rejectQueue.push(reject);
            return this;
        },
        sync: function () {
            start = true;
            callback(resolve, reject);
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
        let curScripts = document.querySelectorAll('script');
        for (let i = 0; i < curScripts.length; i++) {
            if (curScripts[i].getAttribute('src') === src) {
                callback('exist');
                return false;
            }
        }
        let pageScript = document.createElement('script');
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


$wd.objClone = objClone;
$wd.getObjAttr = getObjAttr;

$wd.parseURL = parseURL;
$wd.buildURL = buildURL;

$wd.objCover = objCover;
$wd.objClear = objClear;
$wd.objEqual = objEqual;
$wd.objExtract = objExtract;
$wd.objMix = objMix;
$wd.setObjAttr = setObjAttr;

$wd.getScript = getScript;

// export
$wd.$wd = $wd;
$wd.isArray = isArray;
$wd.isNumber = isNumber;
$wd.isObject = isObject;
$wd.isString = isString;
$wd.isFunction = isFunction;
$wd.isUndefined = isUndefined;

export default $wd;
