const mongoose=require('mongoose');

const routesSchema=mongoose.Schema({
    route_id:{
        type:Number,
        required:true,
        unique:true
    },
    distance_km:{
        type:Number,
        required:true
    },
    traffic_level:{
        type:String,
        required:true
    },
    base_time_min:{
        type:Number,
        required:true
    }
},{
    timestamps:true
});
const Routes=mongoose.model('route',routesSchema,'routes');
module.exports=Routes;