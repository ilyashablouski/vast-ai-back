const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

dotenv.config();

const contactsRoute = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 6000;
const csvFilePath = path.join(__dirname, 'users.csv');

app.use(cors());
app.use(express.json());

app.use('/api', contactsRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
