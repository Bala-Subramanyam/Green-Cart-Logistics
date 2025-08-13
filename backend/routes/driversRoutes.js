const express=require('express');
const route=express.Router();
const {getDrivers,createDriver,updateDriver,findDriver, deleteDriver}=require('../controllers/driversControllers.js')
const authenticate=require('../middleware/jwt_authentication.js');



route.get('/',authenticate,getDrivers);
route.get('/:name',authenticate,findDriver)
route.post('/create',authenticate,createDriver);
route.put('/update/:name',authenticate,updateDriver);
route.delete('/delete/:name',authenticate,deleteDriver);

module.exports=route;