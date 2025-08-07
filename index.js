const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee" },
  { id: 2, title: "1984", author: "George Orwell" },
  { id: 3, title: "Pride and Prejudice", author: "Jane Austen" }
];


const findBookById = (id) => {
  return books.find(book => book.id === parseInt(id));
};


const generateNewId = () => {
  return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
};


app.get('/books', (req, res) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books
  });
});


app.get('/books/:id', (req, res) => {
  const book = findBookById(req.params.id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: book
  });
});


app.post('/books', (req, res) => {
  const { title, author } = req.body;
  

  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both title and author'
    });
  }
  

  const newBook = {
    id: generateNewId(),
    title: title.trim(),
    author: author.trim()
  };
  
  books.push(newBook);
  
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});


app.put('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const { title, author } = req.body;
  
 
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both title and author'
    });
  }
  

  books[bookIndex] = {
    id: parseInt(req.params.id),
    title: title.trim(),
    author: author.trim()
  };
  
  res.status(200).json({
    success: true,
    message: 'Book updated successfully',
    data: books[bookIndex]
  });
});


app.delete('/books/:id', (req, res) => {
  const bookIndex = books.findIndex(book => book.id === parseInt(req.params.id));
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Book not found'
    });
  }
  
  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


app.listen(PORT, () => {
  console.log(`📚 Books API Server is running on http://localhost:${PORT}`);
  console.log(`📖 Available endpoints:`);
  console.log(`   GET    /books     - Get all books`);
  console.log(`   GET    /books/:id - Get book by ID`);
  console.log(`   POST   /books     - Add new book`);
  console.log(`   PUT    /books/:id - Update book by ID`);
  console.log(`   DELETE /books/:id - Delete book by ID`);
});

module.exports = app;
