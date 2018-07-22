// import {InterfaceProxy} from '../../src/index.js';
import iProxy from './iProxy';

describe("instance methods properties", () => {
    // instance.method.url
    it("should have url string as a string", (done) => {
        expect(iProxy.user.url).toBe('/api/json/user');
        done();
    });
    // instance.method.buildUrl
    it("should have buildUrl as a function", (done) => {
        // TODO 为每个接口方法提供buildUrl方法，返回根据参数构造后的URL
        done();
    });
});