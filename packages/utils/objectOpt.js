//=========================================================
// Object Operate
//=========================================================
import {isArray, isFunction, isObject, isString, isUndefined} from "./isWhat";

/**
 * 对象复制
 * 其中的成员如果为对象{object}，则也进行复制操作
 * @param {Object|Array|Number|String} obj 目标对象
 * @returns {*} 返回复制的对象
 * @memberof $wd
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
    for (let an in obj2) {
        if (!obj2.hasOwnProperty(an) || (process === 'one-to-one' && !obj1.hasOwnProperty(an))) continue;
        obj1[an] = isFunction(process) ? process(obj2[an], an, obj1[an]) : obj2[an];
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
    let result = [], temp, originObj = objClone(obj), originOpt = options;
    isUndefined(options) && (originOpt = []);
    // 支持 使用逗号分隔的字符串生成配置数组 "oldName=>newName , oldName=>newName"
    isString(options) && ((temp = options) && (originOpt = options.split(',')));
    // 支持 从数组提取对象数组 obj [{a:1},{a:2}]  => [{b:1},{b:2}]
    !isArray(obj) && ((temp = originObj) && (originObj = []) && originObj.push(temp));
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
                let resolveReg = /([^=>,]+)=[>]?([^=>,]+)/;     // 支持中文
                if (resolveReg.test(name)) {
                    // 支持 'oldName=>newName' 'oldName=newName'
                    let originName = resolveReg.exec(name)[1];
                    let replaceName = resolveReg.exec(name)[2];
                    !isUndefined(getObjAttr(unit, originName)) && (setObjAttr(temp, replaceName, getObjAttr(unit, originName)));
                } else {
                    // 支持 'name'
                    !isUndefined(getObjAttr(unit, name)) && (setObjAttr(temp, name, getObjAttr(unit, name)));
                }
            });
        }
        result.push(temp);
    });
    if (!isArray(obj)) return result[0];
    return result;
}

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
        // keys & symbols
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