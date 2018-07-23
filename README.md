## Description
接口管理、上传组件、很多很多

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

## Authors
- wdzxc
