## Description
InterfaceProxy Module

## Usage
#### 必须配置项
路径可以是相对路径也可以是绝对路径，按书写方式区分
* pathname  : 路径
#### 可选配置项
可选的配置项，如果没有配置会使用默认值
* origin        ：{String} [=null] 域名，默认为空。如果一个接口存在origin配置，则会和 pathname进行拼接作为具体路径。
* type          : {String} [="GET"] 获取方式，可选类型["GET","POST"]
* dataType      : {String} [="json"] 数据类型，可选["json","jsonp","html"]
* params        : {Object|Array|String} 描述接口接受的参数形式， 接口调用时没有对应参数，会使用这里配置进行补充
>      { query: TYPE }
>      TYPE => Function    | 函数     ：执行函数并把函数返回值作为参数值
>      TYPE => String      | 字符串   ：如果是通过验证的JS代码则作为JS执行
* validTime     : {Number} 有效时间，单位为秒，可以为浮点数。存储方式优先使用localStorage（可以保证有效期内一直有效）,如果localStorage不可用则使用临时的数组结构进行替代（只在一个页面打开期间生效）。localStorage中过期的数据只有再次触发后发现过期才会自动删除。
* jsonp         : {Function} jsonp回调函数名称，默认 jsonpCallback
* loading       : {String|Boolean} 默认没有加载动画，如果传入字符串则会显示对应字符串的加载动画，加载完毕自动消失
* beforeSend    : {Function} 请求发送前的钩子函数，@params 为筹备当前请求的xhr对象
* paramsFilter  : {Function} 参数过滤器
* dataPath      : {String} 数据路径
* dataFilter    : {Function} 钩子函数，数据预处理功能，@params 为即将提供给callback(success)的data
* merge         : {Boolean} 合并，同一个接口，相同参数的请求会合并为一个服务器的请求
* queue         : {Boolean} 排队，同一个接口，所有请求的回调会按照请求发起的顺序排队进行
* single        : {Boolean} 单一，同一时间，请求中的接口只有最后一个会生效。即只有最后一个请求会触发回调函数
#### 描述配置项
* name      : {String} 描述接口名称，参考使用
* returns   : {String} 接口成功状态返回数据的参考格式，只是针对数据部分。例如: 返回数据:{ success:true,data:{} } => returns : {} （为data对象）