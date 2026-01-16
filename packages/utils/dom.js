/**
 * @file DOM manipulation utilities.
 */

import {
    isArray, isFunction, isNumber, isObject, isString, isUndefined
} from "./isWhat";

/**
 * Performs multiple type checks with chainable methods.
 * @param {*} variable - The variable to check.
 * @param {Object|Array} [options] - The type check options.
 * @param {boolean} [single] - Whether to exit after the first successful check.
 * @returns {Object} A chainable object with type check methods.
 * @global
 * @example
 * isWhat(document.createElement('div'))
 *   .isTypes(['string', 'element', 'array'], function () {
 *     console.log("str | elem |  array ");
 *   })
 *   .isObject(function () {
 *     console.log("obj");
 *   })
 *   .isString(function () {
 *     console.log("str2");
 *   })
 *   .isEqual("peter", function () {
 *     console.log("peterE1");
 *   }, 1)
 *   .isEqual("peter", function () {
 *     console.log("peterE2");
 *   });
 * // => str | elem |  array
 */
let isWhat = function (variable, options, single) {
    // Type check names
    let typeMap = {
        'isFunction': isFunction,
        'array': isArray, 'isArray': isArray,
        'object': isObject, 'isObject': isObject,
        'undefined': isUndefined, 'isUndefined': isUndefined,
        'string': isString, 'isString': isString,
        'number': isNumber, 'isNumber': isNumber,
        'isEqual': null, // Custom check
        "isTypes": null  // Custom check
    };

    single = single ? 1 : options && options.length;
    if (isArray(options)) {
        Array.prototype.forEach.call(options, function (callback) {
            if (callback.name && typeMap[callback.name] && typeMap[callback.name](variable)) {
                if (single-- > 0) {
                    callback();
                }
            }
        });
    }

    function forEachIn(obj, cb) {
        Object.keys(obj).forEach(key => {
            cb(obj[key], key);
        });
    }

    if (isObject(options)) {
        forEachIn(options, function (callback, type) {
            if (type && typeMap[type] && typeMap[type](variable)) {
                if (single-- > 0) {
                    callback();
                }
            }
        });
    }

    let next = {};
    for (let an in typeMap) {
        if (!typeMap.hasOwnProperty(an)) continue;
        /**
         * @param {string} type - The type to check.
         * @param {...*} - The variable arguments.
         */
        next[an] = function (type) {
            return function (cmpData, callback, barrier) {
                if (arguments.length === 1) callback = cmpData;
                if (arguments.length === 2 && !isFunction(callback)) {
                    barrier = callback;
                    callback = cmpData;
                }

                if (type === "isEqual") {
                    if (variable === cmpData) {
                        callback();
                    }
                } else if (type === "isTypes") {
                    if (isArray(cmpData)) {
                        cmpData.slice(0).forEach(function (typeName) {
                            if (typeMap[typeName] && typeMap[typeName](variable)) {
                                callback();
                                cmpData.splice(0, cmpData.length);
                            }
                        });
                    }
                } else if (typeMap[type](variable) && callback) {
                    callback();
                }

                if (barrier) {
                    for (let an in next) {
                        if (next.hasOwnProperty(an)) {
                            next[an] = function () {
                                return next;
                            };
                        }
                    }
                }
                return next;
            };
        }(an);
    }
    return next;
}

/**
 * Checks if an object is an Element.
 * @param {*} obj - The object to check.
 * @returns {boolean} Whether the object is an Element.
 * @global
 */
let isElement = function (obj) {
    return /^\[object HTML\w*Element]$/.test({}.toString.call(obj));
};

/**
 * Checks if an object is an HTMLCollection or NodeList.
 * @param {*} obj - The object to check.
 * @returns {boolean} Whether the object is an HTMLCollection or NodeList.
 * @global
 */
let isElementArray = function (obj) {
    return {}.toString.call(obj) === '[object HTMLCollection]' || {}.toString.call(obj) === '[object NodeList]';
};

/**
 * Checks if an object is a table element (thead, tbody, tr, td, th, etc.).
 * @param {*} obj - The object to check.
 * @returns {boolean} Whether the object is a table element.
 * @global
 */
