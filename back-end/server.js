// server.js

// Import the Express module
const express = require('express');

// Create an instance of the Express application
const app = express();

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start the server and listen for incoming connections
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});