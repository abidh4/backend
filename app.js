require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');

const { studentRouter } = require('./router/student-router');
const { deptRouter } = require('./router/dept-router');
const { admissionRouter } = require('./router/admission-router');
const { examRouter } = require('./router/exam-router');



const errorController = require('./controller/error-controller');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== MongoDB Session Stores =====
const studentStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'studentSessions'
});

const deptStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'deptSessions'
});

const admissionStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'admissionSessions'
});

const examStore = new MongoDBStore({
  uri: process.env.DB_URL,
  collection: 'examSessions'
});

// ===== Session Middlewares =====
app.use('/stu', session({
  secret: 'studentSecretKey',
  resave: false,
  saveUninitialized: true,
  store: studentStore,
  name: 'student.sid'
}));

app.use('/dept-admin', session({
  secret: 'deptSecretKey',
  resave: false,
  saveUninitialized: true,
  store: deptStore,
  name: 'dept.sid'
}));

app.use('/admission-admin', session({
  secret: 'admissionSecretKey',
  resave: false,
  saveUninitialized: true,
  store: admissionStore,
  name: 'admission.sid'
}));

app.use('/exam-admin', session({
  secret: 'examSecretKey',
  resave: false,
  saveUninitialized: true,
  store: examStore,
  name: 'exam.sid'
}));

// ===== Routers =====
app.use('/stu', studentRouter);
app.use('/dept-admin', deptRouter);
app.use('/admission-admin', admissionRouter);
app.use('/exam-admin', examRouter);

// ===== Static Files & Error Handling =====
app.use(express.static(path.join(__dirname, 'views')));
app.use(errorController.showErrorMsg);

// ===== Connect to MongoDB and Start Server =====
const PORT = process.env.PORT || 3005;
const API_BASE_URL = process.env.API_BASE_URL;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => {
    console.log("Connected via mongoose");
    app.listen(PORT, () => {
        console.log(`Server running at ${API_BASE_URL || 'localhost'}`);
    });
})
.catch(err => {
    console.error("Error occurred!", err);
});
