// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const {
  getUserByEmail
} = require('./db/database')

const stripe = require('stripe')('sk_test_jtfqKWVP9pjeYFF65CewtswD00sqjK02iA');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// PG database client/connection setup
const {
  Pool
} = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

let cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: ['1']
}));
// const KeySecret = sk_test_jtfqKWVP9pjeYFF65CewtswD00sqjK02iA
// const KeyPublishable = pk_test_vzAvHy9DyOYmnXgn5fLZ3YEZ00xwGEz8Pv

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const menuRoutes = require("./routes/menu");
const ordersRoutes = require("./routes/orders");
const menu_ordersRoutes = require("./routes/menu_orders");
const smsRoutes = require("./routes/sms");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/menu", menuRoutes(db));
app.use("/api/orders", ordersRoutes(db, stripe));
app.use("/api/menu_orders", menu_ordersRoutes(db));
app.use("/sms", smsRoutes(client, db));
app.use("/sms/sms-response", smsRoutes());
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index", {
    userCookie: req.session.userCookie
  });
  // console.log(userCookie)
});
app.get("/login/:user_email", (req, res) => {
  let userEmail = req.params.user_email;

  if (getUserByEmail(userEmail, db)) {
    // res.cookie('userCookie', userEmail)
    req.session.userCookie = userEmail;
    //console.log(req.session.userCookie);
    res.redirect("/");
  }

});

app.get("/api/menu_orders", (req, res) => {

  req.session.order = order

  // console.log(userCookie)
});

app.post('/logout', (req, res) => {
  req.session = null;

  res.redirect('/');
 });

 app.post('/sms/receive', function(req, res) {
  // var twilio = require('twilio');
  // var twiml = new twilio.twiml.MessagingResponse();

  // if (req.body.Body == 'hello') {
  //   twiml.message('Hi!');
  // }
  // twiml.message('The Robots11 are coming! Head for the hills!');
  // res.writeHead(200, {'Content-Type': 'text/xml'});
  // res.end(twiml.toString());
 });

//  const stripe = require('stripe')('sk_test_jtfqKWVP9pjeYFF65CewtswD00sqjK02iA');
// const stripe = require('stripe')('sk_test_jtfqKWVP9pjeYFF65CewtswD00sqjK02iA');
// (async () => {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: 1000,
//     currency: 'cad',
//     payment_method_types: ['card'],
//     receipt_email: 'jenny.rosen@example.com',
//    //  sucess_url: '/',
//    //  cancel_url: '/'
//   }).then( res => console.log(res.id));
// })();


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys

