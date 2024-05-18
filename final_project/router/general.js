const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.name;
  const password = req.body.password;
  const user = {"username":username,"password":password}
  if(username && password){
      users.push(user)
      return res.json({message: "user " + user.username +  " successfully added!"})
  }
  return res.status(400).json({message: "Error registering user, please provide required info"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  const isbn = req.params.isbn
  let book = books[isbn]
  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
  const author = req.params.author;
  const authorsbook = []

    for(i = 1; i<=10;i++ ){
        const book = books[i]
        if(book.author === author){
          authorsbook.push(book)
        }
         
    }


  return res.status(200).json(authorsbook);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
  const title = req.params.title;
  const booktitles = []

  for(i = 1; i<=10;i++ ){
    const b = books[i]
    if(b.title === title){
      booktitles.push(b)
    }
     
}


  return res.status(200).json(booktitles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;
  return res.status(200).json(review);

});

//Using Axios for api calls
const  getAllBooks = async () =>{
    const books = await axios.get('http://localhost:5000/')
    .then((res)=>{
    const data = res.data;
    console.log(data)
    })
    .catch((err)=>{console.log(err)})

    return books;
}

  const  getBook = async (isbn) =>{
  const book = await axios.get(`http://localhost:5000/isbn/${isbn}`)
  .then(async (res)=>{
  const data = await res.data;
  console.log(data)
  })
  .catch((err)=>{console.log(err)})
  
  return book
}

const  getAuthorBooks = async (author) =>{
  const books = await axios.get(`http://localhost:5000/author/${author}`)
  .then((res)=>{
  const data = res.data;
  console.log(data)
  })
  .catch((err)=>{console.log(err)})

  return books
}

const getBookbyTitle =async (title) =>{
  const books = await axios.get(`http://localhost:5000/title/${title}`)
  .then((res)=>{
  const data = res.data;
  console.log(data)
  })
  .catch((err)=>{console.log(err)})

  return books;
}

module.exports.getBook = getBook;
module.exports.getAllBooks = getAllBooks;
module.exports.getAuthorBooks = getAuthorBooks;
module.exports.getBookbyTitle = getBookbyTitle;

module.exports.general = public_users;

