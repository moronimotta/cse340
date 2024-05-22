const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    next(error)
  }
}

/* ***************************
  *  Build inventory detail view
  * ************************** */
invCont.buildInventoryDetail = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryDetail(inventory_id)
    const detail = await utilities.buildDetail(data)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: "Inventory Detail",
      nav,
      detail,
    })
  } catch (error) {
    next(error)
  }
}

// Inventory Management
invCont.buildInventoryManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getAdminNav()
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

// Add Classifications
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getAdminNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addClassification = async function (req, res) {
  try {
    const { classification_name } = req.body

    if (!classification_name.match(/^[a-zA-Z0-9]+$/)) {
      req.flash("notice", "Classification name must be alphanumeric.")
      res.redirect("/inv/add-classification")
      return
    }

    await invModel.addClassification(classification_name)

    req.flash("notice", "Classification " + classification_name + " added.")
    res.redirect("/inv/add-classification")
  } catch (error) {
    req.flash("notice", "Error adding classification.")
    res.redirect("/inv/add-classification")
  }
}

// Add Inventory
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getAdminNav()
    let classifications = await utilities.buildClassificationList ()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classifications,
    })
  } catch (error) {
    next(error)
  }
}

invCont.addInventory = async function (req, res) {
  try {
    const { inv_make, inv_model, inv_year, inv_color, inv_price, classification_id, inv_description, inv_miles } = req.body
    const inv_image = "/images/vehicles/no-image.png"
    const inv_thumbnail = "/images/vehicles/no-image-tn.png"
    await invModel.addInventory(inv_make, inv_model, inv_year, inv_color, inv_price, parseInt(classification_id), inv_image, inv_thumbnail, inv_description, inv_miles)
    req.flash("notice", "Inventory item added.")
    res.redirect("/inv/add-inventory")
  } catch (error) {
    req.flash("notice", "Error adding inventory item.")
    res.redirect("/inv/add-inventory")
  }
}


invCont.triggerError = function(req, res, next) {
  try {
    throw new Error('Intentional error triggered');
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = invCont