let isTableElement = function (obj) {
    return /^\[object HTMLTable\w*Element]$/.test({}.toString.call(obj));
};
/**
 * Shows the target element by removing the 'display: none' style.
 * @param {Element} elem - The element to show.
 */
function showElem(elem) {
    if (!elem) return;
    let attrStr = elem.getAttribute('style');
    if (attrStr == null) return;
    // Removes 'display: none' from the style attribute
    elem.setAttribute('style', attrStr.replace(/display *: *none;* */g, ""));
}

/**
 * Hides the target element by adding the 'display: none' style.
 * @param {Element} elem - The element to hide.
 */
function hideElem(elem) {
    if (!elem) return;
    let attrStr = elem.getAttribute('style');
    if (attrStr == null) {
        elem.setAttribute('style', 'display: none;');
        return;
    }
    if (/display *: *none;* */.test(attrStr)) {
        return;
    }
    elem.setAttribute('style', /; *$/.test(attrStr) ? attrStr + 'display: none;' : attrStr + ';display: none;');
}

/**
 * The main selector function.
 * @param {(string|Element|NodeList)} selector - A CSS selector string, an element, or a NodeList.
 * @returns {$wd} A $wd instance.
 * @namespace
 * @global
 */
function $wd(selector) {
    if (isUndefined(this) || this === window) {
        return new $wd(selector);
    }
    // String > selector mode
    if (selector instanceof String || typeof selector === "string") {
        this.splice.apply(this, [0, this.length].concat([].slice.call(document.querySelectorAll(selector))));
    }
    // HTML Element
    if (isElement(selector)) {
        this.push(selector);
    }
    // HTML Element Array
    if (isElementArray(selector)) {
        this.splice.apply(this, [0, this.length].concat([].slice.call(selector)));
    }
}
$wd.prototype = Object.create(Array.prototype);
$wd.prototype.constructor = $wd;

/**
 * An implementation of Array.prototype.splice.
 * @param {number} start - The starting index.
 * @param {number} deleteCount - The number of elements to remove.
 * @param {...*} items - The elements to add.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.splice = function (start, deleteCount, items) {
    [].splice.apply(this, arguments);
    return this;
};

/**
 * An implementation of Array.prototype.filter.
 * @param {Function} callback - The callback function.
 * @returns {$wd} A new $wd instance.
 */
$wd.prototype.filter = function (callback) {
    return this.splice.apply(this, [0, this.length].concat([].filter.call(this, callback.bind(this))));
};

/**
 * An implementation of Array.prototype.map.
 * @param {function} callback - The callback function.
 * @returns {$wd} A new $wd instance.
 */
$wd.prototype.map = function (callback) {
    return this.splice.apply(this, [0, this.length].concat([].map.apply(this, arguments)));
};

/**
 * Sets the inner HTML of the elements.
 * @param {(string|Element|Function)} option - A string of HTML, an element, or a function that returns one of these.
 * @returns {$wd} The $wd instance.
 * @example
 * // Note: This method is vulnerable to XSS attacks.
 * $wd('.title').html('<img src="http://example.com/image.gif" onerror="alert(\'XSS\')">');
 */
$wd.prototype.html = function (option) {
    this.forEach(function (elem) {
        // Clears the original content
        elem.innerHTML = "";
        isWhat(option).isString(function () {
            elem.innerHTML = option;
        }).isElement(function () {
            elem.appendChild(option);
        }).isFunction(function () {
            let result = option();
            isWhat(result).isTypes(['string', 'element'], function () {
                $wd(elem).html(result);
            });
        });
    });
    return this;
};

