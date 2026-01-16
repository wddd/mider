/**
 * @file Object manipulation utilities.
 */

import {isArray, isFunction, isObject, isString, isUndefined} from "./isWhat";

/**
 * Deep clones an object.
 * @param {Object|Array|number|string} obj - The object to clone.
 * @returns {*} The cloned object.
 */
function objClone(obj) {
    let newObj = {};
    if (isArray(obj)) {
        newObj = obj.map(e => objClone(e));
        return newObj;
    }
    if (isObject(obj)) {
        for (let an in obj) {
            if (!obj.hasOwnProperty(an)) continue;
            if (isArray(obj[an]))
                newObj[an] = obj[an].slice();
            else
                newObj[an] = isObject(obj[an]) ? objClone(obj[an]) : obj[an];
        }
        return newObj;
    }
    return obj;
}

/**
 * Gets a property of an object by a string path.
 * @param {Object} data - The object to get the property from.
 * @param {string} path - The path to the property, e.g., 'a.b.c'.
 * @returns {*} The property value, or undefined if not found.
 * @example
 * const obj = { a: { ao: { aoo: 100 } } };
 * getObjAttr(obj, 'a.ao'); // => { aoo: 100 }
 * getObjAttr(obj, 'a.ao.aoo'); // => 100
 * getObjAttr(obj, 'a.an.aoo'); // => undefined
 */
