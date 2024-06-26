const express = require("express")
const jwt = require("jsonwebtoken")
let books = require("./booksdb.js")
const regd_users = express.Router()
const jwtSecretKey = "fingerprint_customer" // Use a secure and environment-specific key;
const app = express()
app.use(express.json())

//let users = []
let users = [{ username: "andres1", password: "password1" }]

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return users.some((user) => user.username === username)
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some((user) => user.username === username && user.password === password)
}

//only registered users can login

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }
  if (!isValid(username)) {
    return res.status(401).json({ message: "Invalid credentials" })
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" })
  res.json({ message: "Logged in successfully", token })
})

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" })
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" })
  }
  users.push({ username, password })
  res.status(201).json({ message: "User registered successfully" })
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.body.review
  const username = req.session.authorization.username
  //console.log("add review: ", req.params, req.body, req.session);
  if (books[isbn]) {
    let book = books[isbn]
    book.reviews[username] = review
    return res.status(200).send("Review posted successfully")
  } else {
    return res.status(404).json({ message: "ISBN ${isbn} not found" })
  }
})

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  if (books[isbn]) {
    let book = books[isbn]
    delete book.reviews[username]
    return res.status(200).send("Review deleted successfully")
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` })
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
