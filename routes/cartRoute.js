// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const cartController = require("../controllers/cartController")
const regValidate = require('../utilities/account-validation')



router.get("/checkout", utilities.handleErrors(cartController.buildCheckout))
router.post("/checkout", utilities.handleErrors(cartController.checkout))

router.post("/add-item/:id", utilities.handleErrors(cartController.addItem))

module.exports = router;