import {polyfill} from "es6-promise";

polyfill();

import InterfaceProxy from "../../packages/interface-proxy";
// clear local storage
localStorage.clear();

// test interface proxy instance
const iProxy = new InterfaceProxy({
    // json/user
    jsonRequest: {
        pathname: '/api/json/user',
    },
    user: {
        pathname: '/api/json/user',
        params: {
            id: null,
            name: null,
            job: 'jobless',
            race: 'human',
        }
    },
    userOrigin: {
        mixins: 'user',
        origin: 'http://127.0.0.1:15678',
    },
    userWithTokenHeader: {
        mixins: 'user',
        beforeSend(xhr) {
            xhr.setRequestHeader('x-token', '0001');
        },
    },
    userIntroduction: {
        mixins: 'user',
        dataFilter: function (data) {
            data.query.introduction = `${data.query.name}-${data.query.job}`;
            return data;
        }
    },
    userWithTimestamp: {
        mixins: 'user',
        params: {
            id: String,
            name: {
                type: String,
                default: 'wdzxc',
            },
            timestamp() {
                return +new Date();
            },
        }
    },
    postMan: {
        mixins: 'user',
        params: {
            job: 'postman',
        }
    },
    superUser: {
        mixins: 'user',
        paramsFilter(params) {
            params.job = 'super-' + params.job;
            return params;
        },
    },
    postmanIntroduction: {
        mixins: ['userIntroduction', 'postMan', {
            headers: {
                'x-mixes': 'milk',
            }
        }],
    },
    userName: {
        mixins: 'user',
        dataPath: 'query.name',
    },

    // 基础测试
    jsonpSuccess: {
        pathname: '/api/jsonp/success',
        dataType: 'jsonp',
        jsonp: 'callback',
    },
    jsonpError: {
        pathname: '/api/jsonp/error',
        dataType: 'jsonp',
        jsonp: 'callback',
    },
    jsonSuccess: {
        url: '/api/json/success',
    },
    jsonFail: {
        pathname: '/api/json/fail',
    },
    postTest: {
        pathname: '/api/post',
        type: 'post',
    },
    putTest: {
        pathname: '/api/put',
        method: 'put',
    },
    jsonFailAsSuccess: {
        pathname: '/api/json/fail',
        successHandler(res) {
            return {
                success: true,
                data: res,
            }
        },
    },
    notFound: {
        pathname: '/api/404',
    },
    notFoundJsonp: {
        pathname: '/api/404',
        dataType: 'jsonp',
        jsonp: 'callback',
    },
    multiResponseHtml: {
        pathname: '/api/multiResponse',
        dataType: 'html',
    },
    multiResponseText: {
        pathname: '/api/multiResponse',
        dataType: 'text',
    },
    index: {
        pathname: '/api/json/index',
        params: {
            index: 0,
            delay: null,
        },
        queue: true,
    },
    indexMerge: {
        pathname: '/api/json/index',
        params: {
            index: 0,
            delay: null,
        },
        merge: true,
    },
    indexSingle: {
        pathname: '/api/json/index',
        params: {
            index: 0,
            delay: null,
        },
        single: true,
    },
    indexValidTime: {
        mixins: ['index'],
        validTime: 0.5,
    },
    pathParams: {
        pathname: '/api/pathParams/:id',
        validTime: 1,
    },
}, [{
    headers: {
        'X-Requested-With': 'interface-proxy',
    },
}]);

export default iProxy;