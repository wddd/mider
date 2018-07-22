//=========================================================
//  Element  Query & Show & Hide
//=========================================================
import {
    isArray, isFunction, isNumber, isObject, isString, isUndefined
} from "./isWhat";

//=========================================================
//  类型检查扩展
//=========================================================
/**
 * 多类型检查
 * 支持传入链式操作
 * @param variable 变量
 * @param {(object|Array)} options  [ function isString(){} , ... ] , { isString : function(){} , ... }
 * @param single 检查<strong>成功一次</strong>后退出
 * @returns {{}}
 * @global
 * @example
 *
 * isWhat(document.createElement('div')).isTypes(['string','element','array'],function () {
     *     console.log("str | elem |  array ");
     * }).isObject(function () {
     *     console.log("obj");
     * }).isString(function () {
     *     console.log("str2");
     * }).isEqual("peter",function () {
     *     console.log("peterE1");
     * },1).isEqual("peter",function () {
     *     console.log("peterE2");
     * });
 * // => str | elem |  array
 *
 */
let isWhat = function (variable, options, single) {
    // 类型检查名称
    let typeMap = {
        'isFunction': isFunction,   // function 是关键字，不能用啦
        'array': isArray, 'isArray': isArray,
        'object': isObject, 'isObject': isObject,
        'undefined': isUndefined, 'isUndefined': isUndefined,
        'string': isString, 'isString': isString,
        'number': isNumber, 'isNumber': isNumber,
        'isEqual': null, // 自定义检查
        "isTypes": null   // 自定义检查
    };
    // ---1-->--2-->--3-->---
    // options : [ function isString(){} , ... ]
    single = single ? 1 : options && options.length;
    void(isArray(options) && Array.prototype.forEach.call(options, function (callback) {
        void(callback.name && typeMap[callback.name] && typeMap[callback.name](variable) && !function () {
            void(single-- && single >= 0 && callback());
        }());
    }));

    function forEachIn(obj, cb) {
        Object.keys(obj).forEach(key => {
            cb(obj[key], key);
        });
    }

    // options : { isString : function(){} , ... }
    void(isObject(options) && forEachIn(options, function (callback, type) {
        void(type && typeMap[type] && typeMap[type](variable) && !function () {
            void(single-- && single >= 0 && callback());
        }());
    }));
    // ---1-->--{}.A()-->--{}.B()-->---
    let next = {};
    for (let an in typeMap) {
        if (!typeMap.hasOwnProperty(an)) continue;
        /**
         * @param {string} type
         * @param {...*} * 之后的为可变参数
         */
        next[an] = function (type) {
            // 参数形式
            // 比较值cmpValue 成功回掉callback
            // 比较值cmpValue 成功回掉callback 成功后终结标记barrier
            // 成功回掉cmpValue 成功后终结标记callback
            return function (cmpData, callback, barrier) {
                // params : callback
                if (arguments.length === 1) callback = cmpData;
                // params : callback barrier
                if (arguments.length === 2 && !isFunction(callback)) {
                    barrier = callback;
                    callback = cmpData;
                }
                // isEqual处理
                if (type === "isEqual") {
                    (variable === cmpData) && callback();
                }
                // isType处理
                else if (type === "isTypes") {
                    // 检查类型数组中有对应值则返回
                    isArray(cmpData) && cmpData.slice(0).forEach(function (typeName) {
                        if (typeMap[typeName] && typeMap[typeName](variable)) {
                            callback();
                            cmpData.splice(0, cmpData.length);
                        }
                    });
                }
                // 普通类型检查处理
                else if (typeMap[type](variable) && callback) {
                    callback();
                }
                // 成功一次后终结处理
                if (barrier) {
                    for (let an in next) {
                        if (!next.hasOwnProperty(an)) continue;
                        next[an] = function () {
                            return next;
                        };
                    }
                }
                return next;
            };
        }(an);
    }
    return next;
}

/**
 * 类型检查 Element
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isElement = function (obj) {
    return /^\[object HTML\w*Element]$/.test({}.toString.call(obj));
};
/**
 * 类型检查 HTMLCollection NodeList
 * @param  {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isElementArray = function (obj) {
    return {}.toString.call(obj) === '[object HTMLCollection]' || {}.toString.call(obj) === '[object NodeList]';
};
/**
 * 类型检查 TableElement {thead|tbody|tr|td|th...}
 * @param {*} obj 检查目标
 * @global
 * @returns {boolean}
 * */
let isTableElement = function (obj) {
    return /^\[object HTMLTable\w*Element]$/.test({}.toString.call(obj));
};
/**
 * 显示目标元素 在style属性中附加display:none
 * @param {Element} elem 需要显示的元素
 * @memberof $wd
 */
