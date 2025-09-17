const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const mysql = require('mysql2'); 
const path = require('path'); 
const multer = require('multer');  
const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Root', // Replace with your MySQL password
  database: 'Voting'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});   
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null,path.join(__dirname, '../uploads') ); // Save uploaded files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
      cb(null, file.originalname); // Use the original filename for the uploaded file
  }
}); 
// Endpoint to check if user exists
app.post('/checkExistingUser', async (req, res) => {
  const { username, password, aadharno } = req.body;

  try {
    // Check if a user with the same username, password, and Aadhar number exists
    // Here you need to implement your own logic to check if the user exists in the database
    // I assume you have a table named 'user' where you store user information
    const selectUserSql = 'SELECT * FROM user WHERE username = ? AND password = ? AND aadharno = ?';
    connection.query(selectUserSql, [username, password, aadharno], (error, results) => {
      if (error) {
        console.error('Error checking existing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.json({ exists: true });
      } else {
        return res.json({ exists: false });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


/* Registration API */
app.post('/registeruser', (req, res) => {
  const { username, email, password, aadharno, address } = req.body;  
  if (!username || !email || !password || !aadharno || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const insert_user_sql = 'INSERT INTO user(username,email,password,aadharno,address) VALUES (?, ?, ?, ?,?)';
  const insert_admin_sql = 'INSERT INTO admin(email,password) VALUES (?, ?)';
  
  connection.query(insert_user_sql, [username,  email, password, aadharno, address], (error, result) => {
      if (error) {
          res.status(500).send('Error inserting data into product');
          return;
      }
      connection.query(insert_admin_sql, [email,password], (error, result) => {
        if (error) {
            res.status(500).send('Error inserting data into product');
            return;
        }
        
        res.status(200).send('You have been registered successfully');
     });

  });
});

/*Login API*/
app.post('/login', (req, res) => {
  const { email, password} = req.body;  
  const select_user_sql = 'SELECT * FROM admin where email=? AND password=?';
  connection.query(select_user_sql, [email, password], (error, results) => {
    if (error) {
      res.status(500).send('Login Error');
      return;
  } else if(results.length === 0){
      res.json({ message: 'Invalid username or password' }); 
      return;
    } else {
      const user = results[0];
      // Assuming user is authenticated here
      // You can access the user's email from the retrieved user object
      const useremail = user.email;

      // Return user's email along with success response
  
    res.json({ message: 'success' ,email: useremail  });
    
    }
      
 }); 
});
/*Change Password */
app.post('/changepassword', (req, res) => {
  const { email, current_password, new_password } = req.body;
    const select_admin_sql = 'SELECT * FROM admin WHERE email = ?';
    const update_password_sql = 'UPDATE admin SET password = ? WHERE email = ?';
    connection.query(select_admin_sql, [email, current_password], (error, results) => {
      if (error) {
          res.status(500).send('Login Error');
          return;
      }  
      else if(results.length === 0){
          res.json({ 
              message: 'Your current Password is invalid'});
      }  
      else{
        connection.query(update_password_sql, [new_password, email], (error, result) => {
          res.json({ message: 'Password Updated Successfully' });
        });
      }
  }); 
  });   
  //get user
  /*Get Users */
app.get('/getUser', (req, res) => {
  const sql = 'SELECT * FROM user'; 
  connection.query(sql, (err, results) => {
      if (err) {
          res.status(500);
          res.send('Error in fetching data');
      }
      res.send(results);
  }); 
});
  /*Delete user*/
app.delete('/deleteuser/:email', (req, res) => {
  const email = req.params.email;

  const user_delete_sql = 'DELETE FROM user WHERE email=?';
  const admin_delete_sql = 'DELETE FROM admin WHERE email=?';
  
  connection.query(user_delete_sql, [email], (error, result) => {
      if (error) {
          res.status(500);
          res.send('Error deleting data into user');
      } else {
          
        connection.query(admin_delete_sql, [email], (error, result) => {
          if(result.affectedRows == 0){
            res.status(200);
            res.send('Record not found');
          } else {
            res.status(200);
            res.send('Record deleted successfully');
          }        
        })

      }
  });
});  
// Endpoint to fetch user details by email
app.get('/getUserByEmail/:email', (req, res) => {
  const email = req.params.email;
  const selectUserSql = 'SELECT * FROM user WHERE email = ?';
  connection.query(selectUserSql, [email], (error, results) => {
    if (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(results[0]); // Assuming there's only one user with the given email
  });
});

// Endpoint to update user details
app.put('/updateuser/:email', (req, res) => {
  const email = req.params.email;
  const { username, password, aadharno, address } = req.body;

  const updateUserSql = 'UPDATE user SET username = ?, password = ?, aadharno = ?, address = ? WHERE email = ?';
  
  connection.query(updateUserSql, [username, password, aadharno, address, email], (error, result) => {
    if (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Failed to update user details' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
});


app.post('/login', (req, res) => {
  const { email, password} = req.body;  
  
  const select_admin_sql = 'SELECT * FROM login where email=?';
  
  connection.query(select_admin_sql, [email, password], (error, results) => {
    if (error) {
      res.status(500).send('Login Error');
      return;
  } else if(results.length === 0){
      res.json({ message: 'Invalid username or password' });
  } else{
      res.json({ message: 'success' });
  }
});  
});   
const upload = multer({ storage: storage });
app.post('/candidates/add', upload.single('partyImage'), (req, res) => {
  const { name, party_name } = req.body;
  const party_image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  const insertCandidateSql = 'INSERT INTO candidate (name, party_name, party_image) VALUES (?, ?, ?)';
  connection.query(insertCandidateSql, [name, party_name, party_image], (error, results) => {
    if (error) {
      console.error('Error inserting candidate details:', error);
      return res.status(500).json({ error: 'Failed to add candidate' });
    }
    console.log('Candidate added successfully');
    res.json({ success: true });
  });
}); 
app.get('/candidates', (req, res) => {
  const selectCandidatesSql = 'SELECT * FROM candidate';
  connection.query(selectCandidatesSql, (error, results) => {
    if (error) {
      console.error('Error fetching candidates:', error);
      return res.status(500).json({ error: 'Failed to fetch candidates' });
    } 
    

    res.json(results);
  }); 
  

});   
// Deleting Candidate
app.delete('/candidates/delete/:id', (req, res) => {
  const id = req.params.id;

  const deleteCandidateSql = 'DELETE FROM candidate WHERE id = ?';
  connection.query(deleteCandidateSql, [id], (error, result) => {
    if (error) {
      console.error('Error deleting candidate:', error);
      res.status(500).send('Error deleting candidate');
      return;
    }
    res.status(200).send('Candidate deleted successfully');
  });
});
app.get('/voting', (req, res) => {
  const selectCandidatesSql = 'SELECT name, party_name, party_image FROM candidate';
  connection.query(selectCandidatesSql, (error, results) => {
    if (error) {
      console.error('Error fetching voting candidates:', error);
      return res.status(500).json({ error: 'Failed to fetch voting candidates' });
    }
    res.json(results);
  });
});  

// Endpoint to add voting candidates
app.post('/votingcandidates/add', upload.single('partyImage'), (req, res) => {
  const { name, party_name } = req.body;
  const party_image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  const insertCandidateSql = 'INSERT INTO VotingCandidates (name, party_name, party_image) VALUES (?, ?, ?)';
  connection.query(insertCandidateSql, [name, party_name, party_image], (error, results) => {
    if (error) {
      console.error('Error inserting voting candidate details:', error);
      return res.status(500).json({ error: 'Failed to add voting candidate' });
    }
    console.log('Voting candidate added successfully');
    res.json({ success: true });
  });
});  
// Endpoint to fetch voting candidates
app.get('/votingcandidates', (req, res) => {
  const selectCandidatesSql = 'SELECT name, party_name, party_image FROM VotingCandidates';
  connection.query(selectCandidatesSql, (error, results) => {
    if (error) {
      console.error('Error fetching voting candidates:', error);
      return res.status(500).json({ error: 'Failed to fetch voting candidates' });
    } 
    res.json(results);
  }); 
});


app.post('/vote', (req, res) => {
  const { candidatename, useremail } = req.body;  

  // Insert vote into the database with user's email
  const insertVoteSql = 'INSERT INTO vote (candidatename, useremail) VALUES (?, ?)';
  connection.query(insertVoteSql, [candidatename, useremail], (error, result) => {
    if (error) {
      console.error('Error inserting vote:', error);
      return res.status(500).json({ error: 'Failed to register vote' });
    }
    res.status(200).json({ message: 'Vote registered successfully' });
  });
});  
/* Fetch All Votes API */
app.get('/votes', (req, res) => {
  const selectVotesSql = 'SELECT * FROM vote ORDER BY candidatename'; // Sort votes by candidate name

  // Fetch all vote details
  connection.query(selectVotesSql, (error, results) => {
    if (error) {
      console.error('Error fetching vote details:', error);
      return res.status(500).json({ error: 'Failed to fetch vote details' });
    }

    res.json(results);
  });
});

/* Count Votes and Declare Winner API */
app.get('/count-votes', (req, res) => {
  const countVotesSql = 'SELECT candidatename, COUNT(*) AS count FROM vote GROUP BY candidatename ORDER BY count DESC'; // Sort vote counts by count in descending order

  // Count votes and declare winner
  connection.query(countVotesSql, (error, voteCounts) => {
    if (error) {
      console.error('Error counting votes:', error);
      return res.status(500).json({ error: 'Failed to count votes' });
    }

    // Find the winner
    let winner = { candidatename: '', count: 0 };
    voteCounts.forEach(candidate => {
      if (candidate.count > winner.count) {
        winner = candidate;
      }
    });

    res.json({ voteCounts, winner });
  });
});

// Route to handle forgot password request
app.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Generate OTP
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

        // Send OTP to user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your-email@gmail.com',
                pass: 'your-email-password'
            }
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Forgot Password - OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'OTP sent to your email.' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});



    



