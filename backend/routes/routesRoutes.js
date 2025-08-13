const express=require('express');
const route=express.Router();
const {getRoutes,getRoute,createRoute,deleteRoute,updateRoute}=require('../controllers/routesControllers.js');
const authenticate=require('../middleware/jwt_authentication.js');

route.get('/',authenticate,getRoutes);
route.get('/:route_id',authenticate,getRoute);
route.post('/create',authenticate,createRoute);
route.put('/update/:route_id',authenticate,updateRoute);
route.delete('/delete/:route_id',authenticate,deleteRoute);


module.exports=route;