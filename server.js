const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); //to fetch 
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public'))); // Ensure 'public' is the folder that contains your HTML, JS, and CSS files

// Root route to serve login.html (you can change this to any other HTML file)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html')); // Serve the login page
});

// Connect to MongoDB
const mongoURI = "mongodb+srv://khavinhthuan114:qozEkCoDhSHsIaH6@cluster0.dlkvl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define the User schema and model
const UserSchema = new mongoose.Schema({
  surname: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { surname, name, email, password, cfpassword } = req.body;

  if (password !== cfpassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, message: "Email already exists." });
      }

      const newUser = new User({ surname, name, email, password });
      await newUser.save();
      res.status(201).json({ success: true, message: "User created successfully." });
  } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ success: false, message: "Server error." });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found." });
    }

    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }

    res.status(200).json({ success: true, message: "Login successful." });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Set up server to listen on port 8000
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
