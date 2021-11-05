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
        this.axios = require("axios").default
    }
    
    CreatePetJob(id)
    {
        console.log("uwu!!!")
        this.currentJobs[id] = new this.bree({
            jobs: [
                // { might not need cuz prone to problems anyway
                //     name:"test",
                //     timeout:"60s",
                //     worker:{
                //         message: "hello:D"
                //     }
                // },
                {
                    //interval: 'at 12:00 am' EZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
                    name:"timerUpdate",
                    interval: 'at 12:00 am',
                    worker:
                    {
                        id:id,
                        dataMan: this
                    }
                }
                //have an interval to update database json file


            ]
        })
        this.currentJobs[id].start()
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

            var options = {
                
            }
            const content =  
            {
                url:'https://rest-api.d7networks.com/secure/send',
                method: 'POST', 
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic c2p6YzkwNzM6dXpnN2dnSk0='
                },
                data: JSON.stringify({
                    coding: '8',
                    from: 'SMSInfo',
                    'hex-content': '48454c4c4f',
                    to:"+1"+ modifiedNum
                })
            };

            this.axios.request(content).then(res =>
                {
                    console.log(res.data)
                }).catch((err) =>
                {
                    console.error(err)
                })
            
            if(!pass) return
            petData[id] = {
                name: name,
                owner: owner,
                species: species,
                phoneNumber: modifiedNum,
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