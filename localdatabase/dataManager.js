module.exports = class 
{
    constructor()
    {
        this.fs = require("fs");
        this.date = new Date();
        this.crypto = require("crypto");
        this.socket;
    }
    

    RegisterPet (name, owner, species, phoneNumber)
    {
        this.fs.readFile("./pets.json", (err, data) =>
        {
            if(err)
            {
                return false;
            }
            let petData = JSON.parse(data);
            
            petData[crypto.randomBytes(16).toString("hex")] = {
                name: name,
                owner: owner,
                species: species,
                phoneNumber: phoneNumber
            }
            this.fs.writeFileSync("./pets.json", JSON.stringify(petData, null, 2));
        })
    }
}