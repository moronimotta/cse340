const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require('../utilities/index');
const storeModel = require('../models/store-model');

async function buildStore(req, res, next) {
    let nav = await utilities.getNav()
    const accountData = res.locals.accountData;
    
    let tools = await utilities.buildTools(accountData);

    if(accountData && (accountData.account_type === "Admin" || accountData.account_type === "Manager")) {
        nav = await utilities.getAdminNav()
       
    }

    if(req.cookies.storeItems) {
        storeData = JSON.parse(req.cookies.storeItems);
    }else {
        let storeData = await storeModel.getStock();
        res.cookie("storeItems", JSON.stringify(storeData));
    }


    const accessories = storeData.filter(item => item.category_name === 'Accessories');
    const parts = storeData.filter(item => item.category_name === 'Parts');
   
    acCards = await utilities.buildProductCard(accessories);
    pCards = await utilities.buildProductCard(parts);

    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    itensNumber = cart.length;

    res.render("shop/store", {
        title: "Store",
        nav,
        tools,
        acCards,
        pCards,
        itensNumber,
    })
}

module.exports = {
    buildStore,
}
