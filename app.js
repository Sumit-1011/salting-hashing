//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds= 10;

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
 
const User = mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", async function(req,res){
    try{
        bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            const saved = await newUser.save();
            if(saved){
                res.render("secrets");
            }else{
                console.log("problems there" + err);
            }
        });
    }catch(err){
        console.log(err);
    }
});

app.post("/login", async function(req, res){
    try{
        const username = req.body.username;
        const password = req.body.password;
        
        const query = await User.findOne({email: username});
        bcrypt.compare(password, query.password).then(function(result) {
            if(result === true){
                res.render("secrets");
            }else{
                console.log("jhutha password daala hai wo");
                res.redirect("/");
            }
        });
    }catch(err){
        console.log(err);
    }
});


app.listen(3000, function(){
    console.log("server started on port 3000.")
});