class Interface {
    constructor(obj){
        this.obj = obj;
    }
}

class Action{}
class Filter{}
class EditFilter extends Filter{}
class SubmitFilter extends Filter{}
class DeleteFilter extends Filter{}

class PageFilter extends Filter{}
class SelectFilter extends Filter{}

class StringFilter extends Filter{}
class NumberFilter extends Filter{}
class StringLengthFilter extends StringFilter{}

class ObjectArray{}

const PriceNumberFilter = new NumberFilter(0,999999999);

const GoodsType = new InterfaceProxy({
    id:[,String,"类型ID"],
    name:[,String,"类型名"]
});
const Goods = new Interface({
    id:[,String,"商品ID"],
    name:[,String,"名称",StringLengthFilter(0,256)],
    price:[,Number,"价格",PriceNumberFilter],
    description:[,String,"描述",StringLengthFilter(0,2048)],
    type:[,String,"类型",SelectFilter("getGoodsTypes")]
});
const iProxy = new InterfaceProxy([{
    method:"getGoodsList",
    pathname:"api/goods/list",
    params:{
        key:[,String,"关键字"] ,
        maxPrice:[,Number,"",PriceNumberFilter],
        minPrice:[,String,"",PriceNumberFilter]
    },
    returns:[,ObjectArray(Goods),"商品信息列表",PageFilter]
},{
    method:"addGoods",
    pathname:"api/goods/add",
    params:[,Goods,"商品添加信息",SumitFilter]
},{
    method:"editData",
    pathname:"api/goods/edit",
    params:[,Goods,"商品编辑信息",,EditFilter]
},{
    method:"deleteData",
    pathname:"api/goods/delete",
    params:[,Goods,"商品删除信息",,DeleteFilter]
},{
    method:"getGoodsTypes",
    pathname:"api/goodsType/list",
    params:[,ObjectArray(GoodsType),]
}],{});

// 0.5 目标功能
// 自动生成
// - 检索条
// - 数据表格
// - 数据表格分页
// - 简单记录提交
// - 简单记录删除
// - 简单记录修改
// - 简单表单验证

// 1.0 目标功能
// 自动生成
// - 嵌套表单