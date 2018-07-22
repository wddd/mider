// import {InterfaceProxy} from '../../src/index.js';
import iProxy from './iProxy';

describe("instance interface responses", () => {
    // JSON success then
    it("with default json pattern should resolve {success:true,...} as success and extract data", (done) => {
        iProxy.jsonSuccess().then(data => {
            expect(data).toEqual({name: 'wdzxc'});
            done();
        });
    });
    // JSON error catch
    it("with default json pattern should resolve {success:false,...} as error and extract error msg", (done) => {
        iProxy.jsonFail().catch(msg => {
            expect(msg).toBe('server error');
            done();
        });
    });
    // 失败回调
    it("should call error callback when response status is error", (done) => {
        iProxy.jsonFail(() => {
            // placeholder for success callback
        }, msg => {
            expect(msg).toBe('server error');
            done();
        });
    });
    // 响应预处理 配置项 dataPath
    it("should auto extract response data according to dataPath config", (done) => {
        iProxy.userName({name: 'wdzxc'}).then(data => {
            expect(data).toEqual('wdzxc');
            done();
        });
    });
    // JSON finally
    it("always call finally after catch & then ", (done) => {
        iProxy.jsonFail().catch(msg => {
        }).finally(() => {
            done();
        });
    });
});