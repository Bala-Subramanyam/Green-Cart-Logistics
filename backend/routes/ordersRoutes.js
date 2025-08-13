const express=require('express');
const route=express.Router();
const {getOrders,getOrder, createOrder, updateOrder, deleteOrder}=require('../controllers/ordersControllers.js');
const authenticate=require('../middleware/jwt_authentication.js');


route.get('/',authenticate,getOrders);
route.get('/:_id',authenticate,getOrder);
route.post('/create',authenticate,createOrder);
route.put('/update/:_id',authenticate,updateOrder);
route.delete('/delete/:_id',authenticate,deleteOrder);

module.exports=route;