const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require('../utilities/index');
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;
    let tools = await utilities.buildTools(accountData);

    if (accountData) {
        req.flash("notice", "You are already logged in.")
        return res.redirect("/account/")
    }

    // req.flash("notice", "This is a flash message.")
    res.render("account/login", {
        title: "Login",
        nav,
        tools,
    })
}

// Deliver registration view
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;
    let tools = await utilities.buildTools(accountData);
    res.render("account/registration", {
        title: "Register",
        nav,
        tools, 
        errors: null,
    })
}

async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    let user = res.locals.accountData
    let tools = await utilities.buildTools(user)
    res.render("account/user-main-page", {
        title: "Account",
        nav,
        tools,
        account_firstname: user.account_firstname,
        account_lastname: user.account_lastname,
        account_email: user.account_email,
        account_type: user.account_type,
        account_id: user.account_id,
    })
}

// logout
async function accountLogout(req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/account/login")
}

// updateAccount
async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email } = req.body
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    const updateResult = await accountModel.updateAccount(
        accountData.account_id,
        account_firstname,
        account_lastname,
        account_email
    )
    if (updateResult) {
        const accessToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        }
        else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        req.flash("notice", "Account updated.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/update-account", {
            title: "Update Account",
            nav,
            user: accountData,
            tools,
        })
    }
}

// changePassword
async function changePassword(req, res, next) {
    let nav = await utilities.getNav()
    const { new_pwd, confirm_pwd, current_pwd } = req.body
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData);

    user = await accountModel.getAccountByEmail(accountData.account_email)
    let current_pwd_db = user.account_password


    const isCurrentPasswordCorrect = bcrypt.compareSync(current_pwd, current_pwd_db);
    if (!isCurrentPasswordCorrect) {
        req.flash("notice", "Current password is incorrect.");
        return res.redirect("/account/info");
    }

    if (new_pwd === confirm_pwd) {
        const hashedPassword = await bcrypt.hashSync(new_pwd, 10)
        const updateResult = await accountModel.updatePassword(accountData.account_id, hashedPassword)
        if (updateResult) {
            req.flash("notice", "Password updated.")
            res.redirect("/account/logout")
        } else {
            req.flash("notice", "Sorry, the update failed.")
            res.status(501).render("account/update-account", {
                title: "Update Account",
                nav,
                user: accountData,
                tools,
            })
        }
    } else {
        req.flash("notice", "Passwords do not match.")
        return res.redirect("/account/info")
    }
}


// buildUpdateAccount
async function buildUpdateAccount(req, res, next) {
    let nav = await utilities.getNav()
    let user = res.locals.accountData
    let tools = await utilities.buildTools(user)
    res.render("account/update-user", {
        title: "Update Account",
        nav,
        tools,
        account_email: user.account_email,
        account_firstname: user.account_firstname,
        account_lastname: user.account_lastname,
        account_id: user.account_id,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    const accountData = res.locals.accountData;
    let tools = await utilities.buildTools(accountData);

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/registration", {
            title: "Registration",
            nav,
            tools,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            tools,
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/registration", {
            title: "Registration",
            tools,
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
  
    const accountData = await accountModel.getAccountByEmail(account_email)
    let tools = await utilities.buildTools(accountData);
    if (!accountData) {
     req.flash("notice", "Please check your credentials and try again.")
     res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      tools,
     })
    return
    }
    try {
     if (await bcrypt.compare(account_password, accountData.account_password)) {
     delete accountData.account_password
     const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
     if(process.env.NODE_ENV === 'development') {
       res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
       } else {
         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
       }
     return res.redirect("/account/")
     }
    } catch (error) {
     return new Error('Access Forbidden')
    }
   }

module.exports = {accountLogout, changePassword, buildUpdateAccount, updateAccount, buildAccount, accountLogin, buildLogin, buildRegistration, registerAccount }
