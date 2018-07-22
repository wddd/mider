## Description
前端项目公用模块、函数库

## Package List

* Utils
* InterfaceProxy
* FileUploader

## InterfaceProxy
### Basic Usage
```javascript
let iProxy = new InterfaceProxy({
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
```javascript
let iProxyDelete = new InterfaceProxy({
    user:{
        url:'/user',
    },
    article:{
        url:'/article',
    },
    comment:{
        url:'/comment',
        params:{
            id::String,
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
