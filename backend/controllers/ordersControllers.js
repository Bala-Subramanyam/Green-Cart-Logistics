const Order=require('../models/orderModel.js');


const getOrders=async(req,res)=>{
    try{
        const orders=await Order.find().sort({order_id:1});
        if(!orders||orders.length===0){
            res.status(404).json({message:"there are no orders add an order first"});   
        }
        res.status(200).json(orders);

    }catch(err){
        res.status(500).json({message:"fetching orders not successfull due to server side error"});
    }
}
const getOrderByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const myorder = await Order.findOne({ order_id: Number(order_id) });
    if (!myorder) {
      return res.status(404).json({ message: "there is no order with this order_id" });
    }
    res.status(200).json(myorder);
  } catch (err) {
    res.status(500).json({ message: "server side error at getOrderByOrderId" });
  }
};
const createOrder=async(req,res)=>{
    try{
        const {value_rs,route_id,delivery_time}=req.body;
        
        const lastOrder=await Order.findOne().sort({order_id:-1});
        const newOrder_id=lastOrder?lastOrder.order_id+1:1;
        const newOrder=await Order.create({
            order_id:newOrder_id,
            value_rs,
            route_id,
            delivery_time
        });
        res.status(201).json({message:"created Successfully",data :newOrder});
    }catch(err){
       console.log(err);
        res.status(500).json({message:"server side error at createOrder"});
    }
}
const updateOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const updates = { ...req.body };
    const { __v } = req.body;

    if (__v === undefined || typeof __v !== 'number') {
      return res.status(400).json({
        message: "Version (__v) is missing or invalid. Please include the current version number."
      });
    }
    delete updates.__v;

    const order = await Order.findOne({ order_id: Number(order_id) });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { order_id: Number(order_id), __v },
      { $set: updates, $inc: { __v: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(409).json({ message: "Concurrent update conflict. Please retry." });
    }

    res.status(200).json({ message: "updated successfully", order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "error at server side" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const delorder = await Order.findOneAndDelete({ order_id: Number(order_id) });
    if (!delorder) {
      return res.status(404).json({ message: `order with id ${order_id} is not there` });
    }
    res.status(200).json({ message: "deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "server side error in the backend" });
  }
};

module.exports={
    getOrders,
    getOrderByOrderId,
    createOrder,
    updateOrder,
    deleteOrder
}