require("dotenv").config();
const express = require("express")
const path =require("path")
const cors = require('cors');

const session = require("express-session")
const cookieParser = require("cookie-parser")

const {connection}= require("./connection")

const userRouter = require("./routes/user")
const {checkAuth} = require("./middlewares/checkAuth")

connection(process.env.mongo_URL)
.then(()=>console.log("mongoDB connected successfully"))
.catch((err)=>console.log("error",err))

const app=express()
const port=process.env.PORT

app.set("view engine","ejs")
app.set("views",path.resolve("./views"));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}))

app.get("/api",(req,res)=>{
    res.json("kay be kay chalay") 
})

app.use("/user",userRouter)
app.get("/home",checkAuth,(req,res)=>{
     res.send("heyy boyyy")
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})