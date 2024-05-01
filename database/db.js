const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: '173.230.151.165',
  user: 'mike_ra2k24',
  password: 'M@steR12!@',
  database: 'mike_RA2k24'
});

// Function to execute dynamic queries
async function executeQuery(query) {
  let connection;
  try {
    // Get a connection from the pool
    connection = await pool.promise().getConnection();

    // Execute the query
    const [results] = await connection.query(query);

    return results;
  } catch (error) {
    // Handle errors
    console.error('Error executing query:', error);
    throw error;
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

module.exports = executeQuery;