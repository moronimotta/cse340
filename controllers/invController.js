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
    let className = "No vehicles found"
    
    if (data.length > 0) {
      className = data[0].classification_name + " vehicles"
    }
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    
    res.render("./inventory/classification", {
      title: className,
      nav,
      tools,
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
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    let nav = await utilities.getNav()
    res.render("./inventory/detail", {
      title: "Inventory Detail",
      nav,
      tools,
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
    const classificationSelect = await utilities.buildClassificationList()
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      tools,
      classificationSelect,
    })
  } catch (error) {
    next(error)
  }
}

// Add Classifications
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getAdminNav()
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      tools,
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
    const accountData = res.locals.accountData
    let tools = await utilities.buildTools(accountData)
    let classifications = await utilities.buildClassificationList ()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      tools,
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId)
  let nav = await utilities.getAdminNav()

  const accountData = res.locals.accountData
  let tools = await utilities.buildTools(accountData)


  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemData[0].inv_make ,
    nav,
    tools,
    inv_id: inv_id,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}


invCont.triggerError = function(req, res, next) {
  try {
    throw new Error('Intentional error triggered');
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if(invData) {
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }

  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  let tools = await utilities.buildTools(accountData)

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/edit/" + inv_id)
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemData[0].inv_make ,
    nav,
    tools,
    classifications: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getAdminNav()
  const accountData = res.locals.accountData
  let tools = await utilities.buildTools(accountData)
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id, true)
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemData[0].inv_make ,
    nav,
    tools,
    inv_id: inv_id,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getAdminNav()
  const inv_id = req.body.inv_id

  const accountData = res.locals.accountData
  let tools = await utilities.buildTools(accountData)

  const deleteResult = await invModel.deleteInventory(inv_id)
  if (deleteResult) {
    req.flash("notice", `The item was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("./inventory/delete-confirm", {
      title: "Edit " + itemData[0].inv_make ,
    nav,
    tools,
    classifications: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont