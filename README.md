## Description
Interface management and utils use on interacting with the server

将分散的接口调用配置集中化管理，并提供 mixin 等配置复用模式，
内部维护简单的请求队列、可以对请求响应自动进行排序、缓存等。

## Package List

* Utils
* InterfaceProxy
* FileUploader

## InterfaceProxy
### Basic Usage
```javascript
import {InterfaceProxy} from 'mider';

const iProxy = new InterfaceProxy({
    user:{
        url:'/user',
        params:{
            id:String,
            name:String,
        },
    },
    vip:{
        mixins:'user',
        params:{
            id:String,
            name:String,
            type:'vip',
        },
    },
});

iProxy.user(1).then().catch().finally();
// GET /user?id=1

iProxy.user.post({name:'foo'});
// Post /user
// Content-Type: application/json
// Body {name:'foo'}

iProxy.user.put({id:'1',name:'bar'});
// Put /user
// Content-Type: application/json
// Body {id:'1',name:'bar'}

iProxy.user.delete({params:{ id:'1' }});
// DELETE /user?id=1

iProxy.vip(1);
// GET /user?id=1&type=vip
```

### Default Options
默认配置会被应用到实例化的 InterfaceProxy 的每个接口方法
- 每个接口单独的配置项比默认配置项有更高的优先级
```javascript
import {InterfaceProxy} from 'mider';

const iProxyDelete = new InterfaceProxy({
    user:{
        url:'/user',
    },
    article:{
        url:'/article',
    },
    comment:{
        url:'/comment',
        params:{
            id:String,
            articleId:String,
        }
    }
},{
    type:'delete',
    params:{id:String},
});

iProxyDelete.user(1);
// DELETE /user?id=1

iProxyDelete.article(10);
// DELETE /article?id=10

iProxyDelete.comment(null,10);
// DELETE /comment?article=10
```

### Interface Configs
```js
const config = {
    // {String} 路径，别名 url
    pathname : '/user/:id',
    
    // {String} 基础域名，如果设置了域名，pathname 会被补全域名部分
    origin : '',
    
    // {String} [="get"] 请求方法，别名为 method，可选["get"|"delete"|"head"|"option"|"post"|"put"|"patch"]
    type : 'get', 
    
    // {String} [="json"] 响应数据类型 数据类型，可选["json","jsonp","html"] 
    dataType : 'json',
    
    // {Object} URL query 接受的参数形式， 接口调用时没有对应参数，配置逐级按照对象属性覆盖
    params : { id : 9 } ,
    
    // {Object|Array|String|Number} Request Body 传递的数据内容
    data : { content : 'hello'},
    
    // {Object} 路径参数
    // /api/pathParams/:id
    // => /api/pathParams/998
    pathParams: {
        id: 998,    
    },
    
    // {String} [="jsonp"] jsonp callback ,需要设置 dataType 为 jsonp 此项才会生效
    jsonp : 'callback',
    
    // {Function} 请求发送前钩子函数，暂时只支持设置 header ...
    beforeSend : function(xhr){
        xhr.setRequestHeader('x-token','...');
    },
    
    // {Function} 参数过滤回调删除
    paramsFilter : function(params) {
      params.timeStamp = +new Date();
      return params;
    },
    
    // {String} 解析数据时的数据提取路径
    // Config { dataPath : 'data.row' }
    // => Response : { data:{ count:99 , row:[ 1,2,3 ... ] } , success:true }
    // => .then( data => //   )
    dataPath : 'data.row',
    
    // {Function} 钩子函数，数据预处理功能，处理对象为即将提供给 .then(data) 的 data
    dataFilter : function(data) {
      data.date = new Date(data.date);
      return data;
    },
    
    // {Function} 钩子函数，自定义响应数据成功失败状态判断与数据提取
    // 回调函数的返回值标识了判断的成功状态与数据
    // { success: true|false , data: any }
    successHandler : function(res) {
        return {
            success: res.statusCode === 0 ? true:false,
            data: res.data,
        }
        // 如果 success 为 false ， 则可以使用 msg 字段替代 data 返回错误详情信息
    },
    
    // {Boolean} 合并，同一个接口，相同参数的请求会合并为一个服务器的请求
    merge: true,
    
    // {Boolean} 排队，同一个接口，所有请求的回调会按照请求发起的顺序排队进行
    queue: true,
    
    // {Boolean} 单一，同一时间，请求中的接口只有最后一个会生效。即只有最后一个请求会触发回调函数
    single: true,
    
    // {String|Array} 混入配置
    // 如果传入的是个字符串混入对应名称的配置项
    // 如果传入的是数组则从后向前依次混入覆盖
    mixins: ['account'],
        
    // 描述性配置项
    
    // {String}  接口描述名称
    name : '',
    
    // {*}  接口返回数据
    returns : {
        id: 9,
        name: 'foo',
    }
    
}
```

## Authors
- wdzxc