function getObjAttr(data, path) {
    let result = data;
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
 * Sets a property of an object by a string path.
 * @param {Object} data - The object to set the property on.
 * @param {string} path - The path to the property, e.g., 'a.b.c'.
 * @param {*} value - The value to set.
 * @returns {Object} The modified object.
 * @example
 * setObjAttr({ a: { a1: 998 }, b: 2, c: { c1: 3 } }, 'a.aa.aaa', 998);
 * // => { a: { a1: 998, aa: { aaa: 998 } }, b: 2, c: { c1: 3 } }
 */
function setObjAttr(data, path, value) {
    let result = data;
    if (!path) return result;
    try {
        path.split('.').forEach(function (name, index) {
            if (index === path.split('.').length - 1) {
                result[name] = value;
                return
            }
            if (!isObject(result[name])) result[name] = {};
            result = result[name];
        });
    } catch (e) {
        return;
    }
    return data;
}

/**
 * Overwrites the properties of an object with the properties of another object.
 * @param {Object} obj1 - The object to be overwritten.
 * @param {Object} obj2 - The object to overwrite with.
 * @param {(string|Function)} [process] - A callback function to process each property.
 * @returns {Object} The overwritten object.
 * @example
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { a: 3, c: 4 };
 * objCover(obj1, obj2); // => { a: 3, b: 2, c: 4 }
 */
function objCover(obj1, obj2, process) {
    for (let an in obj2) {
        if (!obj2.hasOwnProperty(an) || (process === 'one-to-one' && !obj1.hasOwnProperty(an))) continue;
        obj1[an] = isFunction(process) ? process(obj2[an], an, obj1[an]) : obj2[an];
    }
    return obj1;
}

/**
 * Clears the properties of an object.
 * @param {Object} obj - The object to clear.
 * @param {number} [degree] - The depth to clear.
 * @returns {Object} The cleared object.
 * @example
 * const obj = { a: 1, b: 2 };
 * objClear(obj); // => { a: null, b: null }
 */
function objClear(obj, degree) {
    let searchDegree = degree >= 0 ? degree : -1 >>> 1;
    if (searchDegree < 1) return obj;
    if (isObject(obj)) {
        Object.keys(obj).forEach(pn => {
            if (isObject(obj[pn])) {
                objClear(obj[pn], degree - 1);
            } else if (isArray(obj[pn])) {
                obj[pn].splice(0, obj[pn].length)
            } else {
                obj[pn] = null;
            }
        });
    }
    return obj;
}

/**
 * Compares two objects for equality.
 * @param {*} obj1 - The first object.
 * @param {*} obj2 - The second object.
 * @param {(string|Array<string>)} [attr] - The attributes to compare.
 * @returns {boolean} Whether the objects are equal.
 * @example
 * const obj1 = { a: 1, b: 2 };
 * const obj2 = { a: 1, c: 2 };
 * const obj3 = { a: 2 };
 * objEqual(obj1, obj2); // => true
 * objEqual(obj1, obj3); // => false
 */
function objEqual(obj1, obj2, attr) {
    let attrList = [];
    if (obj1 === obj2)
        return true;
    if (!isObject(obj1) || !isObject(obj2))
        return false;
    for (let an in obj2) {
        if (attr) {
            if (isString(attr)) attrList = attr.split(",");
            if (attrList.filter(function (e) {
                return e === an;
            }).length <= 0) continue;
        }
        if (!obj2.hasOwnProperty(an)) continue;
        if (obj2[an] === obj1[an]) continue;
        return false;
    }
    return true;
}

/**
 * Extracts properties from an object.
 * @param {Object|Array<Object>} obj - The object or array of objects to extract properties from.
 * @param {Array<string>|string} options - The extraction rules.
 * @param {boolean} [except=false] - Whether to exclude the specified properties.
 * @returns {Object|Array<Object>} The new object or array with the extracted properties.
 * @example
 * const obj = { red: 255, name: 'peter' };
 * objExtract(obj, ["red=>colorRed", "name=>lastName"]); // => { colorRed: 255, lastName: 'peter' }
 * objExtract(obj, "red=>colorRed,name"); // => { colorRed: 255, name: 'peter' }
 */
function objExtract(obj, options, except) {
    let result = [], temp, originObj = objClone(obj), originOpt = options;
    if (isUndefined(options)) {
        originOpt = [];
    }
    if (isString(options)) {
        originOpt = options.split(',');
    }
    if (!isArray(obj)) {
        originObj = [obj];
    }
    originObj.forEach(function (unit) {
        if (except) {
            temp = unit;
            originOpt.forEach(function (name) {
                delete temp[name];
            });
        }
        if (!except) {
            temp = {};
            originOpt.forEach(function (name) {
                let resolveReg = /([^=>,]+)=[>]?([^=>,]+)/;
                if (resolveReg.test(name)) {
                    let originName = resolveReg.exec(name)[1];
                    let replaceName = resolveReg.exec(name)[2];
                    if (!isUndefined(getObjAttr(unit, originName))) {
                        setObjAttr(temp, replaceName, getObjAttr(unit, originName));
                    }
                } else {
                    if (!isUndefined(getObjAttr(unit, name))) {
                        setObjAttr(temp, name, getObjAttr(unit, name));
                    }
                }
            });
        }
        result.push(temp);
    });
    if (!isArray(obj)) return result[0];
    return result;
}

/**
 * Mixes the properties of two objects.
 * @param {Object} options - The base object.
 * @param {Object} coverOptions - The object to mix in.
 * @param {number} [degree] - The depth to mix.
 * @returns {boolean} Whether the mix was successful.
 */
function objMix(options, coverOptions, degree) {
    let searchDegree = degree >= 0 ? degree : -1 >>> 1;
    if (searchDegree < 1) return false;
    if (isUndefined(options) || isUndefined(coverOptions)) {
        return false;
    }
    if (isArray(coverOptions)) {
        if (!isArray(options)) {
            options = [];
        }
        coverOptions.forEach((value, index) => {
            if (!objMix(options[index], coverOptions[index], searchDegree - 1)) {
                options[index] = coverOptions[index];
            }
        });
        return true;
    }
    if (isObject(coverOptions)) {
        if (!isObject(options)) {
            options = {};
        }
        Object.keys(coverOptions).concat(Object.getOwnPropertySymbols(coverOptions)).forEach(key => {
            if (!objMix(options[key], coverOptions[key], searchDegree - 1)) {
                options[key] = coverOptions[key];
            }
        });
        return true;
    }
    return false;
}

export {objClone, getObjAttr, setObjAttr, objCover, objClear, objEqual, objExtract, objMix}