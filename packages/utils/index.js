/**
 * @file A library of common functions.
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

/**
 * The main namespace for the library.
 * @namespace
 */
const $wd = {};

// Polyfills for console methods
console.log || (console.log = new Function());
console.warn || (console.warn = console.log);
console.error || (console.error = console.log);

/**
 * A chainable Promise-like implementation.
 * @param {Function} callback - The callback function.
 * @returns {Object} A Promise-like object with `then` and `sync` methods.
 * @memberof $wd
 * @example
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
 * // Without .sync()
 * // => start 1 2 3
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

/**
 * Asynchronously loads a JavaScript file.
 * @param {string} src - The path to the JavaScript file.
 * @param {Function} callback - The callback function to be executed after the script is loaded. It receives one argument: 'exist' if the script already exists, true on success, and 'error' on failure.
 * @returns {boolean|undefined} Returns false if the script already exists, otherwise undefined.
 * @memberof $wd
 */
function getScript(src, callback) {
    // Page script
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
