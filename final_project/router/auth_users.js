const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {

  let user =  users.filter(user => {return user.username === username });
  if(user.length > 0){
    return true
  }

  return false
}

const authenticatedUser = (username, password) => {
    let user =  users.filter(user => {return user.username === username && user.password === password });
    
    if(user.length > 0){
      return true
    }

    return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 
  const username = req.body.username;
  const password = req.body.password;
  if(!isValid(username)){
    return res.status(400).json({message:"Invalid username"});
  }

  if(!authenticatedUser(username,password)){
    return res.status(401).json({ message: "Invalid password" }); 
  }


  let accessToken = jwt.sign({
    data: password
  }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken,username
}

  return res.status(200).json({message:"Logged in Successfull",username})

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.body.reviews
  const isbn = req.params.isbn
  const {username} = req.session.authorization
  
  if(!username){
    return res.status(400).json({message:"Invalid username"});
  }
  // If the user has already posted a review, update it
  books[isbn]["reviews"][username] = review;
   
  
  return res.status(200).json({ message: "Review added successfully " , review: books[isbn]["reviews"] });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Delete book review of a user
  const isbn = req.params.isbn
  const {username} = req.session.authorization
  if(!username){
    return res.status(400).json({message:"Invalid username"});
  }
  // If the user has already posted a review, update it
  delete books[isbn]["reviews"][username]
  return res.status(200).json({ message: "Review deleted successfully " , review: books[isbn]["reviews"] });

}
);
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
