module.exports = class 
{
    constructor()
    {
        this.fs = require("fs").promises;
        this.date = new Date();
        this.crypto = require("crypto");
        this.socket;
        this.bree = require("bree")
        this.currentJobs = {};
    }
    
    CreatePetJob(id)
    {
        console.log("uwu!!!")
        this.currentJobs[id] = new this.bree({
            jobs: [
                {
                    name:"test",
                    timeout:"5s",
                    worker:{
                        message: "hello:D"
                    }
                }
            ]
        })
        this.currentJobs[id].start()
    }

    async RegisterPet (name, owner, species, phoneNumber)
    {
        console.log("HELLOW??")
        const id = this.crypto.randomBytes(16).toString("hex");
        let newPet;
        //if there is time use nedb
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
            //console.log(petData)
            this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
            this.CreatePetJob(id)
            
        })
        return [id,newPet];
    }
}