/**
 * Sets the style of the elements.
 * @param {string} cssStr - A string of CSS.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.setStyle = function (cssStr) {
    this.forEach(function (elem) {
        elem.style.cssText = cssStr;
    });
    return this;
};

/**
 * Removes the elements.
 * @param {string} [options] - If provided, removes the matching child elements. Otherwise, removes the elements themselves.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.remove = function (options) {
    this.forEach(function (elem) {
        if (isUndefined(options))
            elem.parentNode && elem.parentNode.removeChild(elem);
        if (isString(options) || isElement(options))
            $wd(elem).find(options).remove();
    });
    return this;
};

/**
 * Adds a class to the elements.
 * @param {string} classStr - The class name to add.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.addClass = function (classStr) {
    this.forEach(function (elem) {
        if (!new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
            let classList = elem.className.split(' ');
            classList.push(classStr);
            elem.className = classList.join(' ');
            // Cleans up the className
            elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
        }
    });
    return this;
};

/**
 * Removes a class from the elements.
 * @param {string} classStr - The class name to remove.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.removeClass = function (classStr) {
    this.forEach(function (elem) {
        if (new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
            // Removes the class
            elem.className = elem.className.replace(new RegExp('\\b' + classStr + '\\b'), '');
            // Cleans up the className
            elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
        }
    });
    return this;
};
/**
 * Iterates over the elements.
 * @param {Function} callback - The callback function.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.forEach = function (callback) {
    [].forEach.call(this, callback);
    return this;
};

/**
 * Finds descendant elements that match a selector.
 * @param {string} cssStr - The CSS selector string.
 * @param {boolean} [selfMatch=false] - Whether to include the current elements in the search.
 * @returns {$wd} A new $wd instance containing the matched elements.
 */
$wd.prototype.find = function (cssStr, selfMatch) {
    let tempElements = [0];
    this.forEach(function (elem) {
        // Checks if the element itself matches
        if (selfMatch) {
            let match = false;
            if (elem.parentNode) {
                match = $wd(elem.parentNode).find(cssStr).has(elem);
            } else {
                // For elements without a parent node, create a temporary parent for the search
                let curParentElem = document.createElement('div');
                curParentElem.appendChild(elem);
                match = $wd(curParentElem).find(cssStr).has(elem);
                $wd(curParentElem).remove();
            }
            if (match) {
                tempElements.push(elem);
            }
        }
        [].forEach.call(elem.querySelectorAll(cssStr), function (elem) {
            let has = false;
            [].forEach.call(tempElements, function (stockElem) {
                if (stockElem === elem) {
                    has = true;
                }
            });
            if (!has) {
                tempElements.push(elem);
            }
        });
    });

    // Removes duplicates
    let arr = [];
    tempElements.forEach(function (elem) {
        if (!arr.find(e => e === elem))
            arr.push(elem);
    });

    // Replaces the array
    this.splice(0, this.length);
    arr.splice(1, 0, this.length);
    this.splice.apply(this, arr);

    return this;
};

/**
 * Gets or sets an attribute of the elements.
 * @param {string} options - The attribute name.
 * @param {string} [value] - The value to set.
 * @returns {$wd|string} The $wd instance if setting a value, otherwise the attribute value of the first element.
 */
$wd.prototype.attr = function (options, value) {
    if (isString(options) && isString(value)) {
        this.forEach(function (elem) {
            elem.setAttribute(options, value);
        });
        return this;
    }
    if (isString(options) && isUndefined(value))
        return this[0] && this[0].getAttribute(options);
};

/**
 * Hides the elements.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.hide = function () {
    this.forEach(function (elem) {
        hideElem(elem);
    });
    return this;
};

/**
 * Shows the elements.
 * @returns {$wd} The $wd instance.
 */
$wd.prototype.show = function () {
    this.forEach(function (elem) {
        showElem(elem);
    });
    return this;
};

/**
 * Checks if the current set of elements contains a specific element.
 * @param {Element} targetElem - The element to check for.
 * @returns {boolean} Whether the element is in the set.
 */
$wd.prototype.has = function (targetElem) {
    let isMatch = false;
    this.forEach(function (elem) {
        if (targetElem === elem) isMatch = true;
    });
    return isMatch;
};

/**
 * Checks if any of the elements in the current set have a specific child element.
 * @param {Element} targetElem - The child element to check for.
 * @returns {boolean} Whether the child element is found.
 */
$wd.prototype.hasChild = function (targetElem) {
    let isMatch = false;
    this.forEach(function (elem) {
        forEach(elem.children, function (elem) {
            if (targetElem === elem) isMatch = true;
        });
    });
    return isMatch;
};

/**
 * Gets or sets the value of form elements.
 * @param {(number|string|null)} [value] - The value to set.
 * @returns {$wd|string|null} The $wd instance if setting a value, otherwise the value of the first element.
 */
