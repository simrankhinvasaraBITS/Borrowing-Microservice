const axios = require('axios');

const baseURL = 'http://localhost:3003';

// Test Data
const testBookId = '64a3d4c8f1c4b9d87d9a1234'; // Replace with actual book ObjectId
const testUserId = '64a3d4c8f1c4b9d87d9a5678'; // Replace with actual user ObjectId

let borrowingId; // To store the created borrowing record ID

// Borrow a Book
async function borrowBook() {
  try {
    const response = await axios.post(`${baseURL}/borrow`, {
      bookId: testBookId,
      userId: testUserId,
      dueDate: '2024-11-20'
    });
    console.log('Borrow Book Response:', response.data);
    borrowingId = response.data._id; // Save the borrowing ID for later tests
  } catch (error) {
    console.error('Error Borrowing Book:', error.response?.data || error.message);
  }
}

// Get All Borrowed Books
async function getAllBorrowedBooks() {
  try {
    const response = await axios.get(`${baseURL}/borrow`);
    console.log('All Borrowed Books:', response.data);
  } catch (error) {
    console.error('Error Fetching All Borrowed Books:', error.response?.data || error.message);
  }
}

// Return a Book
async function returnBook() {
  try {
    if (!borrowingId) {
      console.error('No borrowing ID available to test returning a book.');
      return;
    }
    const response = await axios.put(`${baseURL}/borrow/${borrowingId}/return`);
    console.log('Return Book Response:', response.data);
  } catch (error) {
    console.error('Error Returning Book:', error.response?.data || error.message);
  }
}

// Get Borrowed Books by User
async function getBorrowedBooksByUser() {
  try {
    const response = await axios.get(`${baseURL}/borrow/user/${testUserId}`);
    console.log('Borrowed Books by User:', response.data);
  } catch (error) {
    console.error('Error Fetching Borrowed Books by User:', error.response?.data || error.message);
  }
}

// Execute Tests Sequentially
async function runTests() {
  console.log('Starting Borrowing Service Tests...');
  await borrowBook();
  await getAllBorrowedBooks();
  await returnBook();
  await getBorrowedBooksByUser();
  console.log('Finished Borrowing Service Tests.');
}

runTests();
