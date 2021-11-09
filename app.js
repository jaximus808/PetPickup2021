if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
const fs = require("fs").promises
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
const {router, petdata} = require("./routes/petHandlingRoute");

require("./routes/sockets/petviews")(io,petdata);
app.use("/",userAuth);
app.use("/",router);


app.use("/",express.static(path.join(__dirname,"public","home")));
app.use("/user/register",express.static(path.join(__dirname,"public","register")));

//authentication
app.use("/auth/viewPet",verifyCookieToken, express.static(path.join(__dirname,"public","adminHome")))

app.use("/checkout/id/:id",async (req, res,next) =>
{
    const id = req.params.id;
    await fs.readFile(path.join(__dirname, "localdatabase", "pets.json")).then(async(data) => 
    {
        const petData = JSON.parse(data);
        if(petData.hasOwnProperty(id))
        {
            if(petData[id].days > 0)
            {
                res.redirect("/");
                return;
            }
        }
        else 
        {
            res.redirect("/");
            return;
        }
        
        

    })
    
    console.log("nice")
    next();
    
},
express.static(path.join(__dirname,"public/checkout")))


server.listen(3000,()=>console.log("Server up"));

//sockets

