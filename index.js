const express = require("express");
const bodyparser = require("body-parser");
const path = require("path");
const app = express();

var Publishable_Key = "pk_test_F5UFRy9rcym7iLRTtaH55jGu";
var Secret_Key = "sk_test_Czcmd6nNU3pu0sUjKGT3TYAf";

const stripe = require("stripe")(Secret_Key);

const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("Home", {
    key: Publishable_Key,
  });
});

app.post("/payment", function (req, res) {
  // Moreover you can take more details from user
  // like Address, Name, etc from form
  stripe.customers
    .create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: "Eke Emmanuel",
      address: {
        line1: "12 Main Street lagos",
        postal_code: "110092",
        city: "lagos state",
        state: "lagos",
        country: "nigeria",
      },
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: 7000, // price for the product
        description: "Web Development Product",
        currency: "USD",
        customer: customer.id,
      });
    })
    .then((charge) => {
      res.send("Success"); // If no error occurs
    })
    .catch((err) => {
      res.send(err); // If some error occurs
    });
});

app.listen(port, function (error) {
  if (error) throw error;
  console.log("Server created Successfully");
});
