declare interface ProxyPromise extends Promise<any> {

    then(onfulfilled?: ((data: any, response: object) => any) | undefined | null, onrejected?: ((reason: any) => never) | undefined | null): ProxyPromise;

    catch(onrejected?: ((reason: any, response: object) => any) | undefined | null): ProxyPromise;

    error(cb: Function): ProxyPromise;

    loadingSwitch(obj: object, key: string): ProxyPromise;

}

type PlainType = string | number | boolean;

declare interface ProxyMethod {
    (cb?: Function, ecb?: Function): ProxyPromise;

    (params: object, cb?: Function, ecb?: Function): ProxyPromise;

    (params: PlainType, cb?: Function, ecb?: Function): ProxyPromise;

    (params1: PlainType, params2: PlainType, cb?: Function, ecb?: Function): ProxyPromise;

    (params1: PlainType, params2: PlainType, params3: PlainType, cb?: Function, ecb?: Function): ProxyPromise;

    get(params?: any, config?: object): ProxyPromise,

    delete(params?: any, config?: object): ProxyPromise,

    options(params?: any, config?: object): ProxyPromise,

    head(params?: any, config?: object): ProxyPromise,

    post(data?: any, config?: object): ProxyPromise,

    put(data?: any, config?: object): ProxyPromise,

    patch(data?: any, config?: object): ProxyPromise,

}

declare interface AjaxConfig {
    pathname?: string;
    url?: string;
    origin?: string;
    type?: string;
    dataType?: string;
    jsonp?: string;
    beforeSend?: Function;
    paramsFilter?: Function;
    dataPath?: string;
    dataFilter?: Function;
    pathParams?: object;
    merge?: boolean;
    queue?: boolean;
    single?: boolean;
    validTime?: number;
    params?: object;
    name?: string;
    returns?: object | Array<any>;
    errCallback?: Function;
    ajax?: Function;
    successHandler?: Function;
    mixins?: string | Array<string>;
}

interface AjaxConfigs {
    [proxyMethod: string]: AjaxConfig;
}

export declare class InterfaceProxy {

    constructor(methodOptions: AjaxConfigs, commonOptions?: AjaxConfig);

    constructor(methodOptions: AjaxConfigs, commonOptions?: AjaxConfig[]);

    [proxyMethod: string]: ProxyMethod;
}

export interface Utils {
    objCover(obj1: object, obj2: object): object;

    objClear(obj: object): object;

    objEqual(obj1: object, obj2: object): boolean;

    objExtract(obj?: object, options?: Array<string> | string, except?: boolean): object;

    objectMix(obj1: object, obj2?: object, degree?: number): object;

    setObjAttr(obj: object, path?: string, value?: any): object;

    isObject(val: any): boolean;

    isArray(val: any): boolean;

    isNumber(val: any): boolean;

    isString(val: any): boolean;

    isNumber(val: any): boolean;

    isFunction(val: any): boolean;

    isUndefined(val: any): boolean;

    parseURL(url: string): object;

    buildURL(options: any): string;

    getScript(val: any): any;

}

export const $wd: Utils;

export declare class FileUploader {

    constructor(options: object);

    extractFiles(targetFiles?: any): any;

    send(targetFiles?: any): any;

    synergy(remainFiles?: any): any;
}

export const axios: any;