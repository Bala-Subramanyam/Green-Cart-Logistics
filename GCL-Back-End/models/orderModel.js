const mongoose=require('mongoose');

const OrderSchema=mongoose.Schema({
    order_id:{
        type:Number,
        required:true
    },
    value_rs:{
        type:Number,
        required:true
    },
    route_id:{
        type:Number,
        required:true
    },
    delivery_time:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const Order=mongoose.model('order',OrderSchema,'orders');
module.exports=Order