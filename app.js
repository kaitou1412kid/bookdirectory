require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//let port = process.env.PORT;
const pass = process.env.PASSWORD;
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connect to database
mongoose.connect("mongodb+srv://admin-kritagya:"+pass+"@cluster1.bjcgamc.mongodb.net/booksDB", {useNewUrlParser:true});

//create book schema 
const bookSchema = {
    title : String,
    author : String,
    isbn : String
};

//create model for the book
const Book = mongoose.model("Book", bookSchema);


//get the home file
app.get("/home",function(req, res){
    Book.find({},function(err,foundBook){
        if(err){
            console.log(err);
        }else {
            res.render("home", {newBookItem : foundBook});
        }
    })
    // res.render("home");
});

//search for books from the database
app.post("/home",function(req,res){
    const searched = req.body.searchISBN;
    Book.findOne({isbn : searched},function(err, foundBook){
        if(!err){
            if(!foundBook){
                res.render("notFound", {search : searched});
            }else {
                res.render("search", {newBookItem: foundBook});
            }   
        }else {
            res.send(err);
        }
    }); 
});

//get the add fle
app.get("/add",function(req, res){
    res.render("add")
});

//add books into the database
app.post("/add",function(req, res){
    const newBook = new Book({
        title : req.body.bookName,
        author : req.body.authorName,
        isbn : req.body.isbnBook
    });

    Book.findOne({isbn : newBook.isbn}, function(err,foundBook){
        if(!err){
            if(!foundBook){
                if(newBook.title == "" || newBook.author == "" || newBook.isbn == ""){
                    res.redirect("/home");
                }
                else {
                newBook.save(function(err){
                    if(!err){
                        res.redirect("/home");
                    } else {
                        res.send(err);
                    }
                });
            }
            }else {
                res.redirect("/home");
            }
        }else {
            res.send(err);
        }
    })
    
});

// if(port == null || port == ""){
//     port = 3000;
// }

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running succesfully");
});