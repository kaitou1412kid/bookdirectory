const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//connect to database
mongoose.connect("mongodb://localhost:27017/booksDB", {useNewUrlParser:true});

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


app.route("/books/:bookid").get(function(req, res){
    Book.findOne(
        {isbn : req.params.bookid},
        function(err, foundBook){
            if(foundBook){
                res.send(foundBook);
            }else {
                res.send("No book found");
            }
        }
    )
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
                newBook.save(function(err){
                    if(!err){
                        res.send("New book saved succesfully")
                    } else {
                        res.send(err);
                    }
                });
            }else {
                res.send("Book is already in the system.")
            }
        }else {
            res.send(err);
        }
    })
    
});

app.route("/books/:bookid").put(function(req, res){
    Book.replaceOne(
        {isbn : req.params.bookid},
        {title : req.body.title,
        author : req.body.author,
        isbn : req.body.isbn},
        {overwrite : true},
        function(err){
            if(!err){
                res.send("Successfully Updated");
            }
        }
    )
});


app.route("/books/:bookid").delete(function(req, res){
    Book.deleteOne(
        {isbn : req.params.bookid},
        function(err){
            if(!err){
                res.send("Book deleted succesfully");
            } else {
                res.send(err);
            }
        }
    )
});


app.listen(3000, function(){
    console.log("Server is running on port 3000");
});