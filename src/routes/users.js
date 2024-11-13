const express = require('express');
const path = require('path');
const fs = require('fs');
const {createObjectCsvWriter} = require('csv-writer');

const router = express.Router();
const csvFilePath = path.join(__dirname, '../../data/users.csv');

const headers = [
    {id: 'email', title: 'Email'},
    {id: 'password', title: 'Password'},
    {id: 'phone', title: 'Phone'},
];

const csvWriter = createObjectCsvWriter({
    path: csvFilePath,
    header: headers,
    append: true,
});

router.post('/save-user', async (req, res) => {
    const {email, password, phone} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    try {
        // If the file does not exist, create it with headers
        if (!fs.existsSync(csvFilePath)) {
            const headerLine = headers.map(header => header.title).join(',') + '\n';
            fs.writeFileSync(csvFilePath, headerLine, 'utf8');
        }

        await csvWriter.writeRecords([{email, password, phone}]);

        res.status(200).json({message: 'User saved successfully'});
    } catch (error) {
        console.error('Error writing to CSV:', error);
        res.status(500).json({message: 'Failed to save user data'});
    }
});

module.exports = router;
