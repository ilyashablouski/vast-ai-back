const express = require('express');
const cors = require('cors');
const contactsRoute = require('./routes/users');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.use('/api', contactsRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
