require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to My Daily Journal! Embrace the art of introspection and self-expression with My Daily Journal. This space is yours to share thoughts, experiences, and reflections. Capture the essence of your day and let the pages of your digital journal unfold a narrative unique to you. Whether it's a profound realization, a simple joy, or a significant milestone, every entry contributes to the story of your life. Take a moment to explore the depths of your thoughts and celebrate the beauty of your journey. Feel free to add a new post, pour your heart into the words, and let your daily musings become a chronicle of your growth and discovery. Happy journaling!";
const aboutContent = "Abdur Rafay - Full Stack Developer Greetings! I'm Abdur Rafay, a passionate and results-driven Full Stack Developer dedicated to creating innovative and efficient software solutions. With a strong foundation in both front-end and back-end development, I thrive in turning ideas into functional, user-friendly applications.";
const contactContent = "I'm excited to connect with you. Whether you have questions, suggestions, or just want to say hello, I'm here to listen. Feel free connect with me through the provided social media links. Email: abdurrafay0123@gmail.com , GitHub: https://github.com/Abdur777 , linkedin: https://www.linkedin.com/in/abdur-rafay-505530237/";
const id = process.env.id;
const password = process.env.password;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
var _ = require('lodash');

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${id}:${password}@cluster0.mlwl1tu.mongodb.net/?retryWrites=true&w=majority`);

const postsSchema = new mongoose.Schema({
  name: String,
  content: String,
});

const Post = mongoose.model("Post",postsSchema);

app.get('/', function(req,res){
  Post.find({},function(err,foundItems){
    
      res.render("home",{homeStartingContent: homeStartingContent,posts:foundItems});
    
  });
});

app.get('/home', function(req,res){
  Post.find({},function(err,foundItems){
    if(err){
      console.log(err);
    }else{
      res.render("home",{homeStartingContent: homeStartingContent,posts:foundItems});
    }
  });
});

app.get('/about', function(req,res){
  res.render("about",{aboutContent: aboutContent});
});

app.get('/contact', function(req,res){
  res.render("contact",{contactContent: contactContent});
});

app.get('/compose', function(req,res){
  res.render("compose");
});

app.post('/compose',function(req,res){
  const title = req.body.postTitle
  const content = req.body.postBody;
  const post = new Post ({
    name: title,
    content: content
});
post.save(function(err){

  if (!err){

    res.redirect("/");

  }

});
});

app.get('/posts/:topic', function(req,res){
  
  Post.findOne({ _id: req.params.topic }, function (err, foundItem) {
    res.render("post",{title: foundItem.name,content:foundItem.content});
  });

});

app.post('/delete/:postId', function(req, res) {
  const postId = req.params.postId;
  Post.findByIdAndRemove(postId, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
