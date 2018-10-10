//Getting the Dependencies
const mongoose = require("mongoose");

//Setting the Schema and Importing the Models
const DeptSchema = require("../models/index");

var loginMethods = {
  checkAuthentication: function(req, res, next) {
    if (req.session.isLoggedIn) next();
    else res.redirect("/");
  },
  maintenance: function(req, res, next) {
    console.log(req.session);
    if (req.session.isLoggedIn) {
      res.render("maintenance");
    } else {
      next();
    }
    next();
  },
  loginRequest: function(req, res, next) {
    var user = req.body.username;
    var pass = req.body.password;
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var Admin = mainDb.model("adminCredentials", DeptSchema.admin);
    Admin.find({}, function(err, records) {
      if (records.length == 0) {
        if (user == "admin" && pass == "Admin123") {
          req.session.username = "admin";
          req.session.password = "admin";
          req.session.isLoggedIn = true;
          req.session.name = "St. Mary's Admin";
          res.status(200).send({
            url: "/admin"
          });
        } else {
          res.status(400).send({
            message: "Wrong credentials"
          });
        }
      } else {
        if (user == records[0].username && pass == records[0].password) {
          req.session.username = records[0].username;
          req.session.password = records[0].password;
          req.session.name = records[0].name;
          req.session.isLoggedIn = true;
          res.status(200).send({
            url: "/admin"
          });
        } else {
          res.status(400).send({
            message: "Wrong credentials"
          });
        }
      }
    });
  },
  logoutRequest: function(req, res, next) {
    req.session.destroy(function(err) {
      if (err)
        res.status(400).send({
          message: "Couldn't destroy the session"
        });
      else
        res.status(200).send({
          url: "/"
        });
    });
  },
  checkPresentPass: function(req, res, next) {
    var pass = req.body.pass;
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var Admin = mainDb.model("adminCredentials", DeptSchema.admin);
    Admin.find({}, function(err, records) {
      if (records.length == 0) {
        if (pass == "Admin123")
          res.status(200).send({
            message: "Password Matched"
          });
        else
          res.status(400).send({
            message: "Invalid Password"
          });
      } else {
        if (pass == records[0].password)
          res.status(200).send({
            message: "Password Matched"
          });
        else
          res.status(400).send({
            message: "Password do not match"
          });
      }
    });
  },
  changePresentPass: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var Admin = mainDb.model("adminCredentials", DeptSchema.admin);
    Admin.find({}, function(err, records) {
      if (records.length == 0) {
        var newAdmin = new Admin({
          username: req.body.user,
          password: req.body.pass
        });
        var promise = newAdmin.save(function(err) {
          if (err) {
            throw err;
            res.status(404).send({
              message: "There was an Error!"
            });
          } else {
            res.status(200).send({
              message: "Credentials successfully changed ! "
            });
          }
        });
      } else {
        Admin.find({}).remove(function(err) {
          if (err) throw err;
          else {
            var newAdmin = new Admin({
              username: req.body.user,
              password: req.body.pass
            });
            var promise = newAdmin.save(function(err) {
              if (err) {
                throw err;
                res.status(404).send({
                  message: "There was an Error!"
                });
              } else {
                res.status(200).send({
                  message: "Credentials successfully changed ! "
                });
              }
            });
          }
        });
      }
    });
  },
  addROHA: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("AcademicROH", DeptSchema.roh);
    var newROH = new ROH({
      name: req.body.name,
      event: req.body.event,
      year: req.body.year,
      level: req.body.level
    });
    var promise = newROH.save(function(err) {
      if (err) {
        throw err;
        res.status(404).send({
          message: "There was an Error!"
        });
      } else {
        res.status(200).send({
          message: "Records successfully Added ! "
        });
      }
    });
  },
  getROHA: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("AcademicROH", DeptSchema.roh);
    ROH.find({}, function(err, records) {
      if (err) throw err;
      if (records.length > 0) {
        res.status(200).send({
          message: "Records Found !",
          records: records
        });
      } else {
        res.status(404).send({
          message: "Records Not Found !",
          records: records
        });
      }
    });
  },
  deleteROHA: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("AcademicROH", DeptSchema.roh);
    ROH.find({ _id: req.body.id }).remove(function(err) {
      if (err) throw err;
      else
        res.status(200).send({
          message: "Record Successfully Deleted !"
        });
    });
  },
  editROHA: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("AcademicROH", DeptSchema.roh);
    var data = {
      name: req.body.name,
      event: req.body.event,
      year: req.body.year,
      level: req.body.level
    };
    ROH.findOneAndUpdate({ _id: req.body.id }, data, { upsert: true }, function(
      err,
      results
    ) {
      if (err) throw err;
      else {
        res.status(200).send({
          message: "Records Successfully Updated"
        });
      }
    });
  },
  addROHS: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("SportsROH", DeptSchema.roh);
    var newROH = new ROH({
      name: req.body.name,
      event: req.body.event,
      year: req.body.year,
      level: req.body.level
    });
    var promise = newROH.save(function(err) {
      if (err) {
        throw err;
        res.status(404).send({
          message: "There was an Error!"
        });
      } else {
        res.status(200).send({
          message: "Records successfully Added ! "
        });
      }
    });
  },
  getROHS: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("SportsROH", DeptSchema.roh);
    ROH.find({}, function(err, records) {
      if (err) throw err;
      if (records.length > 0) {
        res.status(200).send({
          message: "Records Found !",
          records: records
        });
      } else {
        res.status(404).send({
          message: "Records Not Found !",
          records: records
        });
      }
    });
  },
  editROHS: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("SportsROH", DeptSchema.roh);
    var data = {
      name: req.body.name,
      event: req.body.event,
      year: req.body.year,
      level: req.body.level
    };
    ROH.findOneAndUpdate({ _id: req.body.id }, data, { upsert: true }, function(
      err,
      results
    ) {
      if (err) throw err;
      else {
        res.status(200).send({
          message: "Records Successfully Updated"
        });
      }
    });
  },
  deleteRohs: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var ROH = mainDb.model("SportsROH", DeptSchema.roh);
    ROH.find({ _id: req.body.id }).remove(function(err) {
      if (err) throw err;
      else
        res.status(200).send({
          message: "Record Successfully Deleted !"
        });
    });
  }
};

module.exports = loginMethods;
