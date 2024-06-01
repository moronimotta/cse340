// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const storeController = require("../controllers/storeController")


router.get("/", utilities.handleErrors(storeController.buildStore))

module.exports = router;