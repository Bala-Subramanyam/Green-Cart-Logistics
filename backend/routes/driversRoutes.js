const express=require('express');
const route=express.Router();
const {getDrivers,createDriver,updateDriver,findDriver, deleteDriver}=require('../controllers/driversControllers.js')




route.get('/',getDrivers);
route.get('/:name',findDriver)
route.post('/create',createDriver);
route.put('/update/:name',updateDriver);
route.delete('/delete/:name',deleteDriver);

module.exports=route;