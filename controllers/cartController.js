const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require('../utilities/index');
const storeModel = require('../models/store-model');
const bcrypt = require("bcryptjs");
const e = require("connect-flash");


// build checkout view
async function buildCheckout(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;

    let tools = await utilities.buildTools(accountData);

    if (!accountData) {
        req.flash("notice", "You must be logged in to checkout.")
        return res.redirect("/account/login")
    }

    // get cookie cart
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];


    table = await utilities.buildCheckoutTable(cart);


    if (accountData.account_type === "Admin" || accountData.account_type === "Manager") {
        nav = await utilities.getAdminNav()
    }

    res.render("shop/checkout", {
        title: "Checkout",
        nav,
        tools,
        table,
    })
}

// checkout
async function checkout(req, res, next) {

    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    if (cart.length === 0) {
        req.flash("notice", "Cart is empty.");
        return res.redirect("/store");
    }

    let storeItems = JSON.parse(req.cookies.storeItems);


    storeItems.forEach(async item => {
        try {
            await storeModel.updateStock(item.id, item.amount);
        } catch (err) {
            req.flash("notice", "Error updating stock.");
            return res.redirect("/store");
        }
    });

    res.clearCookie("cart");

    req.flash("notice", "Thank you for your purchase.");
    res.redirect("/");

}

// add item to cart
async function addItem(req, res, next) {

    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    const itemId = parseInt(req.params.id, 10);

    let storeItems = JSON.parse(req.cookies.storeItems);
    const newItem = storeItems.find(item => item.id === itemId);

    if (!newItem) {
        req.flash("notice", "Item not found.");
        return res.redirect("/store");
    }

    if (newItem.amount === 0) {
        req.flash("notice", "Item out of stock.");
        return res.redirect("/store");
    } else {
        const index = storeItems.findIndex(item => item.id === itemId);
        storeItems[index].amount -= 1;
        res.cookie("storeItems", JSON.stringify(storeItems));
    }

    cart.push(newItem);

    res.cookie("cart", JSON.stringify(cart));

    req.flash("notice", "Item added to cart. " + newItem.name);

    return res.json({
        success: true,
        message: "Item added to cart. " + newItem.name,
        accessories,
        parts
    });
}


// accessories view
async function buildAccessories(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;

    let tools = await utilities.buildTools(accountData);

    if (!accountData) {
        req.flash("notice", "You must be logged in to view accessories.")
        return res.redirect("/account/login")
    }
}


module.exports = {
    buildCheckout,
    addItem,
    buildAccessories,
    checkout
}