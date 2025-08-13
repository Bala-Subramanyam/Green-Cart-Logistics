const Routes=require('../models/routeModel');

const getRoutes=async(req,res)=>{
    try{
        const routes=await Routes.find().sort({route_id:1});
        if(!routes||routes.length===0){
            res.status(404).json({message:"there are no routes add a route first"});   
        }
        res.status(200).json(routes);

    }catch(err){
        res.status(500).json({message:"fetching routes not successfull due to server side error"});
    }
}
const getRoute=async(req,res)=>{
    try{
        const {route_id}=req.params;
        const myroute=await Routes.findOne({route_id});
        if(!myroute){
            res.status(404).json({message:"there is no route with this Id"});
        }
        res.status(200).json(myroute);
    }catch(err){
        res.status(500).json({message:"server side error at getRoute"})
    }
}
const createRoute=async(req,res)=>{
    try{
        const {distance_km,traffic_level,base_time_min}=req.body;
        

        const lastRoute=await Routes.findOne().sort({route_id:-1});
        const newRoute_id=lastRoute?lastRoute.route_id+1:1;
       
        const newRoute=await Routes.create({
            route_id:newRoute_id,
            distance_km,
            traffic_level,
            base_time_min
        });
        res.status(201).json({message:"created Successfully",data :newRoute});
    }catch(err){
        res.status(500).json({message:"server side error at createOrder"});
    }
}
const updateRoute=async(req,res)=>{
    try{
        const {route_id}=req.params;
        const updates={...req.body};
        const {__v}=req.body;
        if (__v === undefined || typeof __v !== 'number') {
            return res.status(400).json({
                message: "Version (__v) is missing or invalid. Please include the current version number."
            });
        }
        delete updates.__v;

        const route=await Routes.findOne({route_id});
        if(!route){
            return res.status(404).json({ message: "Route not found" });
        }

        const updatedRoute=await Routes.findOneAndUpdate(
            {route_id,__v},
            {$set:updates , $inc:{__v:1}},
            {new:true,runValidators:true}
        )

        if(!updatedRoute){
            res.status(409).json({message:"this route was update by someone else after you have fetched data so please retry after fetching again"});
        }

        res.status(200).json({message:"updated successfully" , order:updatedRoute});
    }catch(err){
        res.status(500).json({message:"error at server side"});
    }
}

const deleteRoute=async(req,res)=>{
    try{
        const {route_id}=req.params;
        const delRoute=await Routes.findOneAndDelete({route_id});
        if(!delRoute){
            res.status(409).json({message:`route with this id is not there `})
        }
        res.status(200).json({message:"deleted successfully"});
    }catch(err){
        res.status(500).json({message:"server side error in the backend"});
    }
}
module.exports={
    getRoute,
    getRoutes,
    createRoute,
    deleteRoute,
    updateRoute
}