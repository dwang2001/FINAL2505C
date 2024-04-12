const express = require('express');
const cors = require('cors');
const nodemailer = require("nodemailer");
//const { User } = require('../models');
require('dotenv').config();
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');



const app = express();

app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/records', express.static(path.join(__dirname, 'records')));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes
const scheduleRoute = require('./routes/schedule');
app.use("/schedule", scheduleRoute);
const userRoute = require('./routes/user');
app.use("/user", userRoute);
const logRoute = require('./routes/log');
app.use("/log", logRoute);
const sendReminderRoute = require('./routes/sendreminder');
app.use("/sendreminder", sendReminderRoute);
const roleRoute = require('./routes/role');
app.use("/role", roleRoute);
const uploadRoute = require('./routes/upload');
app.use("/upload", uploadRoute);
const patientRoute = require('./routes/patient');
app.use("/patient", patientRoute);
const generalRoute = require('./routes/general');
app.use("/general", generalRoute);
const checklistRoute = require('./routes/checklist');
app.use("/checklist", checklistRoute);
const recordsRoute = require('./routes/records');
app.use("/records", recordsRoute);

setInterval(() => {
    // Task to be executed
    axios.get('http://localhost:3001/sendreminder', async (req, res) => {
        console.log('Running task...');
    });

}, 60000)


const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);

        });
    })
    .catch((err) => {
        console.log(err);
    });
