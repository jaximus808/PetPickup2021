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
        
        socket.on("addPetData", async (data) =>
        {
            const newPetData = await petdata.RegisterPet(data.petName, data.ownerName,data.species,data.phoneNumber)
            console.log(newPetData[1])
            socket.emit("renderNewPet", newPetData[1],newPetData[0] )
        })
        
    })
}