$wd.prototype.val = $wd.prototype.value = function (value) {
    // Returns null if the set is empty
    if (this.length <= 0) return null;
    // Radio button pattern: returns null if no radio button is selected
    let isRadio = true, radioValue = null, singleName = null, isSelect = false;
    // Select pattern: returns null if no option is selected
    let selectValue = null, checkedEnd = false, isSelectMatch = false;
    this.forEach(function (elem, index) {
        if (checkedEnd) return;
        if (index === 0) singleName = elem.name;
        if (index >= 0 && elem.name !== singleName) {
            console.warn("Warning: The RadioList you are trying to get the value of has different names.");
        }
        // Sets the value for radio buttons
        if (elem.type === 'radio') {
            if (value === null) {
                elem.checked = false;
                return;
            }
            if (!isUndefined(value) && elem.value === value) {
                elem.checked = true;
            }
            if (elem.checked === true) {
                radioValue = elem.value;
            }
        } else {
            isRadio = false;
        }
        // Handles select elements
        if (elem.tagName === "SELECT" && !isUndefined(value)) {
            isSelect = checkedEnd = true;
            $wd(elem).find('option').forEach(function (elem) {
                if (elem.value === value) isSelectMatch = true;
            });
            if (isSelectMatch) elem.value = value;
            selectValue = elem.value;
        }
    });
    if (isSelect && isSelectMatch) return selectValue;
    if (isSelect && !isSelectMatch) return null;
    if (isRadio) return radioValue;
    if (!isUndefined(value))
        this[0].value = value;
    return this[0].value;
};

/**
 * Gets the form data. Elements must have a 'data-formName' attribute.
 * @returns {Object} An object containing the form data.
 */
$wd.prototype.getFormData = function () {
    let formData = {};
    this.find('[data-formName]', true).forEach(function (elem) {
        let dataName = elem.getAttribute('data-formName');
        if (elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA" || elem.tagName === "RADIO") {
            formData[dataName] = $wd(elem).value();
        }
    });
    return formData;
};

/**
 * Renders data to the elements.
 * @param {Object} config - The configuration object.
 * @param {Object} [config.data] - The data to render.
 * @param {string} [config.attrName="data-global"] - The attribute name to match elements.
 * @param {Array} [config.dataBuilder] - An array of data builders.
 * @param {Object} [config.dataOperator] - An object of data operators.
 * @param {*} [config.params=null] - Additional parameters to pass to the builder functions.
 * @param {boolean} [config.reset=true] - Whether to clear the value of unmatched elements.
 * @returns {$wd} The $wd instance.
 * @example
 * $wd('div').render({ data: { supplierName: 123123 } }).render({ data: { warehouseName: 123123 } });
 */
