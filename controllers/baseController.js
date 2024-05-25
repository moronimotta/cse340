const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()

  const accountData = res.locals.accountData
  let tools = await utilities.buildTools(accountData)
  // req.flash("notice", "This is a flash message.")
  
  res.render("index", {title: "Home", nav, tools})
}

module.exports = baseController