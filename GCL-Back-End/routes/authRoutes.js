const express=require('express');
const route=express.Router();
const {registerAccount,loginAccount} = require('../controllers/authControllers.js');


route.post('/auth/register',registerAccount);
route.post('/auth/login',loginAccount);

module.exports=route;