const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = '<ul class="nav-list">';
  list += '<li><a href="/" class="nav-link" title="Home page">Home</a></li>';
  list += '<li><a href="/store/" class="nav-link" title="Visit our store">Store</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list += '<a href="/inv/type/' + row.classification_id + '" class="nav-link" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + '</a>';
    list += '</li>';
  });
  list += '</ul>';
  return list;
};


Util.getAdminNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let list = '<ul class="nav-list">';
  list += '<li><a href="/" class="nav-link" title="Home page">Home</a></li>';
  list += '<li><a href="/store/" class="nav-link" title="Visit our store">Store</a></li>';
  data.rows.forEach((row) => {
    list += '<li>';
    list += '<a href="/inv/type/' + row.classification_id + '" class="nav-link" title="See our inventory of ' + row.classification_name + ' vehicles">' + row.classification_name + '</a>';
    list += '</li>';
  });
  list += '<li><a href="/inv/add-classification" class="nav-link" title="Add a new vehicle classification">Add Classification</a></li>';
  list += '<li><a href="/inv/add-inventory" class="nav-link" title="Add a new vehicle to inventory">Add Inventory</a></li>';
  list += '</ul>';
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img id="details-img" src="' + vehicle.inv_image
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetail = async function (data) {
  let detail = '';
  if (data.length > 0) {
    detail = '<div id="inv-detail">';
    data.forEach(vehicle => {
      detail += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>';
      detail += '<img id="details-img" src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />';
      detail += '<p><strong>Price:</strong> ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicle.inv_price) + '</p>';
      detail += '<p><strong>Year:</strong> ' + vehicle.inv_year + '</p>';
      detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>';
      detail += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'; detail += '<p><strong>Details:</strong> ' + vehicle.inv_description + '</p>';
    });
    detail += '</div>';
  }
  return detail;
};

Util.buildTopHeader = async function (req, res, next) {
  let topHeader = '<header id="top-header">';
  topHeader += '<div class="container">';
  topHeader += '<div class="row">';
  topHeader += '<div class="col-6">';
  topHeader += '<span class="siteName">';
  topHeader += '<a href="/" title="Return to home page">CSE Motors</a>';
  topHeader += '</span>';
  topHeader += '</div>';
  topHeader += '<div class="col-6">';
  topHeader += '<div id="tools">';
  if (res.locals.loggedin) {
    topHeader += '<a class="nav-link" title="Click to access your account" href="/account/">Welcome ' + res.locals.username + '</a> ';

    topHeader += '<a class="nav-link" title="Click to log out" href="/account/logout">Logout</a>';
  } else {
    topHeader += '<a class="nav-link" title="Click to log in" href="/account/login">My Account</a>';
  }
  topHeader += '</div>';
  topHeader += '</div>';
  topHeader += '</div>';
  topHeader += '</div>';
  topHeader += '</header>';

  return topHeader;
};

Util.buildClassificationList = async function (classification_id = null, readonly = false) {
  let data = await invModel.getClassifications()
  let classificationList = ''
  if (readonly) {
    classificationList = '<select name="classification_id" id="classificationList" required disabled>'
  } else {
    classificationList = '<select name="classification_id" id="classificationList" required>'
  }
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}


/* ****************************************
* Middleware For Handling Errors
* Wrap other function in this for 
* General Error Handling
**************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}


/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

//  checkUpdateData
Util.checkUpdateData = (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  if (account_firstname && account_lastname && account_email) {
    next()
  } else {
    req.flash("notice", "Please fill in all fields.")
    return res.redirect("/account/update")
  }
}

// checkIfPasswordMatches
Util.checkIfPasswordMatches = (req, res, next) => {

  const { new_pwd } = req.body
  const accountData = res.locals.accountData
  const passwordMatch = bcrypt.compareSync(new_pwd, accountData.account_password)
  if (!passwordMatch) {
    req.flash("notice", "Current password is incorrect.")
    return res.redirect("/account/update")
  }

  if (new_pwd === confirm_pwd) {
    next()
  } else {
    req.flash("notice", "Passwords do not match.")
    return res.redirect("/account/update")
  }
}

/* ****************************************
*  Check Authorization
* ************************************ */
Util.checkAuthorization = (req, res, next) => {
  if (res.locals.accountData) {
    if (res.locals.accountData.account_type != "Client") {
      next()
    } else {
      req.flash("notice", "You are not authorized. Maybe you have a different login?")
      if (res.locals.loggedin) {
        return res.redirect("/account")
      } else {
        return res.redirect("/account/login")
      }
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.buildTools = async function (account) {
  let tools = '<div id="tools">'
  if (account) {
    tools += '<a class="nav-link" title="Click to access your account" href="/account/"><span>Welcome, ' + account.account_firstname + '</span></a> '
    tools += '<a class="nav-link" title="Click to log out" href="/account/logout">Logout</a>'
  } else {
    tools += '<a class="nav-link" title="Click to log in" href="/account/login">My Account</a>'
  }
  tools += '</div>'
  return tools
}


Util.buildProductCard = function (data) {
  if (data.length === 0) {
    return '<p>No items in stock</p>';
  }

  title = data[0].category_name;

  let cards = `<h2>${title}</h2>`;

  data.forEach((item) => {
    item.price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price);
    cards += `

      <div class="product-card">
        <img src="/${item.img_path}" alt="${item.name}">
        <div class="product-card-content">
          <h3>${item.name}</h3>
          <p class="price">${item.price}</p>
          <p class="amount">In
          stock: ${item.amount}</p>
        <button id="${item.id}">Add to Cart</button>
        </div>
      </div>

    `;
  })

  return cards;
}

Util.buildCheckoutTable = function (data) {
  if (data.length === 0) {
    return '<p>No items in cart</p>';
  }

  let table = `
    <table id="inventoryDisplay">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
 
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;

  data.forEach((item) => {
    const formattedPrice = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price);
    total += parseFloat(item.price);
    table += `
      <tr>
        <td>${item.name}</td>
        <td>${formattedPrice}</td>
      </tr>
    `;
});

  total = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);

  table += `
      </tbody>
    </table>
    <p>Total: ${total}</p>
  `;

  return table;
}


module.exports = Util