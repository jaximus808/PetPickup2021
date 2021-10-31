module.exports = class 
{
    constructor()
    {
        this.fs = require("fs").promises;
        this.date = new Date();
        this.crypto = require("crypto");
        this.socket;
    }
    

    async RegisterPet (name, owner, species, phoneNumber)
    {
        console.log("HELLOW??")
        const id = this.crypto.randomBytes(16).toString("hex");
        let newPet;
        await this.fs.readFile("./localdatabase/pets.json").then(data =>
        {
            
            let petData = JSON.parse(data);
            
            petData[id] = {
                name: name,
                owner: owner,
                species: species,
                phoneNumber: phoneNumber,
                days: 30,
                comments: ""
            }
            newPet = petData[id];
            console.log("?")
            console.log(newPet)
            //console.log(petData)
            this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
            
            
        })
        return [id,newPet];
    }
}