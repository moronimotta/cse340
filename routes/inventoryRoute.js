// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/trigger-error', utilities.handleErrors(invController.triggerError));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetail));
module.exports = router;