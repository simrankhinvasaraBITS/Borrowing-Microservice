const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Borrowing = require('./models/Borrowing');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables


const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('MongoDB connection error:', error));

// Basic Health Check
app.get('/', (req, res) => {
  res.send('Borrowing Microservice is up and running!');
});

// Define Borrowing Routes
// Borrow a book
app.post('/borrow', async (req, res) => {
    try {
      const { bookId, userId, dueDate } = req.body;
  
      // Ensure all required fields are provided
      if (!bookId || !userId || !dueDate) {
        return res.status(400).json({ error: 'bookId, userId, and dueDate are required.' });
      }
  
      // Check if the book is already borrowed
      const borrowing = await Borrowing.findOne({ bookId, returned: false });
      if (borrowing) {
        return res.status(400).json({ error: 'Book is already borrowed.' });
      }
  
      // Create the borrowing record
      const newBorrowing = new Borrowing({
        bookId,
        userId,
        dueDate
      });
      const savedBorrowing = await newBorrowing.save();
      res.status(201).json(savedBorrowing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all borrowed books
app.get('/borrow', async (req, res) => {
    try {
      const borrowings = await Borrowing.find().populate('bookId').populate('userId');
      res.status(200).json(borrowings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Return a book
app.put('/borrow/:id/return', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Mark the borrowing record as returned
      const updatedBorrowing = await Borrowing.findByIdAndUpdate(
        id,
        { returned: true },
        { new: true }
      );
  
      if (!updatedBorrowing) {
        return res.status(404).json({ error: 'Borrowing record not found.' });
      }
  
      res.status(200).json(updatedBorrowing);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get borrowed books by user ID
app.get('/borrow/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const borrowings = await Borrowing.find({ userId, returned: false }).populate('bookId');
      res.status(200).json(borrowings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// Start the Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
