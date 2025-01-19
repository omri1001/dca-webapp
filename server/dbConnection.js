// server/dbConnection.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config');
require('dotenv').config();

// Connection for combat_database
const combatConnection = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'mock_data'
});

// Connection for polls_trainings
const pollsConnection = mongoose.createConnection(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'polls_trainings'
});

combatConnection.on('connected', () => {
    console.log('Mongoose connected to combat_database');
});
combatConnection.on('error', err => {
    console.error('Mongoose combat_database connection error:', err);
});

pollsConnection.on('connected', () => {
    console.log('Mongoose connected to polls_trainings');
});
pollsConnection.on('error', err => {
    console.error('Mongoose polls_trainings connection error:', err);
});

module.exports = { combatConnection, pollsConnection };
