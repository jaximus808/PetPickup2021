const router = require("express").Router();
const verifyUserToken = require("./verifyCookie")

const petManager = require("../localdatabase/dataManager");
const petdata = new petManager();

const path = require("path")
const fs = require("fs").promises
router.post("/admin/pet/register", verifyUserToken, (req,res) =>
{
    petdata.RegisterPet(req.name, req.owner, req.species, req.phoneNumber)
})

router.get("/api/pet/claim" , async (req,res) =>
{
    const id = req.header("PetId")
    await fs.readFile(path.join(__dirname, "../localdatabase", "pets.json")).then(async(data) => 
    {
        const petData = JSON.parse(data);
        if(petData.hasOwnProperty(id))
        {
            if(petData[id].days > 0)
            {
                
                res.send({error: true, message:"something went wrong"});
                return;
            }
            else 
            {
                petdata.Arrival(id);
                res.send({error:false, message:"We have gotten your arrival, wait for us to ready your pet and we'll text you that we are here!"})
            }
        }
        else 
        {
            console.log(id)
            res.send({error: true, message:"something went wrong"});
            return;
        }

    })
    //socketupdate
    
})

module.exports.router = router;
module.exports.petdata = petdata;