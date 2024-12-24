require('dotenv/config');
const cors = require('cors');
const express = require('express');
const connectCloudinary = require('./config/cloudinary');
require('./config/db');
const Router = require('./routes/routes')

const serverApp = express();

// Middleware
serverApp.use(express.json());
serverApp.use(cors());
serverApp.use(Router)

connectCloudinary();

const PORT = process.env.PORT || 3000;

serverApp.listen(PORT, () => {
    console.log(`Server app started running on port: ${PORT}`);
});

// Default Route
serverApp.get('/', (req, res) => {
    res.status(200).send('<h1>Server started running and waiting for client requests</h1>');
});
