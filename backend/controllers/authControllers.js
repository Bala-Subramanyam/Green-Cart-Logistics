const User=require('../models/userModel.js');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const registerAccount=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const userExists=await User.findOne({username});
        if(userExists){
            return res.status(402).json({message:"username already exists choose another name"});
        }

        const unique=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,unique);

        const newUser=new User({
            username,
            password:hashedPassword
        });
        await newUser.save();
        res.status(201).json({message:"registered successfully"});

    }catch(err){
        res.status(401).json({message:"couldn't Register account due to server side error"});
    }
}

const loginAccount=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(404).json({message:"userDoesnot exist recheck the credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(405).json({message:"wrong password"});
        }

        const access_token=jwt.sign(
            {username:user.username},
            process.env.ACCESS_SECRET_KEY,
            {expiresIn:'1h'}
        )
        res.cookie('access_token',access_token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:'strict',
            maxAge:60*60*1000
        })

        res.status(202).json({message:"logged in successfully"});

    }catch(err){
        res.status(403).json({message:"couldn't login due to server side error"})
    }
}

module.exports={
    loginAccount,
    registerAccount
}