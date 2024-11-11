const express = require('express');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const router = express.Router();

const csvWriter = createObjectCsvWriter({
    path: './data/users.csv',
    header: [
        { id: 'email', title: 'Email' },
        { id: 'password', title: 'Password' },
        { id: 'phone', title: 'Phone' },
    ],
    append: true,
});

router.post('/save-user', async (req, res) => {
    const {  email, password, phone } = req.body;

    try {
        await csvWriter.writeRecords([{ email, password, phone }]);
        res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
        res.setHeader('Content-Type', 'text/csv');
        fs.createReadStream('./data/users.csv').pipe(res);
    } catch (error) {
        console.error('Error writing to CSV:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
