const express = require("express")
const User =require("../model/user")
const {sendWelcomeEmail}=require("../services/welcomeMail")
const {sendLoginOTP}=require("../services/otpMail")
const {setTokenForUser}= require("../services/auth")
const bcrypt=require("bcrypt")
const router=express.Router();

router.get("/signup",(req,res)=>{
    res.render("signup")
})

router.post("/signup",async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const hashpassword =await bcrypt.hash(password,10)
        await User.create({
            name,
            email,
            password:hashpassword
        })
        sendWelcomeEmail(name,email)
        res.status(201).json({ success: true, message: "Account created successfully" })
    } catch (error) {
        res.status(400).json({ error: "Failed to create account" })
    }
})


router.get("/login",(req,res)=>{
    res.render("login")
})

function otp(){
   let s=""
   let n=6
   while(n--){
    s+=Math.floor(Math.random()*10)
   }
  return s
}

router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body
        const user = await User.findOne({email})
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const name= user.name
        const hashedPassword=user.password
        const k= await bcrypt.compare(password,hashedPassword)

        if(!k){
            return res.status(401).json({ error: "Invalid credentials" })
        }

        const OTP=otp()
        req.session.otp=OTP
        req.session.user=user
        sendLoginOTP(name,email,OTP)
        res.json({ success: true, message: "OTP sent to your email" })
    } catch (error) {
        res.status(500).json({ error: "Login failed" })
    }
})

router.post("/verify_otp",(req,res)=>{
    try {
        const {userOTP}= req.body
        const user=req.session.user
        
        if (!user || !req.session.otp) {
            return res.status(401).json({ error: "Session expired" })
        }

        if(userOTP == req.session.otp){
            const token= setTokenForUser(user)
            res.cookie("token",token)
            return res.json({ success: true, message: "Verified successfully" })
        }
        return res.status(401).json({ error: "Invalid OTP" })
    } catch (error) {
        res.status(500).json({ error: "Verification failed" })
    }
})


module.exports =router