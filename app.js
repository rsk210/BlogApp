var express     = require("express"),
    app         = express(),
    mongoose    =require("mongoose"),
    bodyParser  =require("body-parser")
    methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true,useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default: Date.now}
});

var blog = mongoose.model("blog",blogSchema);

// blog.create({
//     title:"My FIrst Blog",
//     image:"https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=600&q=60",
//     body:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
// });

//RESTFUL Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
});
//Index
app.get("/blogs", function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log("error");
        }else{
            res.render("index",{blogs:blogs});
        }
    });
});
app.get("/blogs/new",function(req,res){
    res.render("new");
});
//CREATE
app.post("/blogs",function(req,res){
    blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
});
//SHOW
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,foundBlogPost){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blogs:foundBlogPost});
        }
    });
});
//EDIT
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }

    });
});
//PUT
app.put("/blogs/:id",function(req,res){
    blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
//DESTROY
app.delete("/blogs/:id",function(req,res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs"); 
        }
    });
});
app.listen(3000,function(){
	console.log("Server has started")
});
