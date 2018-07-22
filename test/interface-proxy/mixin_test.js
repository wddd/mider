// import InterfaceProxy from '../../packages/interface';
import iProxy from './iProxy';

describe("config mixin", () => {
    // 配置项 混入模式
    it("should support mixes normal config", (done) => {
        iProxy.postMan().then(data => {
            expect(data.query.job).toEqual('postman');
            done();
        });
    });
    // 配置项 多重混入 & dataFilter
    it("should support mixes mixin config", (done) => {
        iProxy.postmanIntroduction({name: 'wdzxc'}).then(data => {
            expect(data.query.introduction).toEqual('wdzxc-postman');
            expect(data.headers['x-mixes']).toEqual('milk');
            done();
        });
    });
});