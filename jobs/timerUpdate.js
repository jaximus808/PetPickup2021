const {parentPort, Worker, isMainThread, workerData } = require('worker_threads');

const fs = require("fs")
const path = require("path")
const twillio = require("twilio")(process.env.TWILLIO_SID,process.env.TWILLIO_TOKEN);
console.log(workerData)
console.log(workerData.id)
console.log("updating days")
console.log(__dirname)
fs.readFile("./localdatabase/pets.json","utf-8",(err,data) =>
    {
        console.log(err)
        
        let petData = JSON.parse(data);
        console.log("HELLO???")
        console.log(workerData.id)
        
        petData[workerData.id].days -= 1;
        if(petData[workerData.id].days == 0)
        {
            sendTextmessage(petData[workerData.id].phoneNumber, workerData.id)
        }
        if(petData[workerData.id].days == 1)
        {
            sendTextprevMessage(petData[workerData.id].phoneNumber, workerData.id)
        }
        //console.log(petData)
        fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2),(err,data) => {});
        
        
    })

function sendTextprevMessage(phoneNumber,_id)
{
    twillio.messages.create(
        {
            body: 'your pet will be ready for pickup tomorrow!',  
            messagingServiceSid: process.env.MESSAGING_SID,      
            to: '+1'+phoneNumber 
        }).then(message => {
            console.log(message)
        }).done()
}

function sendTextmessage(phoneNumber,_id)
{
    twillio.messages.create(
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
            console.log(workerData.id)
            console.log("TWFW")
            parentPort.postMessage(workerData.id)
            console.log("pet done")
        }).done()
}