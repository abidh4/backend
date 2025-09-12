const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { deptAdmissionRouter } = require('./router/dept-admission-router');



const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(deptAdmissionRouter);


const PORT  = 3005;
mongoose.connect("mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority&appName=abidICT")
.then(
 ()=>{
  console.log("Connected via mongoose: ");
   app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
 }
)
.catch( err=>{
  console.log("error occured!", err);
})