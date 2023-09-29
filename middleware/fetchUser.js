var jwt = require('jsonwebtoken');
const JWT_SCRET="tttuuunnn";
const fetchUser = (req,res,next)=>{
    //get the user from jwt token and id to res body
    const token = req.header("auth-token");
    if(!token){
        res.status(401).json({error:"please authinticate valid token"});
    }
    try {
        const data = jwt.verify(token,JWT_SCRET);
        req.user = data.user;
        next();  
    } catch (error) {
        res.status(401).json({error:"please authinticate valid token"});
    }
    
}




module.exports = fetchUser;