const mongoose=require('mongoose');

const DriversSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    shift_hours:{
        type:Number,
        required:true
    },
    past_week_hours:{
        type:String,
        required:true
    }
},{
    timestamps:true
});
const Driver=mongoose.model('driver',DriversSchema,'drivers');
module.exports=Driver;