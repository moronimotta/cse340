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

invCont.triggerError = function(req, res, next) {
  try {
    throw new Error('Intentional error triggered');
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = invCont