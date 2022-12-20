require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect('mongodb://127.0.0.1:27017/userDB',{useNewUrlParser:true},(err)=>{
    if(!err){
         console.log('conneted to mongoDB');
    }else{
        console.log('err connecting', err);
    }
});

const userSchema = new mongoose.Schema( {
   email:String,
   password:String
});


const User = new mongoose.model("User",userSchema);


app.get('/',(req,res)=>{
   res.render("home")
})

app.get('/register',(req,res)=>{
  res.render("register");
})


app.get('/login',(req,res)=>{
  res.render("login")
});

app.post('/register',(req,res)=>{
    const newUser = new User({
      email:req.body.username,
      password:md5(req.body.password)
    });

    newUser.save((err)=>{
      if(!err){
        res.render("secrets");
      }else{
        console.log(err);
      }
    })

})

app.post("/login",(req,res)=>{
    const userName = req.body.username;
    const password = md5(req.body.password);
    
    User.findOne({email:userName},(err,foundUser)=>{
         if(!err){
             if(foundUser){
                 if(foundUser.password === password){
                  res.render("secrets");
                 }
             }
         }else{
          console.log(err);
         }
    })
})


app.listen(3000,()=>{
  console.log('server is running on port 3000');
})

