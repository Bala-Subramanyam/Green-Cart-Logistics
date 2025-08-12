const express=require('express');
const route=express.Router();
const {getOrders,getOrder, createOrder, updateOrder, deleteOrder}=require('../controllers/ordersControllers.js');
const authenticate=require('../middleware/jwt_authentication.js');


route.get('/',getOrders);
route.get('/:_id',getOrder);
route.post('/create',createOrder);
route.put('/update/:_id',updateOrder);
route.delete('/delete/:_id',deleteOrder);

module.exports=route;