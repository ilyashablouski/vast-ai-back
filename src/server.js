const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const usersRouter = require('./routes/users');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6000;
const csvFilePath = path.join(__dirname, '../data/users.csv');

app.use(cors('https://vast-ai.netlify.app'));
// Middleware for JSON parsing
app.use(express.json());
// Redirect from root path to /admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});
//Connecting a route to save users
app.use('/api', usersRouter);

// Stub for admin data
const admin = {
    email: 'vastai@example.com',
    passwordHash: bcrypt.hashSync('vast123', 10), // захэшированный пароль
};

// Token generation
const generateToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


// Middleware for token verification
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Login route
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;

    if (email === admin.email && bcrypt.compareSync(password, admin.passwordHash)) {
        const token = generateToken(email);
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

// CSV download route (secure)
app.get('/api/admin/download-csv', authenticateJWT, (req, res) => {
    if (fs.existsSync(csvFilePath)) {
        res.download(csvFilePath, 'users.csv');  // File name
    } else {
        res.status(404).json({ message: 'CSV file not found' });
    }
});

// Route for HTML page with CSV download button
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/download-page.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
