// import {InterfaceProxy} from '../../src/index.js';
import iProxy from './iProxy';

describe("instance interface requests", () => {
    // params 参数自动匹配
    it("should extract params according to config.param", (done) => {
        iProxy.user('999', 'wdzxc').then(data => {
            expect(data.query.id).toBe('999');
            expect(data.query.name).toBe('wdzxc');
            done();
        });
    });
    // params 参数默认值
    it("with params config should regard as default value to query params", (done) => {
        iProxy.user().then(data => {
            expect(data.query.race).toBe('human');
            expect(data.query.job).toBe('jobless');
            done();
        });
    });
    // params 参数默认值覆盖
    it("with params config should be cover by request query params", (done) => {
        iProxy.user({id: '999', job: 'postman'}).then(data => {
            expect(data.query.id).toBe('999');
            expect(data.query.race).toBe('human');
            expect(data.query.job).toBe('postman');
            done();
        });
    });
    // 请求 dataType为 html
    it("should support dataType as html", (done) => {
        iProxy.multiResponseHtml().then(data => {
            expect(data).toBe("<p>hey</p>");
            done();
        });
    });
    // 请求 dataType为 text
    it("should support dataType as text", (done) => {
        iProxy.multiResponseText().then(data => {
            expect(data).toBe('hey');
            done();
        });
    });
    // 配置项 origin
    it("should replace request origin according to origin config", (done) => {
        iProxy.userOrigin().then(data => {
            expect(data.hostname).toEqual('127.0.0.1');
            done();
        });
    });
    it("should support config pathParams", (done) => {
        iProxy.pathParams.get(null, {
            pathParams: {
                id: 888,
            }
        }).then(data => {
            expect(data.baseUrl).toBe('/api/pathParams/888');
            done();
        })
    });
    // 请求预处理 - 当请求方法为 post 时，将 params 自动转移到 body
    it("should move query params to body when request method is post", (done) => {
        iProxy.postTest({data: 666}).then((data, response) => {
            expect(data).toEqual({data: 666});
            expect(response).toEqual({success: true, data: {data: 666}});
            done();
        });
    });
    // 请求预处理 - 当请求方法为 put 时，将 params 自动转移到 body
    it("should move query params to body when request method is put", (done) => {
        iProxy.putTest({data: 666}).then((data, response) => {
            expect(data).toEqual({data: 666});
            expect(response).toEqual({success: true, data: {data: 666}});
            done();
        });
    });
});

describe("instance method's api", () => {
    // 支持 post,delete,head,option api
    it("should have request method helper [get,delete,head,option]", (done) => {
        Promise.all([
            iProxy.user.get(),
            iProxy.user.delete(),
            iProxy.user.head(),
            iProxy.user.options(),
        ]).then(data => {
            expect(data.map(res => res && res.method)).toEqual(['GET', 'DELETE', null, null]);
            done();
        });
    });
    // 支持 post,put,patch methods
    it("should have request method helper [post,put,patch]", (done) => {
        Promise.all([
            iProxy.user.post(),
            iProxy.user.put(),
            iProxy.user.patch(''),
        ]).then(data => {
            expect(data.map(res => res && res.method)).toEqual(['POST', 'PUT', 'PATCH']);
            done();
        });
    });
    // 支持 post 使用调用函数的参数传递数据
    it("should support post string type argument with the request body", (done) => {
        iProxy.jsonRequest.post('wdzxc', {
            headers: {
                "Content-Type": "text/plain",
            }
        }).then(data => {
            expect(data.body).toEqual("wdzxc");
            done();
        });
    });
    it("should support multiple methods config", (done) => {
        let user = {
            name: 'lina',
            job: 'sorceress',
            race: 'human',
        };
        iProxy.user.post(user, {
            headers: {
                'x-token': '777',
            },
        }).then(data => {
            expect(data.method).toBe('POST');
            expect(data.body).toEqual(user);
            expect(data.headers['x-token']).toBe('777');
            done();
        });
    });
    // 请求支持同时传递 query 与 request body
    it("should support post both query and data", (done) => {
        iProxy.user.post(['hello'], {
            params: {
                lang: 'zh'
            }
        }).then((data) => {
            expect(data.originalUrl).toBe('/api/json/user?lang=zh');
            expect(data.query).toEqual({lang: 'zh'});
            expect(data.body).toEqual(['hello']);
            done();
        });
    });
});
