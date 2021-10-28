if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const verifyCookieToken = require("./routes/verifyCookie")

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser : true, useUnifiedTopology: true},()=>{
    console.log("Connected to db");
})

app.use(express.json())
app.use(express.urlencoded({
    extended:false
}));
const userAuth = require("./routes/userAuth");

app.use("/",userAuth);


app.use("/",express.static(path.join(__dirname,"public","home")));
app.use("/user/register",express.static(path.join(__dirname,"public","register")));

//authentication
app.use("/auth/viewPet",verifyCookieToken, express.static(path.join(__dirname,"public","pass")))


app.listen(3000,()=>console.log("uwu"));