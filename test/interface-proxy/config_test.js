// import {InterfaceProxy} from '../../src/index.js';
import iProxy from './iProxy';

describe("Interface config", () => {
    // 配置项 queue 排队请求
    it("should orderly call callback as request sequence when queue config set true", (done) => {
        let returns = [];

        function archive(data) {
            returns.push(data);
            if (returns.length === 3) {
                expect(returns.map(value => value.index).join('-')).toEqual('1-2-3');
                done();
            }
        }

        iProxy.index({index: 1, delay: 1000}).then(data => {
            archive(data);
        });
        iProxy.index({index: 2, delay: 1}).then(data => {
            archive(data);
        });
        iProxy.index({index: 3, delay: 500, error: true}).catch((msg, data) => {
            archive(data.data);
        });
    });
    // 配置项 merge 合并相同请求
    it("should merge same query request when merge config set true", (done) => {
        let returns = [];

        function archive(data) {
            returns.push(data);
            if (returns.length === 2) {
                expect(returns[0]['counter'] === returns[1]['counter']).toBeTruthy();
                done();
            }
        }

        iProxy.indexMerge({index: 1, delay: 300}).then(data => {
            archive(data);
        });
        iProxy.indexMerge({index: 1, delay: 300}).then(data => {
            archive(data);
        });
    });
    // 配置项 single 同一个接口的请求仅响应最后一个
    it("should only response callback last request when config set single true", (done) => {
        let returns = [];
        iProxy.indexSingle({index: 1, delay: 100}).then(data => {
            returns.push(data);
        });
        // iProxy.indexSingle({index: 2, delay: 500}).then(data => {
        //     console.log(data);
        //     expect(returns.length).toBeLessThan(1);
        //     done();
        // });
        setTimeout(() => {
            iProxy.indexSingle({index: 2, delay: 500}).then(data => {
                expect(returns.length).toBeLessThan(1);
                done();
            });
        }, 1);
    });

    // 配置项 validTime
    it("should support config validTime", (done) => {
        let cacheData = null;
        let query = {index: 9999, delay: 500};
        iProxy.indexValidTime(query).then(data => {
            cacheData = data;
            let newData = null;
            iProxy.indexValidTime(query).then((data) => {
                newData = data;
            });
            setTimeout(() => {
                expect(newData).toEqual(cacheData);
            }, 50);
            setTimeout(() => {
                iProxy.indexValidTime(query).then((data) => {
                    newData = data;
                    expect(data.counter === cacheData.counter).toBeFalsy();
                    done();
                });
            }, 550);
        });
    });
    // 配置项 jsonp
    it("should support jsonp", (done) => {
        iProxy.jsonpSuccess().then(data => {
            expect(data.callback).toBeTruthy();
            done();
        });
    });

    // 支持 async await
    it("can work with es7 async function", (done) => {
        (async function () {
            async function test() {
                try {
                    var successData = await iProxy.jsonSuccess();
                    var failData = await iProxy.jsonFail();
                } catch (e) {
                    return {successData, failData}
                }
                return {successData, failData};
            }

            let {successData, failData} = await test();
            expect(successData).toBeDefined();
            expect(failData).toBeUndefined();
            done();
        })();
    });

    // 支持 post 方法传递方法请求的data参数
    it("should support multiple methods post data", (done) => {
        let user = {
            name: 'lina',
            job: 'sorceress',
            race: 'human',
        };
        iProxy.user.post(user).then(data => {
            expect(data.method).toBe('POST');
            expect(data.body).toEqual(user);
            done();
        });
    });

    it("should support loadingSwitch config", (done) => {
        let testSwitch = {
            state: false,
        };
        iProxy.index({delay: 200}).loadingSwitch(testSwitch, 'state').finally(() => {
            expect(testSwitch.state).toBeFalsy();
            done();
        });
        // loadingSwitch trigger progress will async start
        setTimeout(() => {
            expect(testSwitch.state).toBeTruthy();
        }, 10);
    });

    it("should support error status 404", (done) => {
        iProxy.notFound().catch((err,errDetail) => {
            expect(err).toBe('Request failed with status code 404');
            console.log(errDetail);
            done();
        });
    });

    it("should support catch jsonp status error", (done) => {
        iProxy.notFoundJsonp().catch(err => {
            expect(err).toBe('Jsonp request error');
            done();
        });
    });

    // it("should support catch jsonp format error", (done) => {
    //     iProxy.jsonpError().catch(err => {
    //         expect(err).toBe('Jsonp response illegal');
    //         done();
    //     });
    // });

    it("should support params with Function & Types & {default:...} properties", (done) => {
        iProxy.userWithTimestamp().then(data => {
            expect(data.query.id).toBeUndefined();
            expect(data.query.name).toBe('wdzxc');
            expect(data.query.timestamp + 10000).toBeGreaterThan(+new Date());
            done();
        })
    });

    it("should call promise callback after params callback", (done) => {
        let returns = [];
        let errReturns = [];

        function archive(data, type) {
            if (type) {
                errReturns.push(data);
            } else {
                returns.push(data);
            }
            if (returns.length === 2 && errReturns.length === 2) {
                expect(returns[0]).toEqual(returns[1]);
                expect(errReturns[0]).toEqual(errReturns[1]);
                done();
            }
        }

        iProxy.jsonSuccess(data => {
            archive(data);
        }).then(data => {
            archive(data);
        });

        iProxy.jsonFail(() => {
        }, msg => {
            archive(msg, 'error');
        }).catch(msg => {
            archive(msg, 'error');
        });
    });
});