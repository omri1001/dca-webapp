// server.js
const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const routes = require('./routes');
require('dotenv').config(); // ensure this is near the top
require('./dbConnection');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
