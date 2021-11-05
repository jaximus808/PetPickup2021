const { Worker, isMainThread, workerData } = require('worker_threads');
const textbelt = require("textbelt");
console.log(workerData)
console.log("updating days")
await this.fs.readFile("../localdatabase/pets.json").then(data =>
    {
        
        let petData = JSON.parse(data);
        
        petData[workerData.id].days -= 1;
        if(petData[workerData.id].days == 0)
        {
            sendTextmessage(petData[workerData.id].phoneNumber, workerData.id)
        }
        //console.log(petData)
        this.fs.writeFile("./localdatabase/pets.json", JSON.stringify(petData, null, 2));
        
        
    })

function sendTextmessage(phoneNumber,_id)
{
    workerData.dataMan.textbelt.sendText(phoneNumber, "Your Pet is Ready for PickUp! Come to this link:", undefined, (err) =>
    {
        console.log(err)
    });
}