module.exports = class 
{
    constructor()
    {
        this.fs = require("fs").promises;
        this.date = new Date();
        this.crypto = require("crypto");
        this.io;
        this.balls = 5;
        this.bree = require("bree")
        this.currentJobs = {};
        this.pending = {};
        this.twillio = require("twilio")(process.env.TWILLIO_SID,process.env.TWILLIO_TOKEN);
        this.cabin = require("cabin")

        this.initProcess();
    }
    
    initProcess()
    {
        this.fs.readFile("./localdatabase/pets.json").then((data) =>
        {
            let petData = JSON.parse(data);

            for(let i = 0; i < Object.keys(petData).length; i++)
            {
                this.CreatePetJob(Object.keys(petData)[i])
            }
        })
    }
    Arrival(_id)
    {
        this.fs.readFile("./localdatabase/pets.json","utf-8").then((data) =>
        {

            let petData = JSON.parse(data);
            
            console.log(petData[_id].days)
            petData[_id].arrival = true; 
            this.io.emit("OwnerHere", _id);           
            this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2),(err,data) => {});


        })
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
                    interval: '3m',
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

                    this.fs.readFile("./localdatabase/pets.json","utf-8").then((data) =>
                    {
        
                        let petData = JSON.parse(data);
                        
                        console.log(petData[_id].days)
                        petData[_id].days -= 1;
                        this.io.emit("updateDays", {id: _id, days:petData[_id].days })
                        if(petData[_id].days == 0)
                        {
                            this.sendTextmessage(petData[_id].phoneNumber, _id)
                        }
                        else if(petData[_id].days == 1)
                        {
                            this.sendTextprevMessage(petData[_id].phoneNumber, _id)
                        }
                        else if(petData[_id].days == -1)
                        {
                            this.currentJobs[_id].stop()
                            //delete json object of pet data
                            delete petData[_id]
                            //send to the client to delete using socket
                        }
                        
                        this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2),(err,data) => {});
        
        
                    })
                    // if(this.pending[_id] == 1)
                    // {
                    //     //dont cancel yet
                    //     this.pending[_id] = 0; 
                    //     console.log("nice")
                    // }
                    // else 
                    // {
                    //     console.log("cock")
                        
                    // }
                    
                    
                }
        })
        this.currentJobs[_id].start()
    }
    
    sendTextmessage(phoneNumber,_id)
    {
        try
        {
            this.twillio.messages.create(
                {
                    body: 'Your pet is ready!',  
                    messagingServiceSid: process.env.MESSAGING_SID,      
                    to: '+1'+phoneNumber 
                }).then(message => {
                    console.log(message)
                // parentPort.postMessage("close")
                // process.exit(0)
    
                //process.exit(0)
                // if(parentPort) parentPort.postMessage("done");
                // else 
                
                }).done()
        }
        catch(e)
        {
            console.log(e)
            //make this where if explodes either run again or don't count day idk
        }
        
}
    sendTextprevMessage(phoneNumber,_id)
    {
        this.twillio.messages.create(
            {
                body: 'your pet will be ready for pickup tomorrow!',  
                messagingServiceSid: process.env.MESSAGING_SID,      
                to: '+1'+phoneNumber 
            }).then(message => {
                console.log(message)
            }).done()
    }

    PetReady(_id)
    {
         this.fs.readFile("./localdatabase/pets.json").then( (data) =>
        {
            
            let petData = JSON.parse(data);

            this.twillio.messages.create(
            {
                body:  `Your Pet is now ready! Come to the front desk with appropiate forms to claim your pet!`,  
                messagingServiceSid: process.env.MESSAGING_SID,      
                to: '+1'+petData[_id].phoneNumber, 
            }).then(message => {
                console.log(message)
            }).done()
            
            petData[_id].arrival = false;
            petData[_id].complete = true; 
            //console.log(petData)
            this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
            this.io.emit("petComplete", _id)
            
        })
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
                days: 3,
                comments: "",
                arrival:false,
                complete:false
            }
            newPet = petData[id];
            //console.log(petData)
            this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
            this.CreatePetJob(id)
            
        })
        return [id,newPet];
    }
}