const express=require('express');
const route=express.Router();
const {registerAccount,loginAccount,logoutAccount} = require('../controllers/authControllers.js');
const authenticate=require('../middleware/jwt_authentication.js')


route.post('/register',registerAccount);
route.post('/login',loginAccount);
route.post('/logout',authenticate,logoutAccount);
route.get('/me',authenticate,(req,res)=>{
    username=req.user.username;
    res.json({value:true,user:username});
});


module.exports=route;