if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const verifyCookieToken = require("./routes/verifyCookie");
const http = require("http")
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server)

require("./routes/sockets/petviews")(io);

app.use(cookieParser());

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
const petAuth = require("./routes/petHandlingRoute");

app.use("/",userAuth);
app.use("/",petAuth);


app.use("/",express.static(path.join(__dirname,"public","home")));
app.use("/user/register",express.static(path.join(__dirname,"public","register")));

//authentication
app.use("/auth/viewPet",verifyCookieToken, express.static(path.join(__dirname,"public","adminHome")))


server.listen(3000,()=>console.log("Server up"));

//sockets

