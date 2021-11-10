const jwt = require("jsonwebtoken");
const path = require("path")

module.exports = function auth(req,res,next)
{
    const token = req.cookies.petAuthCookie;
    
    console.log(token)
    if(!token) return res.sendFile(path.join(__dirname,"../", "public", "test", "bad.html"));
    try
    {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        console.log("run bruh")
        next();
    }
    catch (err)
    {
        res.sendFile(path.join(__dirname,"../", "public", "test", "bad.html"));
    }
}