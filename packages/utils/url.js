//=========================================================
//  URL解析
//=========================================================
import {isArray, isObject} from "./isWhat";
import {objCover, objExtract} from "./objectOpt";

/**
 * 解析URL 返回 解析数据对象
 * @param {string} url 需要解析的URL
 * @return {{source: *, query, origin: (*|string|string), params: {}, hashQuery, hashParams: {}, protocol: (string|XML|void|*), host, port, file: (*|string), hash: (string|XML|void|*), path: (string|XML|void|*), relative: (*|string), segments: Array, rebuild: rebuild}}
 * @memberof $wd
 */
function parseURL(url) {
    let a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        query: a.search,
        origin: a.origin || a.href.match(/\w+:\/\/[^\/\\]+/),
        params: function () {
            let ret = {},
                seg = a.search.replace(/^\?/, '').split('&');
            if (seg == false) return {};
            seg.forEach(function (e, index, arr) {
                arr[index] = {
                    name: e.split('=')[0],
                    value: decodeURI(e.split('=')[1])
                };
            });
            seg.forEach(function (e) {
                let name = e.name;
                let obj = [];
                if (typeof ret[name] === 'undefined') {
                    seg.forEach(function (e) {
                        if (e.name === name) obj.push(e.value);
                    });
                    if (obj.length === 1) ret[name] = obj[0];
                    else ret[name] = obj;
                }
            });
            return ret;
        }(),
        hashQuery: function () {
            return (a.hash.match(/(?=\?).*/) && a.hash.match(/(?=\?).*/)[0]) || "";
        }(),
        hashParams: function () {
            if (!/.*\?/.test(a.hash)) return {};
            let ret = {},
                seg = a.hash.replace(/.*\?/g, '').split('&');
            seg.forEach(function (e, index, arr) {
                arr[index] = {
                    name: e.split('=')[0],
                    value: decodeURIComponent(e.split('=')[1])
                };
            });
            seg.forEach(function (e) {
                let name = e.name;
                let obj = [];
                if (typeof ret[name] === 'undefined') {
                    seg.forEach(function (e) {
                        if (e.name === name) obj.push(e.value);
                    });
                    if (obj.length === 1) ret[name] = obj[0];
                    else ret[name] = obj;
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
        rebuild: function () {
            return buildURL({
                url: this.url,
                hash: this.hash,
                origin: this.origin,
                source: this.source,
                path: this.path,
                params: this.params,
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
    let urlInfo = parseURL(options.url || options.source);
    objCover(urlInfo, objExtract(options, "url", true));
    urlInfo.path = urlInfo.path.replace(/^(?=[^\/])/, '/');

    let paramsStr = "";
    Object.keys(urlInfo.params).forEach(key => {
        let value = urlInfo.params[key];
        if (value === null || value === undefined) return;
        if (!isArray(value)) value = [value];
        value.forEach(function (value) {
            if (isObject(value)) value = encodeURIComponent(JSON.stringify(value));
            paramsStr += (paramsStr ? "&" : "") + key + '=' + encodeURIComponent(value);
        });
    });
    return urlInfo.origin + urlInfo.path + (paramsStr ? "?" + paramsStr : "") + (urlInfo.hash ? "#" + urlInfo.hash : "");

}

export {parseURL, buildURL};