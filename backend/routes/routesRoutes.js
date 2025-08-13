const express=require('express');
const route=express.Router();
const {getRoutes,getRoute,createRoute,deleteRoute,updateRoute}=require('../controllers/routesControllers.js');


route.get('/',getRoutes);
route.get('/:route_id',getRoute);
route.post('/create',createRoute);
route.put('/update/:route_id',updateRoute);
route.delete('/delete/:route_id',deleteRoute);


module.exports=route;