const express = require("express");
const validator = require("express-validator");
const mustacheExpress = require("mustache-express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(validator());

app.use(session({
  secret: 'asdfasdf',
  resave: false,
  saveUninitialized: false
}));

app.engine("mustache", mustacheExpress());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "mustache");

app.get("/", function(req, res) {
  res.render("index");
});
//its working now!!!!!!!!!!!
app.get("/login", function(req, res) {
  res.render("login");
});

let users = [{username: "khalidabdullahi", password: "abc1234"}];
let messages = [];

app.post("/login", function(req, res) {
  let loggedUser;
  messages = [];


  users.forEach(function(user){
    if (user.username === req.body.username) {
      loggedUser = user;
    }
  });


  req.checkBody("username", "Please Enter a valid username.").notEmpty().isLength({min: 6, max: 20});
  req.checkBody("password", "Please Enter a Password.").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    errors.forEach(function(error) {
      messages.push(error.msg);
    });
    res.render("login", {errors: messages});
  } else {

    req.session.username = req.body.username;

    res.redirect("/user");
  }

  res.redirect("/user");
});

app.get("/user", function(req, res) {
  res.render("user", {username: req.session.username});
});

app.listen(3000, function() {
  console.log("App is running on localhost:3000");
});
