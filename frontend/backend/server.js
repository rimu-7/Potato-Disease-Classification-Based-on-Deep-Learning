// Import necessary modules
import express from 'express';
import { createPool } from 'mysql2/promise';

// Create an instance of Express app
const app = express();

// Create a MySQL connection pool
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'Asdxz12@#',
  database: 'projectdb',
});

// Route to check the status of the database connection
app.get('/checkConnection', async (req, res) => {
  try {
    // Try to acquire a connection from the pool
    const connection = await pool.getConnection();
    connection.release(); // Release the connection back to the pool

    // If no errors occur, send a success response
    res.status(200).json({ message: 'Database connection is okay' });
  } catch (error) {
    console.error(error);
    // If an error occurs, send an error response
    res.status(500).json({ message: 'Error checking database connection' });
  }
});

// Route to handle saving prediction data to the database
app.post('/savePrediction', async (req, res) => {
  try {
    // Extract prediction data from request body
    const { image_name, predicted_class, confidence } = req.body;
    console.log('Prediction Data:', { image_name, predicted_class, confidence });

    // Execute SQL query to insert prediction data into the database
    const [result] = await pool.query('INSERT INTO predictions (image_name, predicted_class, confidence) VALUES (?, ?, ?)', [image_name, predicted_class, confidence]);
    console.log('Insert Result:', result);

    // Send response indicating success
    res.status(200).json({ message: 'Prediction saved successfully!' });
  } catch (error) {
    console.error('Error:', error);
    // Send response indicating failure
    res.status(500).json({ message: 'Error saving prediction' });
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
