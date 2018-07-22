// import {InterfaceProxy} from '../../src/index.js';
import iProxy from './iProxy';

describe("runtime hook", () => {
    // 配置项 hook paramsFilter
    it("should have config paramsFilter", (done) => {
        iProxy.superUser({job: 'police'}).then(data => {
            expect(data.query.job).toEqual('super-police');
            done();
        });
    });
    // 配置项 hook beforeSend
    it("should have beforeSend", (done) => {
        iProxy.userWithTokenHeader().then(data => {
            expect(data.headers['x-token']).toEqual('0001');
            done();
        });
    });
    // 配置项 hook successHandler
    it("should support hook successHandler to custom response state check", (done) => {
        iProxy.jsonFailAsSuccess().then(data => {
            expect(data).toEqual({success: false, msg: 'server error'});
            done();
        });
    });
});