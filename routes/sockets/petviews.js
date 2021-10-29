module.exports = (io, petdata) =>
{
    const fs = require("fs")
    const path = require('path')
    io.on("connection", (socket)=>
    {
        petdata.socket = socket;
        console.log("sup")
        fs.readFile(path.join(__dirname, "../","../","/localdatabase/pets.json"), (err, data) =>
        {
            if(err)
            {
                console.log("ERRORRR")
                return false;
            }
            socket.emit("renderInitData", JSON.parse(data))
        })
        
    })
}