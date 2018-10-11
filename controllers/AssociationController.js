//Getting the Dependencies
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const path = require("path");

//Setting the Schema and Importing the Models
const AssocSchema = require("../models/index");

//Setting Uploading Configuration
const upload = require("../config/multer-config");

var AdminStuff = {
  createAssoc: function(req, res, next) {
    var databaseName = req.body.nameInDb,
      assocName = req.body.name,
      assocDesc = req.body.desc;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var Basic = dept.model("basicInfo", AssocSchema.basic);
    var newAssoc = new Basic({
      name: assocName,
      nameInDb: databaseName,
      description: assocDesc
    });
    var promise = newAssoc.save(function(err) {
      if (err) throw err;
      else {
        var mainDb = mongoose.createConnection("localhost:27017/mainDb");
        var Index = mainDb.model("assocIndex", AssocSchema.deptIndex);
        var index = new Index({
          name: assocName,
          nameInDb: databaseName
        });
        var promise = index.save(function(err) {
          if (err) throw err;
          else {
            res.status(200).send({
              message: assocName + " Association was Successfully Created"
            });
          }
        });
      }
    });
  },
  getAssocList: function(req, res, next) {
    var mainDb = mongoose.createConnection("localhost:27017/mainDb");
    var Index = mainDb.model("assocIndex", AssocSchema.deptIndex);
    Index.find({}, function(err, records) {
      if (records.length > 0) {
        res.status(200).send({
          message: "Associations Found",
          data: records
        });
      } else {
        res.status(404).send({
          message: "No Associations Found"
        });
      }
    });
  },
  getBasic: function(req, res, next) {
    var deptName = req.body.databaseName;
    var dept = mongoose.createConnection("localhost:27017/" + deptName);
    var Basic = dept.model("basicInfo", AssocSchema.basic);
    Basic.find({}, function(err, records) {
      if (records.length > 0) {
        res.status(200).send({
          message: "Records Found",
          data: records
        });
      } else {
        res.status(404).send({
          message: "No Associations Found"
        });
      }
    });
  },
  getPeople: function(req, res, next) {
    var databaseName = req.body.dbname;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var Faculty = dept.model("members", AssocSchema.faculty);
    Faculty.find({}, function(err, records) {
      if (records.length > 0) {
        res.status(200).send({
          message: "Records Found",
          content: records
        });
      } else {
        res.status(404).send({
          message: "No Records Found"
        });
      }
    });
  },
  getNews: function(req, res, next) {
    var databaseName = req.body.dbname;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var News = dept.model("news", AssocSchema.news);
    News.find({}, function(err, records) {
      if (records.length > 0) {
        res.status(200).send({
          message: "Records found",
          data: records
        });
      } else {
        res.status(404).send({
          message: "No Records Found"
        });
      }
    });
  },
  editAssoc: function(req, res, next) {
    var dept = mongoose.createConnection(
      "localhost:27017/" + req.body.nameInDb
    );
    var Basic = dept.model("basicInfo", AssocSchema.basic);
    var updatedRecords = {
      description: req.body.desc
    };
    Basic.findOneAndUpdate(
      { nameInDb: req.body.nameInDb },
      updatedRecords,
      { upsert: true },
      function(err, results) {
        if (err) {
          res.status(404).send({
            message: "There was an error!",
            dbname: req.body.nameInDb
          });
        } else {
          res.status(200).send({
            message: "Association Successfully Updated",
            dbname: req.body.nameInDb
          });
        }
      }
    );
  },
  deleteAssoc: function(req, res, next) {
    var name = req.body.dbname;
    var url = "mongodb://localhost:27017/" + name;
    MongoClient.connect(
      url,
      function(err, db) {
        if (err) throw err;
        db.dropDatabase(function(err, result) {
          if (err) throw err;
          else {
            var mainDb = mongoose.createConnection("localhost:27017/mainDb");
            var Index = mainDb.model("assocIndex", AssocSchema.deptIndex);
            Index.find({ nameInDb: name }).remove(function(err) {
              if (err) throw err;
              else {
                res.status(200).send({
                  message: "Database Successfully removed"
                });
              }
            });
          }
          db.close();
        });
      }
    );
  },
  addAssocMember: function(req, res, next) {
    var name = req.body.name;
    var desc = " ";
    var qual = " ";
    var desig = req.body.desig;
    var doj = " ";
    var databaseName = req.body.dbname;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var Faculty = dept.model("members", AssocSchema.faculty);
    var newFaculty = new Faculty({
      image: "defaultImg.jpg",
      description: desc,
      name: name,
      qualification: qual,
      designation: desig,
      doj: doj
    });
    var promise = newFaculty.save(function(err) {
      if (err) {
        throw err;
      } else {
        res.status(200).send({
          message: "Member " + name + " Successfully Added"
        });
      }
    });
  },
  editAssocMember: function(req, res, next) {
    var dept = mongoose.createConnection("localhost:27017/" + req.body.dbname);
    var Faculty = dept.model("members", AssocSchema.faculty);
    var data = {
      name: req.body.name,
      designation: req.body.desig
    };
    Faculty.findOneAndUpdate(
      { _id: req.body.id },
      data,
      { upsert: true },
      function(err, results) {
        if (err) throw err;
        else {
          res.status(200).send({
            message: "Member Successfully Updated"
          });
        }
      }
    );
  },
  deleteMember: function(req, res, next) {
    var databaseName = req.body.dbname;
    var id = req.body.id;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var Faculty = dept.model("members", AssocSchema.faculty);
    Faculty.find({ _id: id }).remove(function(err) {
      if (err) throw err;
      else {
        Faculty.find({}, function(err, records) {
          if (records.length > 0) {
            res.status(200).send({
              message: "Member Successfully deleted"
            });
          } else {
            res.status(400).send({
              message: "Member Successfully deleted"
            });
          }
        });
      }
    });
  },
  uploadMemberImg: function(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        res.end(err);
      } else {
        var databaseName = req.body.dbname;
        var id = req.body.id;
        var dept = mongoose.createConnection("localhost:27017/" + databaseName);
        var Faculty = dept.model("members", AssocSchema.faculty);
        if (typeof req.file == undefined || req.file == null) {
          res.status(404).send({
            message: "There was an Error with the Image, Chose any other!"
          });
        } else {
          var imageContent = {
            image: req.file.filename
          };
          Faculty.findOneAndUpdate(
            { _id: id },
            imageContent,
            { upsert: true },
            function(err, results) {
              if (err)
                res.status(404).send({
                  message: "There was an Error with the Image, Chose any other!"
                });
              else {
                res.status(200).send({
                  message: "Image SuccessFully Updated"
                });
              }
            }
          );
        }
      }
    });
  },
  addAssocNews: function(req, res, next) {
    var title = req.body.title;
    var desc = req.body.desc;
    var databaseName = req.body.dbname;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var News = dept.model("news", AssocSchema.news);
    var newNews = new News({
      title: title,
      description: desc
    });
    var promise = newNews.save(function(err) {
      if (err)
        res.status(404).send({
          message: "There was an Error!"
        });
      else {
        res.status(200).send({
          message: "News Successfully Added"
        });
      }
    });
  },
  deleteAssocNews: function(req, res, next) {
    var id = req.body.id;
    var databaseName = req.body.dbname;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var News = dept.model("news", AssocSchema.news);
    News.find({ _id: id }).remove(function(err) {
      if (err) throw err;
      else {
        News.find({}, function(err, records) {
          if (records.length > 0) {
            res.status(200).send({
              message: "News Successfully deleted",
              lastRecord: false
            });
          } else {
            res.status(400).send({
              message: "News Successfully deleted",
              lastRecord: true
            });
          }
        });
      }
    });
  },
  editAssocNews: function(req, res, next) {
    var id = req.body.id;
    var databaseName = req.body.dbname;
    var title = req.body.title;
    var desc = req.body.desc;
    var data = {
      title: title,
      description: desc
    };
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var News = dept.model("news", AssocSchema.news);
    News.findOneAndUpdate({ _id: id }, data, { upsert: true }, function(
      err,
      results
    ) {
      if (err) throw err;
      else {
        res.status(200).send({
          message: "News Successfully Updated"
        });
      }
    });
  },
  uploadAssocNewsImg: function(req, res, next) {
    upload(req, res, function(err) {
      if (err) {
        res.send("error");
        throw err;
      } else {
        var id = req.body.id;
        var databaseName = req.body.dbname;
        var dept = mongoose.createConnection("localhost:27017/" + databaseName);
        var News = dept.model("news", AssocSchema.news);
        if (typeof req.file == undefined || req.file == null) {
          res.status(404).send({
            message: "There was an Error with the Image, Chose any other!"
          });
        } else {
          var data = { photos: req.file.filename };
          News.update({ _id: id }, { $push: data }, function(err, results) {
            if (err) {
              res.status(404).send({
                message: "There was an Error with the Image, Chose any other!"
              });
            } else {
              res.status(200).send({
                message: "News Image Successfully Updated"
              });
            }
          });
        }
      }
    });
  },
  deleteAssocNewsImage: function(req, res, next) {
    var name = req.body.photo;
    var databaseName = req.body.dbname;
    var id = req.body.id;
    var dept = mongoose.createConnection("localhost:27017/" + databaseName);
    var News = dept.model("news", AssocSchema.news);
    var data = { photos: name };
    News.update({ _id: id }, { $pull: data }, function(err, results) {
      if (err) throw err;
      else filePath = path.join(__dirname, "../uploads", name);
      fs.unlinkSync(filePath);
      res.status(200).send({
        message: "Image Successfully Deleted"
      });
    });
  }
};

module.exports = AdminStuff;
