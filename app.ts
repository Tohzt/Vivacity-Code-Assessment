const { Pool } = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydb',
  password: 'init',
  port: 5432,
});

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());

// Route for your homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Route for fetching application data from the database
app.get('/awesome/application', (req, res) => {
  pool.query('SELECT * FROM users', (error, result) => {
    if (error) {
      console.error('Error retrieving data:', error);
      res.status(500).json({ error: 'Error retrieving data' });
    } else {
      const applicationData = result.rows;

      // Format birthdate for each user
      applicationData.forEach(user => {
        if (user.birthdate) {
          const formattedBirthdate = new Date(user.birthdate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          user.birthdate = formattedBirthdate;
        }
      });

      res.json(applicationData);
    }
  });
});

// Route for deleting a user
app.delete('/awesome/application/:id/delete', async (req, res) => {
  const userId = req.params.id;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Route for creating a new user
app.post('/awesome/application/create', async (req, res) => {
  const { username, birthdate, email } = req.body;
  
  try {
    await pool.query('INSERT INTO users (username, birthdate, email) VALUES ($1, $2, $3)', [username, birthdate, email]);
    res.sendStatus(200); 
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Route for updating user information
app.put('/awesome/application/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, birthdate, email } = req.body;

  try {
    await pool.query('UPDATE users SET username = $1, birthdate = $2, email = $3 WHERE id = $4',
      [username, birthdate, email, userId]);
    res.sendStatus(200); // Successful update
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
});


const PORT = 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export your app instance