$wd.prototype.render = function (config) {
    let options = {
        data: [],
        dataBuilder: [],
        dataOperator: {},
        attrName: 'data-global',
        params: null,
        autoMatch: true,
        reset: false
    };
    $wd.objCover(options, config);
    let data = options.data;
    // Iterates over all elements in the container
    this.forEach(function (elem) {
        // Constructs the content building method
        let buildElem = function (elem) {
            let isMatch = false;
            let dataName = $wd(elem).attr(options.attrName);
            // Checks for a match in the dataBuilder array
            options.dataBuilder.forEach(/**
             @param {(Object|Function)} builder
             @param {Function} builder.setMethod
             @param {string} builder.dataName
             @param {string} builder.name
             */function (builder) {
                // Function mode: function name() {}
                if (isFunction(builder)) {
                    if (builder.name !== dataName) return;
                    builder(data, elem, options.params);
                    isMatch = true;
                    return;
                }
                // Object mode: {dataName:"",setMethod:Function,getMethod:Function}
                if (builder.dataName !== dataName) return;
                if (isUndefined(builder.setMethod)) return;
                // If a setMethod exists
                // 1. String: try to execute
                // 2. Function: execute and analyze the return value. If it is a string or an element, construct it.
                if (isString(builder.setMethod)) {
                    elem.textContent = builder.setMethod;
                    isMatch = true;
                } else if (isFunction(builder.setMethod)) {
                    builder(data, elem, options.params);
                    isMatch = true;
                } else {
                    console.error("Error: The matched dataBuilder executed abnormally.");
                }
            });
            return isMatch;
        };
        // Constructs the event binding method
        let bindEvent = function (elem) {
            let isMatch = false;
            (isArray(options.dataOperator) ? options.dataOperator : function (dataOperator) {
                // dataOperator {object} => {array}
                let result = [];
                for (let dataName in dataOperator) {
                    if (!dataOperator.hasOwnProperty(dataName)) continue;
                    let operateInfo = dataOperator[dataName];
                    if (isFunction(operateInfo)) {
                        operateInfo = {
                            listener: dataName === operateInfo.name ? 'click' : operateInfo.name,
                            callback: operateInfo
                        }
                    }
                    if (isObject(operateInfo)) operateInfo.dataName = dataName;
                    else console.log("Error: A member of dataOperator is not a function or an object!");
                    result.push(operateInfo);
                }
                return result;
            }(options.dataOperator)).forEach(function (operateInfo) {
                if (isFunction(operateInfo)) {
                    operateInfo = {
                        dataName: operateInfo.name,
                        callback: operateInfo
                    };
                }
                operateInfo.listener || (operateInfo.listener = "click");
                console.log($wd(elem).attr(options.attrName));
                if (!isUndefined(operateInfo.dataName) && operateInfo.dataName !== $wd(elem).attr(options.attrName)) return;
                // Binds the event
                if (isFunction(operateInfo.callback)) {
                    elem.addEventListener(operateInfo.listener, function () {
                        operateInfo.callback.call(data, elem, options.params);
                    });
                }
                isMatch = true;
            });
            return isMatch;
        };
        // Starts the actual rendering process
        $wd(elem).find('[' + options.attrName + ']', true).forEach(function (elem) {
            let dataName = $wd(elem).attr(options.attrName);
            // Data matching
            let isMatch =
                // Checks for a match in the dataBuilder array
                buildElem(elem) ||
                // Checks for an autoMatch and fills the element with the corresponding value from the data object
                function () {
                    if (options.autoMatch && !isMatch) {
                        for (let an in data) {
                            if (!data.hasOwnProperty(an)) continue;
                            if (dataName === an) {
                                isMatch = true;
                                if (elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA") {
                                    $wd(elem).value(data[an]);
                                    continue;
                                }
                                if (elem.tagName === "IMG") {
                                    elem.src = data[an];
                                    continue;
                                }
                                if (elem.tagName === "A") {
                                    elem.href = data[an];
                                    continue;
                                }
                                if ($wd(elem).attr("parseHTML") === 'true') {
                                    $wd(elem).html(data[an]);
                                    continue;
                                }
                                elem.textContent = data[an];
                            }
                        }
                    }
                    return isMatch;
                }();
            // Event binding
            // Checks for a match in the dataOperator object
            bindEvent(elem);
            // Resets the form if no match is found and options.reset is true
            if (options.reset && !isMatch) {
                $wd(elem).value(null);
                isMatch = true;
            }
            // Warns if no match is found
            if (!isMatch) {
                console.log({
                    title: 'Unmatched item found [' + dataName + ']',
                    detail: 'Warning: An element [data-name="' + dataName + '"] did not match any data.'
                }, elem, data);
            }
        });
    });
    return this;
};
/**
 * A selector for a single element, similar to querySelector.
 * @param {(string|Element|NodeList)} selector - A CSS selector string, an element, or a NodeList.
 * @returns {Element|null} The first element that matches the selector, or null if no match is found.
 * @global
 */
let $wds = function (selector) {
    let targetElements = [];
    // String > selector mode
    if (isString(selector))
        targetElements = [].slice.call(document.querySelectorAll(selector));
    // HTML Element
    if (isElement(selector))
        targetElements.push(selector);
    // HTML Element Array
    if (isElementArray(selector))
        targetElements = [].slice.call(selector);
    if (targetElements.length >= 1) return targetElements[0];
};

/**
 * Inserts a new element after a target element.
 * @param {Element} targetElement - The target element.
 * @param {Element} newElement - The new element to insert.
 */
