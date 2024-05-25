// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/trigger-error', utilities.handleErrors(invController.triggerError));

router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildInventoryDetail));

router.get("/add-classification", utilities.checkLogin, utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification));
router.post("/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);
router.get("/add-inventory", 
    utilities.checkLogin, 
    utilities.checkAuthorization,
utilities.handleErrors(invController.buildAddInventory)); 
router.post("/add-inventory", utilities.handleErrors(invController.addInventory)); 

router.get("/management", utilities.handleErrors(invController.buildInventoryManagement));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventoryId", utilities.checkLogin, utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventory));
router.post("/update/", 
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.checkLogin, 
    utilities.checkAuthorization, 
    utilities.handleErrors(invController.updateInventory)
);

router.get("/delete/:inv_id", 
    utilities.checkLogin, 
    utilities.checkAuthorization,
utilities.handleErrors(invController.buildDeleteConfirmation));

router.post("/delete/", 
    utilities.checkLogin, 
    utilities.checkAuthorization,
utilities.handleErrors(invController.deleteInventory));

module.exports = router;

