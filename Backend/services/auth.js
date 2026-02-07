require("dotenv").config()
const jwt = require("jsonwebtoken")
const secret = process.env.key

function setTokenForUser(user) {
    const playload = {
        _id: user._id || user.id,
        name:user.name,
        email: user.email
    }
     return jwt.sign(playload,secret,{expiresIn:"1d"})
}

function verifyToken(token){
    return jwt.verify(token,secret)
}

module.exports = { setTokenForUser,verifyToken }