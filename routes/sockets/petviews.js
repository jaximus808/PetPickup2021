module.exports = (io, petdata) =>
{
    const fs = require("fs")
    const path = require('path')
    petdata.io = io; 
    io.on("connection", (socket)=>
    {
        
        console.log("sup")
        //okay change this to nedb asap so buggy
        fs.readFile(path.join(__dirname, "../","../","/localdatabase/pets.json"), (err, data) =>
        {
            if(err)
            {
                console.log("ERRORRR")
                return false;
            }
            socket.emit("renderInitData", JSON.parse(data))
        })
        
        socket.on("PetReadyForPick", (_id) =>
        {
            petdata.PetReady(_id)
        })

        socket.on("addPetData", async (data) =>
        {
            if(parseInt(data.dayLen) < 0) return;
            const newPetData = await petdata.RegisterPet(data.petName, data.ownerName,data.species,data.phoneNumber,data.days,data.dayLen)
            console.log(newPetData[1])
            socket.emit("renderNewPet", newPetData[1],newPetData[0] )
        })
        
    })
}