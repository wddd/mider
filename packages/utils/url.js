/**
 * @file URL parsing and building utilities.
 */

import {isArray, isObject} from "./isWhat";
import {objCover, objExtract} from "./objectOpt";

/**
 * Parses a URL and returns an object with its components.
 * @param {string} url - The URL to parse.
 * @returns {{source: string, query: string, origin: string, params: Object, hashQuery: string, hashParams: Object, protocol: string, host: string, port: string, file: string, hash: string, path: string, relative: string, segments: Array<string>, rebuild: function(): string}} An object containing the parsed URL components.
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
            if (seg[0] === "") return {};
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
 * Builds a URL from an options object.
 * @param {Object} options - The options for building the URL.
 * @param {string} [options.url] - The base URL.
 * @param {string} [options.hash] - The hash.
 * @param {string} [options.origin] - The origin.
 * @param {string} [options.source] - The source URL.
 * @param {string} [options.path] - The path.
 * @param {Object} [options.params] - The query parameters.
 * @returns {string} The constructed URL.
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