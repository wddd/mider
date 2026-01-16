/**
 * @file Type checking utilities.
 */

/**
 * Creates a function that checks if an object is of a specific type.
 * @param {string} type - The type to check for.
 * @returns {function(*): boolean} A function that takes an object and returns true if it is of the specified type, false otherwise.
 */
function isType(type) {
    return function (obj) {
        return {}.toString.call(obj) === "[object " + type + "]";
    }
}

/**
 * Checks if a value is undefined.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is undefined, false otherwise.
 */
let isUndefined = isType("Undefined");

/**
 * Checks if a value is an object.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is an object, false otherwise.
 */
let isObject = isType("Object");

/**
 * Checks if a value is a number.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is a number, false otherwise.
 */
let isNumber = isType("Number");

/**
 * Checks if a value is an array.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is an array, false otherwise.
 */
let isArray = Array.isArray || isType("Array");

/**
 * Checks if a value is a function.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is a function, false otherwise.
 */
let isFunction = isType("Function");

/**
 * Checks if a value is a string.
 * @param {*} obj - The value to check.
 * @returns {boolean} True if the value is a string, false otherwise.
 */
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
