const express=require('express');
const route=express.Router();
const {registerAccount,loginAccount} = require('../controllers/authControllers.js');


route.post('/register',registerAccount);
route.post('/login',loginAccount);

module.exports=route;