function insertAfter(targetElement, newElement) {
    let parent = targetElement.parentNode;
    if (parent.lastChild === targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

/**
 * Inserts a new element after a target table element.
 * @param {Element} targetElement - The target table element.
 * @param {Element} newElement - The new element to insert.
 * @returns {Element|null} The new element if successful, otherwise null.
 */
function insertAfterTable(targetElement, newElement) {
    if (isTableElement(targetElement)) {
        let maxDegree = 10;
        let posElem = null;
        while (isTableElement(targetElement) && targetElement.parentElement) {
            posElem = targetElement;
            targetElement = targetElement.parentElement;
            if (maxDegree++ > 10) break;
        }
        if (isElement(targetElement)) {
            insertAfter(posElem, newElement);
            return newElement;
        }
    }
    return null;
}

/**
 * Creates a single node from an HTML string.
 * @param {string} htmlString - The HTML string.
 * @returns {Node|NodeList|null} The created node or NodeList, or null if the string is empty.
 */
function createElementByHtml(htmlString) {
    let map = {
        "td": [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        "th": [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        "tr": [2, "<table><thead>", "</thead></table>"],
        "option": [1, "<select multiple='multiple'>", "</select>"],
        "optgroup": [1, "<select multiple='multiple'>", "</select>"],
        "legend": [1, "<fieldset>", "</fieldset>"],
        "thead": [1, "<table>", "</table>"],
        "tbody": [1, "<table>", "</table>"],
        "tfoot": [1, "<table>", "</table>"],
        "colgroup": [1, "<table>", "</table>"],
        "caption": [1, "<table>", "</table>"],
        "col": [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        "link": [3, "<div></div><div>", "</div>"]
    };
    if (!htmlString) return null;

    let tagName = htmlString.match(/<(\w+)/) && htmlString.match(/<(\w+)/)[1] ?
        htmlString.match(/<(\w+)/)[1] : 0;

    let mapEntry = map[tagName] ? map[tagName] : null;
    if (!mapEntry) mapEntry = [0, "", ""];

    let div = document.createElement("div");

    div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];

    while (mapEntry[0]--) div = div.lastChild;

    if (div.childNodes && div.childNodes.length === 1)
        return div.childNodes[0];
    return div.childNodes;
}

/**
 * Creates an element from a template string.
 * @param {(string|Element|Function)} template - A string (data-template="xxx"), an element to clone, or a function that returns an element.
 * @param {Object} [data] - The data to render.
 * @returns {Element|null} The created element, or null if the template is not found.
 */
function createElemByTemplate(template, data) {
    // Creates a clone of the template element
    let duplicateElem = null;
    // template [element]
    if (isElement(template)) {
        duplicateElem = template.cloneNode(true);
    }
    // template [string]
    if (isString(template)) {
        // Checks if the string is HTML
        if (template.match(/^<(\w+)[\S\s]*\/?>(?:<\/\1>|)$/)) {
            duplicateElem = $wd.createElementByHtml(template);
            return duplicateElem;
        }
        // Searches for the template
        let templateElem = document.querySelector('#templateContainer [data-template="' + template + '"]') ||
            document.querySelector('#templateContainer [template="' + template + '"]') ||
            document.querySelector('[data-template="' + template + '"]') ||
            document.querySelector('[template="' + template + '"]');
        duplicateElem = templateElem ?
            templateElem.cloneNode(true) :
            null;
        duplicateElem && duplicateElem.removeAttribute('template');
    }
    // template [function]
    if (isFunction(template)) {
        duplicateElem = template();
    }
    return duplicateElem;
}

/**
 * Gets the form data. Elements must have a 'data-formName' attribute.
 * @param {Element} container - The root node of the form.
 * @returns {Object} An object containing the form data.
 */
function getFormData(container) {
    let formData = {};
    $wd(container).find('[data-formName]').forEach(function (elem) {
        let dataName = elem.getAttribute('data-formName');
        if (elem.tagName === "INPUT" || elem.tagName === "SELECT" || elem.tagName === "TEXTAREA" || elem.tagName === "RADIO") {
            formData[dataName] = $wd(elem).value();
        }
    });
    return formData;
}
export {$wd,$wds,showElem,hideElem,insertAfter,insertAfterTable,createElementByHtml,createElemByTemplate,getFormData}
