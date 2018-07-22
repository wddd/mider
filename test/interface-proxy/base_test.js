import InterfaceProxy from '../../packages/interface-proxy';
import iProxy from './iProxy';

describe("InterfaceProxy", () => {

    it("is defined", () => {
        expect(InterfaceProxy).toBeDefined();
    });
    // 基础配置信息 & 功能
    it("can generate request method with base config and call callback with args after request success", (done) => {
        iProxy.user().then((data, response) => {
            expect(response.success).toBeTruthy();
            expect(response.data).toEqual(data);
            expect(data.method).toBe('GET');
            expect(data.baseUrl).toBe('/api/json/user');
            expect(data.query.job).toBe('jobless');
            expect(data.query.race).toBe('human');
            done();
        });
    });
});

// TODO
// 一个BUG 在 single 的情况下，用同一个方法异步快速连续发送两次请求 会出现一次回调都没有的情况
// single: true,

// TODO
// 失败回调 如果返回true 则继续调用默认失败回调 测试