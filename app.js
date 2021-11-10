if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
require
const TempUser = require("./routes/models/TempObject")
const fs = require("fs").promises
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const verifyCookieToken = require("./routes/verifyCookie");
const verifyPetCookieToken = require("./routes/verifyPetViewCook");
const http = require("http")
const socketio = require("socket.io");
const jwt = require("jsonwebtoken")
const favicon = require("serve-favicon");

const server = http.createServer(app);
const io = socketio(server)



app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.set('view engine', 'ejs');
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

app.get("/admin/login", (req,res,next) =>
{
    const token = req.cookies.authCookie;
    
    console.log(token)
    if(!token) return res.render("adminLogin", {url:process.env.HOME_URL});
    try
    {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log("run bruh")
        next();
    }
    catch (err)
    {
        res.render("adminLogin");
    }
}, (req,res)=>
{
    res.redirect("/auth/viewPet") 
})


app.use(favicon(path.join(__dirname,"public","icon","favicon.ico")))
app.use("/pet/petviews", express.static(path.join(__dirname,"public","home")))
app.get("/pet/petviews", verifyPetCookieToken, async (req,res) => {
    console.log(req.user)
    const user = await TempUser.findOne({_id: req.user._id});
    let specData;
    try
    {
        await fs.readFile(path.join(__dirname, "localdatabase", "pets.json")).then(async(data) => 
        {
            const petData = JSON.parse(data);
            
            
            
            specData = petData[user.petId]
            specData.id = user.petId;
            if(specData.days == 0) 
            {
                if(specData.complete) specData.message = "Everything is complete!"
                else specData.message = "Your pet is ready for pickup!"
            }
            else specData.message = "Your Pet is currently in Quarentine!" 
            
        })
    }
    catch(e)
    {
        res.clearCookie("petAuthCookie");
        return res.redirect("/")
    }
    //{days:days,name:name, comment:comment, type:type, ownerName:ownername,}
    res.render("petinfo", specData)
})
app.get("/", (req,res) => res.render("home"))
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

