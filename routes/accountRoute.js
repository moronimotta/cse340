// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Error handler middleware
router.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal Server Error");
});

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration))

// Route to handle registration form submission
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process the logout attempt
router.get("/logout", accountController.accountLogout)


router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccount))

router.get("/update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount))


router.post(
    "/update",
    utilities.checkLogin,
    utilities.handleErrors(accountController.updateAccount)

)

router.post(
    "/change-password",
    utilities.checkLogin,
    utilities.handleErrors(accountController.changePassword)
)


module.exports = router;