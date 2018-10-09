var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongoose = require("mongoose");
const multer = require("multer");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);

var routes = require("./routes/routes");

var app = express();

//Connecting to the Database
var db = mongoose.createConnection("mongodb://mongo:27017/mainDb", {
  useMongoClient: true
});

db.once("open", function() {
  console.log("Database is Open in");
});

//Setting View and Dependencies
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Setting the Session in Mongo Store
app.use(
  session({
    secret: "hello",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: "mongodb://mongo:27017/sessions",
      ttl: 60 * 60 * 2
    }), //2 Hours Time to live
    cookie: { secure: false }
  })
);

//Routing the Requests
app.use("/", routes);

//Error Handlers
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error", {
    title: "Error 404 | SMC"
  });
});

module.exports = app;
