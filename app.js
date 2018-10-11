const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();

//Connecting to the Database
const db = mongoose.createConnection(process.env.MONGO_URL, {
  useMongoClient: true
});

db.once("open", () => {
  console.log("Database is connected");
});

//Setting View and Dependencies
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Setting the Session in Mongo Store
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      url: process.env.MONGO_SESSION,
      ttl: 60 * 60 * 2
    }), //2 Hours Time to live for session
    cookie: { secure: false }
  })
);

//Routing the Requests
app.use("/", routes);

//Error Handlers
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error", {
    title: "Error 404 | SMC"
  });
});

module.exports = app;
