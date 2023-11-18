const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
          users.push({"username":username,"password":password});
          return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
          return res.status(404).json({message: "User already exists!"});    
        }
      } 
      return res.status(404).json({message: "Please provide a valid username and password."});
});

// Task 1
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Task 2
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((result) => {
        res.send(JSON.stringify(result));
    })
    .catch((error) => {
        res.status(404).send("Book could not be found")
    });
 });
  
// Task 3
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
    getBooksByAuthor(author)
    .then((result) => {
        res.send(JSON.stringify(result));
    })
    .catch((error) => {
        res.status(500).send("Internal Server Error.")
    })
});

// Task 4
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    getBooksByTitle(title)
    .then((result) => {
        res.send(JSON.stringify(result));
    })
    .catch((error) => {
        res.status(500).send("Internal Server Error.")
    })
});

// Task 5
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

// Promises

// Task 11
const getBookByISBN = (isnb) => {
    return new Promise((resolve, reject) => {
        const book = books[isnb];
        if (book) 
        {
            resolve(book);
        }
        else
        {
            reject();
        }
    });
};

// Task 12
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let obj = {};
        let arr = [];
        for (let key in books) {
            if (books[key].author == author)
            {
                arr.push(books[key]);
            }
        }
            obj.booksByAuthor = arr;
            resolve(obj);
    });
};

// Task 13
const getBooksByTitle = (title) =>
{
    return new Promise((resolve, reject) => {
        let obj = {};
        let arr = [];

        for (let key in books) {
            if (books[key].title == title)
            {
                arr.push(books[key]);
            }
          }

          obj.booksByTitle = arr;
          resolve(obj);
    });
};


module.exports.general = public_users;
