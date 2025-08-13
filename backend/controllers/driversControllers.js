const Driver=require('../models/driverModel');

const getDrivers=async(req,res)=>{
    try{

        const data=await Driver.find();
        if(!data||data.length===0){
            return res.status(411).json({message:"empty collection please add a new driver before fetching"})
        }
        res.status(200).json(data);
    }catch(err){
        return res.status(410).json({message:"server side error getting drivers data from database "});
    }
}

const findDriver=async(req,res)=>{
    try{
        const {name}=req.params;
        const driver=await Driver.findOne({name});

        if(!driver){
            return res.status(404).json({message:"driver with this name not found"});

        }
        res.status(200).json({message:"driver found",driver});
    }catch(err){
        res.status(500).json({message:"error at server side finding driver"});
    }
}
const createDriver=async(req,res)=>{
    try{
        const {name,shift_hours,past_week_hours}=req.body;
        const userExists=await Driver.findOne({name});
        if(userExists){
            return res.status(409).json({message:"username already exists so change the name and try again"});
        }
        const newDriver=new Driver({
            name,
            shift_hours,
            past_week_hours
        });
        await newDriver.save();

        res.status(201).json({message:"created a new driver successfully"});

    }catch(err){
        return res.status(500).json({message:"server side error to create a new driver"});
    }
}
const updateDriver=async(req,res)=>{
    try{
        const {name}=req.params;
        const updateData={...req.body};
        const {__v} = req.body;

        if (__v === undefined || typeof __v !== 'number') {
            return res.status(400).json({
                message: "Version (__v) is missing or invalid. Please include the current version number."
            });
        }


        delete updateData.__v;

        const driver = await Driver.findOne({ name });
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        const updatedDriver=await Driver.findOneAndUpdate(
            {name,__v},
            {$set:updateData , $inc:{__v:1}},
            {new:true,runValidators:true}
        )
        
        if(!updatedDriver){
            return res.status(404).json({message:"Driver was updated by someone else please re-fetch the data and try again"})
        }

        
        
        res.status(200).json({message:"driver updated successfully" , driver:updatedDriver});

    }catch(err){
        console.error("❌ Error updating driver:", err);
        return res.status(500).json({message:"server side error to update the driver info"});
    }
}

const deleteDriver=async(req,res)=>{
    try{
        const {name}=req.params;
        const driver=await Driver.findOneAndDelete({name});
        if(!driver){
            return res.status(404).json({message:"driver with this name is not found"})
        }
        res.status(200).json({message:`driver ${driver.name}  deleted successfully `})
    }catch(err){
        return res.status(500).json({message:"error at server side deleting the driver"});
    }
}

module.exports={
    getDrivers,
    createDriver,
    updateDriver,
    findDriver,
    deleteDriver
}