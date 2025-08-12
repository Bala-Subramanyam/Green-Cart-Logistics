const jwt =require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    const token=req.cookies.access_token;

    if(!token){
        return res.status(406).json({message:"no token so log in again "});
    }
    try{
        const decoded=jwt.verify(token,process.env.ACCESS_SECRET_KEY);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(407).json({message:"error at the jwt verification"});
    }
}