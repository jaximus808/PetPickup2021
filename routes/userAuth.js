const router = require("express").Router();
const User = require("./models/UserObject");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyUserToken = require("./userTokenVerify")
const { registerValidation, loginValidation} = require("./validation");

router.post("/api/user/createUser", async(req,res) =>{
    let unmodifiedNum = req.body.phone;
    let modifiedNum = "";
    for(let i = 0; i < unmodifiedNum.length; i++)
    {
        let c = unmodifiedNum[i];
        if(c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58)
        {
            modifiedNum += c;
        }
        else if(c != "(" || c != ")" || c != " ")
        {
            return res.status(400).send({error:true, message: "Invalid formatting of phone number"})
        }
    }

    let modifedData = 
    {
        username:req.body.username,
        email: req.body.email,
        phoneNumber: modifiedNum,
        password: req.body.password
    }
    console.log("Register Request incoming");
    const {error} = registerValidation(modifedData);
    if(error) return res.status(400).send({error:true,message:error.details[0].message});
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({error:true , message: "email already exists"});
    const phoneExist = await User.findOne({phoneNumber: modifiedNum});
    if(phoneExist) return res.status(400).send({error:true , message: "Phone Number Already Registered"});

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        username:req.body.username,
        email: req.body.email,
        phoneNumber: modifiedNum,
        password: hashPassword,
        groups: "[]",
        invites: "[]"
    });
    try
    {
        const savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id},process.env.TOKEN_SECRET);
        res.cookie(`authCookie`,token,{ maxAge: 9000000, httpOnly: true });
        res.send({error:false,message:""});
    }
    catch(error)
    {
        console.log("errorRegistering")
        res.status(400).send({error:true , message: error.message});
    }
})
router.post("/api/user/loginUser",async(req,res)=>
{
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send({error:true,message:error.details[0].message});

    const emailExist = await User.findOne({email: req.body.email});
    if(!emailExist) return res.status(400).send({error:true , message: "email or pass is incorrect"});

    const validPass = await bcrypt.compare(req.body.password,emailExist.password);
    if(!validPass) return res.status(400).send({error:true , message: "email or pass is incorrect"});

    const token = jwt.sign({_id: emailExist._id},process.env.TOKEN_SECRET);
    res.cookie(`authCookie`,token,{ maxAge: 9000000, httpOnly: true });
    res.header("auth-token",token).send({error:false, message:""});
})

router.get("/api/user/logOut",async(req,res)=>
{
    res.clearCookie("authCookie");
    res.send({})
})

router.get("/api/user/accountDetails",verifyUserToken, async(req,res) =>
{
    console.log("sending user data")
    const userInfo = await User.findById({_id:req.user._id})
    try{

        res.send({error:false,message:"Success", email:userInfo.email, username:userInfo.username});
    }
    catch{
        res.send({error:true,message:"Something went wrong"})
    }
})
module.exports = router;