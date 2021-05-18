const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to mongoDB server
mongoose.connect('mongodb+srv://<userName>:<password>@<clusterName>.uej7s.mongodb.net/blogDB',{useNewUrlParser: true, useUnifiedTopology: true});

//creating Schema
const blogSchema = new mongoose.Schema({
  title: String,
  post : String
});

const Blog = new mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
  Blog.find({}, function(err, blogsData){
    if(err){
      console.log(err);
    } else{
      res.render("home",  {homeContent : homeStartingContent, blogs: blogsData, lodash: _})
    }
  })
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");
})
app.post("/compose", function(req, res){
  const composeTitle = req.body.composeTitle;
  const composePost = req.body.composePost;

  const newBlog = new Blog({
    title : composeTitle,
    post : composePost
  });

  newBlog.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.redirect("/")
    }
  })
})

app.get("/:title", function(req, res){
  let title = _.kebabCase(req.params.title);

  Blog.find({}, function(err, blogsData){
    if(err){
      console.log(err);
    } else{
      blogsData.forEach(function(blog){
        if(_.kebabCase(blog.title) === title){
          res.render("post", {title: blog.title, post: blog.post});
        }
      })
    }
  })
})



// setting port

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port : "+ port);
});