function showElem(elem) {
    if (!elem) return;
    let attrStr = elem.getAttribute('style');
    if (attrStr == null) return;
    // 删除掉 style 中的 display:none
    elem.setAttribute('style', attrStr.replace(/display *: *none;* */g, ""));
}
/**
 * 隐藏目标元素
 * @param {Element} elem 需要隐藏的元素
 * @memberof $wd
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
//=========================================================
//  Element Query
//=========================================================
/**
 * 选择器
 * @param selector
 * @namespace $wd
 * @global
 * @returns $wd
 */
function $wd(selector) {
    if (isUndefined(this) || this === window) {
        return new $wd(selector);
    }
    // 字符串  > 选择器模式
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
 * Array splice
 * @param start
 * @param deleteCount
 * @param items
 * @return $wd
 */
$wd.prototype.splice = function (start, deleteCount, items) {
    [].splice.apply(this, arguments);
    return this;
};
/**
 * Array filter
 * @param callback
 * @return $wd
 */
$wd.prototype.filter = function (callback) {
    return this.splice.apply(this, [0, this.length].concat([].filter.call(this, callback.bind(this))));
};
/**
 * Array map
 * @param {function} callback
 * @return $wd
 */
$wd.prototype.map = function (callback) {
    return this.splice.apply(this, [0, this.length].concat([].map.apply(this, arguments)));
};
/**
 * 修改元素内的HTML
 * <pre>
 *     //有XSS问题 ╮(╯-╰)╭
 *     $wd('.title').html('<img src="http://i1.hdslb.com/icon/5d599bbb5276c1e92e261aceb8f75331.gif" onerror="alert("请检查网络连接，图片不见了(；′⌒`)")">');
 * </pre>
 * @param option {(string|Element|function)} 可以为字符串（htmlStr）、元素、返回值为这三种类型的元素
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.html = function (option) {
    this.forEach(function (elem) {
        // 清空原有内容
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
 * 设置样式
 * @param cssStr
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.setStyle = function (cssStr) {
    this.forEach(function (elem) {
        elem.style.cssText = cssStr;
    });
    return this;
};
/**
 * 移除元素 无参数移除自身，有参数移除参数匹配对象
 * @param {string} [options=]  undefined:移除选择器内元素内参数选中的元素于父节点 string:移除选择器选中元素于父节点
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
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
 * 添加Class
 * @param classStr
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.addClass = function (classStr) {
    this.forEach(function (elem) {
        if (!new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
            let classList = elem.className.split(' ');
            classList.push(classStr);
            elem.className = classList.join(' ');
            // 整理className
            elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
        }
    });
    return this;
};
/**
 * 移除Class
 * @param {string} classStr class名称
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.removeClass = function (classStr) {
    this.forEach(function (elem) {
        if (new RegExp('\\b' + classStr + '\\b').test(elem.className)) {
            // 移除class
            elem.className = elem.className.replace(new RegExp('\\b' + classStr + '\\b'), '');
            // 整理className
            elem.className = elem.className.replace(/^ +/, '').replace(/ {2,}/g, ' ');
        }
    });
    return this;
};
/**
 * 选择器容器内元素遍历
 * @param {function} callback 回调函数
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.forEach = function (callback) {
    [].forEach.call(this, callback);
    return this;
};
/**
 * 选择器容器内查找
 * @param {string} cssStr 匹配规则字符串
 * @param {boolean=} [selfMatch=false] 是否匹配自身
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.find = function (cssStr, selfMatch) {
    let tempElements = [0];
    this.forEach(function (elem) {
        // 检查自身是否符合条件
        selfMatch && function () {
            let match = false;
            if (elem.parentNode) {
                match = $wd(elem.parentNode).find(cssStr).has(elem);
            } else {
                // 对于没有父节点的元素，构造一个父节点加入其中之后对父节点进行查找
                let curParentElem = document.createElement('div');
                curParentElem.appendChild(elem);
                match = $wd(curParentElem).find(cssStr).has(elem);
                $wd(curParentElem).remove();
            }
            match && tempElements.push(elem);
        }();
        [].forEach.call(elem.querySelectorAll(cssStr), function (elem) {
            let has = false;
            [].forEach.call(tempElements, function (stockElem) {
                if(stockElem === elem){
                    has = true;
                }
            });
            !has && tempElements.push(elem);
        });
    });

    // 排除重复
    let arr = [];
    tempElements.forEach(function (elem) {
        if (!arr.find(e => e === elem))
            arr.push(elem);
    });

    // 替换数组
    this.splice(0, this.length);
    arr.splice(1, 0, this.length);
    this.splice.apply(this, arr);

    return this;
};
/**
 * 特性操作 Attr
 * @param {string} options attr名称
 * @param {string=} value  如果value参数，则会对选择器容器内第一个元素的对应attr进行赋值
 * @returns {$wd|string} 如果不包含第二个参数返回对应attr值，包含第二个参数则返回改变对应attr值之后的元素列表
 * @memberof $wd
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
 * 隐藏元素
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.hide = function () {
    this.forEach(function (elem) {
        hideElem(elem);
    });
    return this;
};
/**
 * 显示元素
 * @returns {$wd} 返回当前可操作的元素列表
 * @memberof $wd
 */
$wd.prototype.show = function () {
    this.forEach(function (elem) {
        showElem(elem);
    });
    return this;
};
/**
 * 检查当前容器内的元素列表中是否有目标元素
 * @param {element} targetElem 目标元素
 * @returns {boolean}
 * @memberof $wd
 */
$wd.prototype.has = function (targetElem) {
    let isMatch = false;
    this.forEach(function (elem) {
        if (targetElem === elem) isMatch = true;
    });
    return isMatch;
};
/**
 * 检查当前容器的元素的子节点是否有目标元素
 * @param {element} targetElem 目标元素
 * @returns {boolean}
 * @memberof $wd
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
 * 获取表单元素的Value
 * @param {(number|string|null)} [value=] 如果有这个参数，则以此作为表单元素的新值
 * @returns {($wd|string)}
 * @memberof $wd
 */
$wd.prototype.val = $wd.prototype.value = function (value) {
    // 如果元素为空直接返回
    if (this.length <= 0) return null;
    // radio pattern | 设置value时，如果没有对应的radio返回null | 没有选中任何radio返回null
    let isRadio = true, radioValue = null, singleName = null, isSelect = false;
    // select pattern | 设置value时，如果没有对应的option返回null
    let selectValue = null, checkedEnd = false, isSelectMatch = false;
    this.forEach(function (elem, index) {
        if (checkedEnd) return;
        if (index === 0) singleName = elem.name;
        if (index >= 0 && elem.name !== singleName) {
            console.warn("Warning:尝试获取value的RadioList存在不同的Name");
        }
        // Radio设置对应值
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
        // Select处理
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
 * 获取表单数据 data-formName标记的值为名称
 * @return {object}
 * @memberof $wd
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
 * 数据渲染
 * @param {object} config                               - 基础配置对象
 * @param {(object)=} config.data                       - 数据
 * @param {string=} [config.attrName="data-global"]     - 关联属性名称
 * @param {array=} config.dataBuilder                   - 数据构造器数组
 * @param {object=} config.dataOperator                 - 数据事件绑定对象
 * @param {*=} [config.params=null]                     - 附加参数，会作为构造器函数调用时的第三个参数
 * @param {object=} [config.reset=true]                 - 无匹配元素置空
 * @return $wd 返回当前可操作的元素列表
 * @memberof $wd
 * @example $wd('div').render({data:{supplierName:123123}}).render({data:{warehouseName:123123}});
 */
$wd.prototype.render = function (config) {
    let options = {
        // 列表数据
        data: [],
        // 数据构造 | data-name | [  { dataName:[string],setMethod:[function|string] },   function name(){}  ]
        dataBuilder: [],
        dataOperator: {},
        // 渲染目标
        attrName: 'data-global',
        // 附加参数
        params: null,
        autoMatch: true,
        // 无匹配元素置空
        reset: false
    };
    $wd.objCover(options, config);
    let data = options.data;
    // 遍历容器中所有的元素
    this.forEach(function (elem) {
        // 构造内容构建方法
        let buildElem = function (elem) {
            let isMatch = false;
            let dataName = $wd(elem).attr(options.attrName);
            // 检查dataBuilder []  模式匹配
            options.dataBuilder.forEach(/**
             @param {(object|function)} builder
             @param {function} builder.setMethod
             @param {string} builder.dataName
             @param {string} builder.name
             */function (builder) {
                // 函数模式 function name (){}
                if (isFunction(builder)) {
                    if (builder.name !== dataName) return;
                    builder(data, elem, options.params);
                    isMatch = true;
                    return;
                }
                // Object模式 {dataName:"",setMethod:Function,getMethod:Function}
                if (builder.dataName !== dataName) return;
                if (isUndefined(builder.setMethod)) return;
                // 存在构造方法 setMethod
                // 1、字符串 > 尝试进行执行
                // 2、函数 > 执行并分析返回值，如果返回值为字符串或元素则进行构造
                if (isString(builder.setMethod)) {
                    elem.textContent = builder.setMethod;
                    isMatch = true;
                } else if (isFunction(builder.setMethod)) {
                    // 构造对应ListItem的ListControlStruct
                    builder(data, elem, options.params);
                    isMatch = true;
                } else {
                    console.error("Error:匹配的dataBuilder执行异常.");
                }
            });
            return isMatch;
        };
        // 构造事件绑定方法
        let bindEvent = function (elem) {
            let isMatch = false;
            (isArray(options.dataOperator) ? options.dataOperator : function (dataOperator) {
                // dataOperator {object} => {array}
                let result = [];
                for (let dataName in dataOperator) {
                    if (!dataOperator.hasOwnProperty(dataName)) continue;
                    let operateInfo = dataOperator[dataName];
                    // -->--[->-]-->--
                    if (isFunction(operateInfo)) {
                        operateInfo = {
                            listener: dataName === operateInfo.name ? 'click' : operateInfo.name,
                            callback: operateInfo
                        }
                    }
                    // 将对象属性名作为标记为元素特性值
                    if (isObject(operateInfo)) operateInfo.dataName = dataName;
                    else console.log("Error : dataOperator中有成员不是函数或者对象！");
                    result.push(operateInfo);
                }
                return result;
            }(options.dataOperator)).forEach(function (operateInfo) {
                // dataOperator {array}
                if (isFunction(operateInfo)) {
                    operateInfo = {
                        dataName: operateInfo.name,
                        callback: operateInfo
                    };
                }
                operateInfo.listener || (operateInfo.listener = "click");
                console.log($wd(elem).attr(options.attrName));
                if (!isUndefined(operateInfo.dataName) && operateInfo.dataName !== $wd(elem).attr(options.attrName)) return;
                // 绑定事件
                isFunction(operateInfo.callback) && elem.addEventListener(operateInfo.listener, function () {
                    operateInfo.callback.call(data, elem, options.params);
                });
                isMatch = true;
            });
            return isMatch;
        };
        // 开始实际渲染过程
        $wd(elem).find('[' + options.attrName + ']', true).forEach(function (elem) {
            let dataName = $wd(elem).attr(options.attrName);
            // 数据匹配
            let isMatch =
                // 检查 dataBuilder []  模式匹配
                buildElem(elem) ||
                // 检查 autoMatch 使用{object}data中的对应data-name的值填充
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
            // 事件绑定
            // 检查 dataOperator {} 模式匹配
            bindEvent(elem);
            // 没有匹配的表单进行重置 options.reset==true
            if (options.reset && !isMatch) {
                $wd(elem).value(null);
                isMatch = true;
            }
            // 没有任何匹配进行警告
            if (!isMatch) {
                console.log({
                    title: '发现一个无匹配项 [' + dataName + ']',
                    detail: 'Warning:一个元素 [data-name="' + dataName + '"] 没有匹配到对应数据 > (°∀°)ﾉ'
                }, elem, data);
            }
        });
    });
    return this;
};
/**
 * 单个元素选择器
 * 类似querySelector
 * @param selector 选择器
 * @returns {element} 返回符合传入选择器规则的元素，如果为数组则返回第一个元素
 * @global
 */
let $wds = function (selector) {
    // Fake Facade <(￣︶￣)>
    let targetElements = [];
    // 字符串  > 选择器模式
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
//=========================================================
// 节点操作
//=========================================================
/**
 * 节点后插入
 * @param {Element} targetElement
 * @param {Element} newElement
 * @memberof $wd
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
 * 节点（表格元素）后插入
 * @param {Element} targetElement 目标元素
 * @param {Element} targetElement.parentElement 父元素节点
 * @param {Element} newElement
 * @returns {*}
 * @memberof $wd
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
//=========================================================
//  Element Template Create
//=========================================================
/**
 * 使用HTML str创建单个节点
 * @param htmlString  创建HTML使用的字符串 HTML str
 * @returns {Node|NodeList} 返回构造好的单个节点 或者 节点数组
 * @memberof $wd
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
 * 使用模板str生成元素
 * @param template {string|Element|function} 模板 可以为字符串（data-template="xxx") 或者 元素 Element.clone
 * @param data {object=}
 * @returns {Element}
 * @memberof $wd
 */
function createElemByTemplate(template, data) {
    // 创建 模板副本元素
    let duplicateElem = null;
    // template [element]
    if (isElement(template)) {
        duplicateElem = template.cloneNode(true);
    }
    // template [string]
    if (isString(template)) {
        // 测试是否为HTML
        if (template.match(/^<(\w+)[\S\s]*\/?>(?:<\/\1>|)$/)) {
            duplicateElem = $wd.createElementByHtml(template);
            return duplicateElem;
        }
        // 搜索模板
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

//=========================================================
// 表单相关
//=========================================================
/**
 * 获取表单数据
 * 元素需设置 属性 data-formName
 * @param container Element: 表单的根节点，会在这个节点下查找表单元素
 * @returns {object} data-formName 的属性值作为 变量属性名
 * @memberof $wd
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
