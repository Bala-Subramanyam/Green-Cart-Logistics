const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const cors=require('cors'); 

//middleware
app.use(express.json());
app.use(cookieParser());

//to listen from the front-end 
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

//routes
const authRoute=require('./routes/authRoutes.js');
app.use('/api/auth',authRoute);

const driverRoutes=require('./routes/driversRoutes.js');
app.use('/api/drivers',driverRoutes);

const ordersRoutes=require('./routes/ordersRoutes.js');
app.use('/api/orders',ordersRoutes);

const routesRoutes=require('./routes/routesRoutes.js');
app.use('/api/routes',routesRoutes);

const simulationRoutes=require('./routes/simulationRoutes.js');
app.use('/api/simulation',simulationRoutes);

//connection to the database
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("connected to the data base Green-Cart");
    app.listen(3000,()=>console.log('listening to port 3000'));

}).catch((err)=>{if(err) throw err});
