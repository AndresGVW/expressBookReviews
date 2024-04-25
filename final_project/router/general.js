const express = require("express")
let books = require("./booksdb.js")
const booksObj = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()

// Function to check if a username exists
const usernameExists = (username) => {
  return users.some((user) => user.username === username)
}

/*
router.post("/", (req, res) => {
  users.push({ firstName: req.query.firstName, lastName: req.query.lastName, email: req.query.email, DOB: req.query.DOB })
  res.send("The user" + " " + req.query.firstName + " Has been added!")
})
*/

public_users.post("/register", async (req, res) => {
  //const { username, password } = req.body
  const username = req.body.username
  const password = req.body.password

  /*
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Both username and password are fields required" })
  }

  // Check if the username already exists
  if (usernameExists(username)) {
    return res.status(409).json({ message: "Username already exists" })
  }
*/
  users.push({ username: req.query.username, password: req.query.password })
  res.send("The user" + " " + req.query.username + " Has been added!")
  /*
  // Hash the password
  try {
    const salt = await bcrypt.genSalt(10) // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt) // Hash the password with the salt

    // Store the new user
    users.push({
      username: username,
      password: hashedPassword,
    })

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ message: "Error registering user" })
  }
  */
})

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  //res.send(books)
  res.send(users)
  //return res.status(300).json({message: "Yet to be implemented"});
})

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Convert object to an array of book objects
  const booksArray = Object.values(booksObj)

  // Correctly capture the isbn parameter from the request
  const isbn = req.params.isbn

  // Filter books by isbn, ensure your book objects have an 'isbn' property
  let filtered_books = booksArray.filter((book) => book.isbn === isbn)

  // Check if any books were found and respond accordingly
  if (filtered_books.length > 0) {
    res.send(filtered_books)
  } else {
    res.status(404).json({ message: "No books found by the given ISBN" })
  }
})

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Convert the object to an array of book objects
  const booksArray = Object.values(booksObj) // Changed variable name to booksArray

  const author = req.params.author
  let filtered_books = booksArray.filter((book) => book.author === author)
  if (filtered_books.length > 0) {
    res.send(filtered_books)
  } else {
    res.status(404).json({ message: "No books found by the given author" })
  }
})

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const booksArray = Object.values(booksObj) // Convert the object to an array of book objects

  const title = req.params.title
  let filtered_books = booksArray.filter((book) => book.title === title)
  if (filtered_books.length > 0) {
    res.send(filtered_books)
  } else {
    res.status(404).json({ message: "No books found by the given title" })
  }
})

//  Get book review
// Get book reviews based on ISBN
public_users.get("/review/:isbn", function (req, res) {
  // Convert the books object to an array of book objects
  const booksArray = Object.values(booksObj)

  // Capture the isbn parameter from the request
  const isbn = req.params.isbn

  // Find the book by ISBN
  const book = booksArray.find((book) => book.isbn === isbn)

  // Check if the book was found and has reviews
  if (book && book.reviews) {
    res.send(book.reviews)
  } else if (book && !book.reviews) {
    res.status(404).json({ message: "No reviews available for this book" })
  } else {
    res.status(404).json({ message: "No book reviews found with the given ISBN" })
  }
})

module.exports.general = public_users
