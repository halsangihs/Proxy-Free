const {verifyToken}= require("../services/auth")

function checkAuth(req,res,next){
   const token = req.cookies.token;
    if(!token) return res.redirect("/user/login")
    
    const user= verifyToken(token)
    if(user)req.user= user
    next()
}

module.exports={checkAuth}