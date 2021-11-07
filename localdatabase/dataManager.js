module.exports = class 
{
    constructor()
    {
        this.fs = require("fs").promises;
        this.date = new Date();
        this.crypto = require("crypto");
        this.socket;
        this.balls = 5;
        this.bree = require("bree")
        this.currentJobs = {};
        this.twillio = require("twilio")(process.env.TWILLIO_SID,process.env.TWILLIO_TOKEN);
        this.cabin = require("cabin")
    }
    
    CreatePetJob(_id)
    {
        console.log("uwu!!!")
        this.currentJobs[_id] = new this.bree({
            
            //logger : new this.cabin(),
            jobs: [
                // { might not need cuz prone to problems anyway
                //     name:"test",
                //     timeout:"60s",
                //     worker:{
                //         message: "hello:D"
                //     }
                // },
                // { actual use
                //     //interval: 'at 12:00 am' EZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                //     name:"timerUpdate",
                //     interval: 'at 12:00 am',
                //     worker:
                //     {
                //         id:id,
                //     }
                // }
                { //test
                    //interval: 'at 12:00 am' EZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                    name:"timerUpdate",
                    interval: '5s',
                    worker: {
                        workerData: {
                          id:_id,
                          
                        }
                      }
                },
                
                
                //have an interval to update database json file


            ],
            workerMessageHandler: (name,message)=>
                {
                    //IT WROKS LETS GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
                    console.log(this.balls)
                    this.currentJobs[_id].stop()
                }
        })
        this.currentJobs[_id].start()
    }

    async RegisterPet (name, owner, species, phoneNumber)
    {
        console.log("HELLOW??")
        const id = this.crypto.randomBytes(16).toString("hex");
        let newPet;
        //if there is time use nedb instead
        await this.fs.readFile("./localdatabase/pets.json").then( async(data) =>
        {
            let pass = true
            let petData = JSON.parse(data);
            let unmodifiedNum = phoneNumber;
            let modifiedNum = "";
            if(unmodifiedNum.length<10) pass = false;
            for(let i = 0; i < unmodifiedNum.length; i++)
            {
                let c = unmodifiedNum[i];
                if(c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58)
                {
                    modifiedNum += c;
                }
                else if(c != "(" || c != ")" || c != " ")
                {

                    //this is so bullshit btw
                    console.log("error")
                    pass = false;
                    this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
                    return 
                }
            }
            console.log(modifiedNum);
            // this.textbelt.sendText(modifiedNum, "Come back in 30 days to get your pet!",undefined, (err) =>
            // {
            //     console.log("fick")
            //     console.log(err)
            //     pass = false
            //     this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
            //     return;
            // })
            this.twillio.messages.create(
            {
                body:  `your pet: ${name} has been successfully quarentined, be sure to come back in 30 days! you can check ur pet at this link:`,  
                messagingServiceSid: process.env.MESSAGING_SID,      
                to: '+1'+phoneNumber 
            }).then(message => {
                console.log(message)
            }).done()
            
            if(!pass) return
            petData[id] = {
                name: name,
                owner: owner,
                species: species,
                phoneNumber: modifiedNum,
                days: 4,
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