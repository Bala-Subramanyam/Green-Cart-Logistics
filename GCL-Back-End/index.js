const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');


//middleware
app.use(express.json());
app.use(cookieParser());


//routes
const authRoute=require('./routes/authRoutes.js');
app.use('/api/auth',authRoute);

const driverRoutes=require('./routes/driversRoutes.js');
app.use('/api/drivers',driverRoutes);

const ordersRoutes=require('./routes/ordersRoutes.js');
app.use('/api/orders',ordersRoutes);

//connection to the database
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("connected to the data base Green-Cart");
    app.listen(3000,()=>console.log('listening to port 3000'));

}).catch((err)=>{if(err) throw err});
