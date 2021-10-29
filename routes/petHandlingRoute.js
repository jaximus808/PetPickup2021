const router = require("express").Router();
const verifyUserToken = require("./verifyCookie")

const petManager = require("../localdatabase/dataManager");
const petdata = new petManager();

router.post("/admin/pet/register", verifyUserToken, (req,res) =>
{
    petdata.RegisterPet(req.name, req.owner, req.species, req.phoneNumber)
})

module.exports.router = router;
module.exports.petdata = petdata;