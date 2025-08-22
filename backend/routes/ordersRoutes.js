const express=require('express');
const route=express.Router();
const {getOrders,getOrderByOrderId, createOrder, updateOrder, deleteOrder}=require('../controllers/ordersControllers.js');
const authenticate=require('../middleware/jwt_authentication.js');


route.get('/',authenticate,getOrders);
route.get('/:order_id',authenticate,getOrderByOrderId);
route.post('/create',authenticate,createOrder);
route.put('/update/:order_id',authenticate,updateOrder);
route.delete('/delete/:order_id',authenticate,deleteOrder);

module.exports=route;