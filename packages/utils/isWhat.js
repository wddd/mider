/**
 * 类型检查
 * @param type
 * @returns {function(*=): boolean}
 */
function isType(type) {
    return function (obj) {
        return {}.toString.call(obj) === "[object " + type + "]";
    }
}

/**
 * 类型检查 Undefined
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isUndefined = isType("Undefined");
/**
 * 类型检查 Object
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isObject = isType("Object");
/**
 * 类型检查 Number
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isNumber = isType("Number");
/**
 * 类型检查 Array
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isArray = Array.isArray || isType("Array");
/**
 * 类型检查 Function
 * @function
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isFunction = isType("Function");
/**
 * 类型检查 String 验证 字符串字面量 和 new String()
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isString = function (obj) {
    return isType("String")(obj) || obj instanceof String;
};

export {
    isUndefined,
    isObject,
    isArray,
    isFunction,
    isString,
    isNumber,
}
