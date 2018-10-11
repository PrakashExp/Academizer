//Getting the Dependencies
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

//Setting the Schema and Importing the Models
const facilitySchema = require("../models/index");

const upload = require("../config/multer-config");

var facilityStuff = {
  addGenFacility: function(req, res, next) {
    var database = mongoose.createConnection("localhost:27017/facility"); //Connection
    var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
    var newGenfacility = new facility({
      title: req.body.title,
      description: req.body.desc
    });
    var promise = newGenfacility.save(function(err) {
      if (err) {
        res.status(400).send({
          message: "There was an error while Adding facility"
        });
      } else {
        res.status(200).send({
          message: "facility Successfully Added!"
        });
      }
    });
  },
  getGenfacility: function(req, res, next) {
    var database = mongoose.createConnection("localhost:27017/facility"); //Connection
    var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
    facility.find({}, function(err, records) {
      if (err) throw err;
      if (records.length > 0) {
        res.status(200).send({
          message: "Records Found!",
          records: records
        });
      } else {
        res.status(400).send({
          message: "Records Not Found!"
        });
      }
    });
  },
  deleteGenfacility: function(req, res, next) {
    var database = mongoose.createConnection("localhost:27017/facility"); //Connection
    var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
    facility.find({ _id: req.body.id }).remove(function(err) {
      if (err) {
        res.status(400).send({
          message: "There was an Error ! Try again after sometime!"
        });
      } else {
        res.status(200).send({
          message: "facility Successfully Deleted !"
        });
      }
    });
  },
  editGenfacility: function(req, res, next) {
    var database = mongoose.createConnection("localhost:27017/facility"); //Connection
    var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
    var data = {
      title: req.body.title,
      description: req.body.desc
    };
    facility.findOneAndUpdate(
      { _id: req.body.id },
      data,
      { upsert: true },
      function(err, results) {
        if (err)
          res.status(404).send({
            message: "There was an error!"
          });
        else {
          res.status(200).send({
            message: "Successfully Edited!"
          });
        }
      }
    );
  },
  uploadGenfacilityImg: function(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        res.end(err);
      } else {
        var id = req.body.id;
        var database = mongoose.createConnection("localhost:27017/facility");
        var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
        if (typeof req.file == undefined || req.file == null) {
          res.status(404).send({
            message: "There was an Error with the Image, Chose any other!"
          });
        } else {
          var data = {
            photos: req.file.filename
          };
          facility.update({ _id: id }, { $push: data }, function(err, results) {
            if (err) {
              res.status(404).send({
                message: "There was an Error with the Image, Chose any other!"
              });
            } else {
              res.status(200).send({
                message: "Image Successfully Updated"
              });
            }
          });
        }
      }
    });
  },
  deleteGenfacilityImage: function(req, res, next) {
    var id = req.body.id;
    var database = mongoose.createConnection("localhost:27017/facility");
    var facility = database.model("generalfacility", facilitySchema.news); //Alumni Model
    var data = { photos: req.body.photo };
    facility.update({ _id: id }, { $pull: data }, function(err, results) {
      if (err) throw err;
      else filePath = path.join(__dirname, "../uploads", data.photos);
      fs.unlinkSync(filePath);
      res.status(200).send({
        message: "Image Successfully Deleted"
      });
    });
  }
};

module.exports = facilityStuff;
