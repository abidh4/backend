const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const { router } = require('./router/dept-admission-router');
const errorController = require('./controller/error-controller');



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const store = new MongoDBStore ({
  uri:"mongodb+srv://root:root@abidict.s8jeg1g.mongodb.net/abidDB?retryWrites=true&w=majority&appName=abidICT",
  collection:'session'
});

app.use(session({
secret: 'this-is-secret',
resave: false,
saveUninitialized: true,
store
})
);



// app.use("/student", (req,res,next)=>{
//   if(req.isLoggedIn){
//     next();
//   }
//   else{
//     res.redirect('/login');
//   }
// });
// app.use("/result", (req,res,next)=>{
//   if(req.isLoggedIn){
//     next();
//   }
//   else{
//     res.redirect('/login');
//   }
// });
// app.use("/delete", (req,res,next)=>{
//   if(req.isLoggedIn){
//     next();
//   }
//   else{
//     res.redirect('/login');
//   }
// });
// app.use("/edit", (req,res,next)=>{
//   if(req.isLoggedIn){
//     next();
//   }
//   else{
//     res.redirect('/login');
//   }
// });

app.use(router);

app.use(express.static(path.join(__dirname, 'views')));
app.use(errorController.showErrorMsg);

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