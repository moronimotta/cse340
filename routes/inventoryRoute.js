// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/trigger-error', utilities.handleErrors(invController.triggerError));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetail));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory)); 
router.post("/add-inventory", utilities.handleErrors(invController.addInventory)); 

router.get("/management", utilities.handleErrors(invController.buildInventoryManagement));

module.exports = router;

