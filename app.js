const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const routes = require("./routes/routes");

const app = express();

//Connecting to the Database
const db = mongoose.createConnection("mongodb://mongo:27017/mainDb", {
  useMongoClient: true
});

db.once("open", () => {
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
