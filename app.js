//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash'); 
const mongoose = require('mongoose');
const ps=require(__dirname +"/secrets.js"); 

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// "mongodb://localhost:27017/ISM-blogDB"

mongoose.connect( "mongodb+srv://Sandeep:" + ps.getkey() + "@ism-blog.44iag.mongodb.net/ISM-blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postsSchema=new mongoose.Schema({
 title : String,
 des : String
})
const post= mongoose.model("post",postsSchema); // new collection




// all get requests
app.get("/",function(req,res)
{
    post.find(function(err,posts)
    {
        res.render('home',{posts : posts});      
    })
  
})

app.get("/About",function(req,res)
{
  res.render("about",{});
})

app.get("/compose",function(req,res)
{
    res.render("compose",{});
})

// post requests.
app.post("/compose",function(req,res)
{
    const bolgpost=new post({
      title : req.body.title,
      des   : req.body.description,
    })
    bolgpost.save();
    res.redirect("/");
})

// get requests to specific blog
app.get("/:topic",function(req,res)
{
  const reqtitle=_.lowerCase(req.params.topic);
  post.find(function(err,posts)
  {
    posts.forEach(function(element)
    {
        const currTitle=_.lowerCase(element.title);
        if(currTitle == reqtitle)
        {
          res.render('post',{title : element.title,content : element.des });
        }
    })
  })
  
})

// process.env.PORT
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
