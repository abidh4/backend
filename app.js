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
  uri: "mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority",
  collection: 'studentSessions'
});

const deptStore = new MongoDBStore({
  uri: "mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority",
  collection: 'deptSessions'
});

const admissionStore = new MongoDBStore({
  uri: "mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority",
  collection: 'admissionSessions'
});

const examStore = new MongoDBStore({
  uri: "mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority",
  collection: 'examSessions'
});

// ===== Session Middlewares =====
app.use('/student', session({
  secret: 'studentSecretKey',
  resave: false,
  saveUninitialized: true,
  store: studentStore,
  name: 'student.sid'
}));

app.use('/dept', session({
  secret: 'deptSecretKey',
  resave: false,
  saveUninitialized: true,
  store: deptStore,
  name: 'dept.sid'
}));

app.use('/admission', session({
  secret: 'admissionSecretKey',
  resave: false,
  saveUninitialized: true,
  store: admissionStore,
  name: 'admission.sid'
}));

app.use('/exam', session({
  secret: 'examSecretKey',
  resave: false,
  saveUninitialized: true,
  store: examStore,
  name: 'exam.sid'
}));

// ===== Routers =====
app.use('/student', studentRouter);
app.use('/dept', deptRouter);
app.use('/admission', admissionRouter);
app.use('/exam', examRouter);

// ===== Static Files & Error Handling =====
app.use(express.static(path.join(__dirname, 'views')));
app.use(errorController.showErrorMsg);

// ===== Connect to MongoDB and Start Server =====
const PORT = 3005;
mongoose.connect("mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected via mongoose");
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.log("Error occurred!", err);
});
