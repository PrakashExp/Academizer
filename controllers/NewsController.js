//Getting the Dependencies
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const url = require("url");
const fs = require("fs");
const path = require("path");

//Setting the Schema and Importing the Models
const Schema = mongoose.Schema;
const NewsSchema = require("../models/index");

const upload = require("../config/multerConfig");

var newsStuff = {
	addGenNotification : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("Notification", NewsSchema.alumniNotification); //Alumni Model
        var newAlumniNote = new Alumni({
            notification : req.body.note,
            date : req.body.date
        });
        var promise = newAlumniNote.save(function(err){
            if(err){ 
                res.status(400).send({
                    message : "There was an error while Adding Notification"
                });
            }
            else{
                res.status(200).send({
                    message : "Notification Successfully Added!"
                })
            }
        });
    },
    getGenNotifications : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("Notification", NewsSchema.alumniNotification); //Alumni Model
        Alumni.find({},function(err, records){
            if(err) throw err;
            if(records.length > 0){
                res.status(200).send({
                    message : "Records Found!",
                    records : records
                });
            }
            else{
                res.status(400).send({
                    message : "Records Not Found!"
                }); 
            }
        })
    },
    deleteGenNotification : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("Notification", NewsSchema.alumniNotification); //Alumni Model
        Alumni.find({ _id : req.body.id }).remove(function(err){
            if(err){ 
                res.status(400).send({
                    message : "There was an Error ! Try again after sometime!"
                });
            }
            else{
                res.status(200).send({
                    message : "Notification Successfully Deleted !"
                })
            }
        });
    },
    editGenNotification : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("Notification", NewsSchema.alumniNotification); //Alumni Model
        var data = {
            notification : req.body.note,
            date : req.body.date
        };
        Alumni.findOneAndUpdate({ _id : req.body.id }, data, { upsert : true }, function(err, results){
            if(err) 
                res.status(404).send({
                    message : "THere was an error!"
                })
            else{
                res.status(200).send({
                    message : "Successfully Edited!"
                });
            }
        })
    },
    addGenNews : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("News", NewsSchema.news); //Alumni Model
        var newAlumniNews = new Alumni({
            title : req.body.title,
            description : req.body.desc,
            date : req.body.date
        });
        var promise = newAlumniNews.save(function(err){
            if(err){ 
                res.status(400).send({
                    message : "There was an error while Adding News"
                });
            }
            else{
                res.status(200).send({
                    message : "News Successfully Added!"
                })
            }
        });
    },
    getGenNews : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("News", NewsSchema.news); //Alumni Model
        Alumni.find({},function(err, records){
            //if(err) throw err;
            if(records.length > 0){
                res.status(200).send({
                    message : "Records Found!",
                    records : records
                });
            }
            else{
                res.status(400).send({
                    message : "Records Not Found!"
                }); 
            }
        })
    },
    deleteGenNews : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("News", NewsSchema.news); //Alumni Model
        Alumni.find({ _id : req.body.id }).remove(function(err){
            if(err){ 
                res.status(400).send({
                    message : "There was an Error ! Try again after sometime!"
                });
            }
            else{
                res.status(200).send({
                    message : "News Successfully Deleted !"
                })
            }
        });
    },
    editGenNews : function(req, res, next){
        var database = mongoose.createConnection('localhost:27017/mainDb'); //Connection
        var Alumni = database.model("News", NewsSchema.news); //Alumni Model
        var data = {
            title : req.body.title,
            description : req.body.desc,
            date : req.body.date
        };
        Alumni.findOneAndUpdate({ _id : req.body.id }, data, { upsert : true }, function(err, results){
            if(err) 
                res.status(404).send({
                    message : "THere was an error!"
                })
            else{
                res.status(200).send({
                    message : "Successfully Edited!"
                });
            }
        })
    },
    uploadGenNewsImg : function(req,res,next){
        upload(req, res, function (err) {
            if (err) {
              res.send("error");
              throw err;
            }
            else{
                var id = req.body.id;
                var dept = mongoose.createConnection('localhost:27017/mainDb');
                var News = dept.model("News", NewsSchema.news);
                if( typeof req.file == undefined || req.file == null ){
                    res.status(404).send({
                        message : "There was an Error with the Image, Chose any other!"
                    });
                }
                else{
                    var data = { photos : req.file.filename };
                    News.update({ _id : id }, { $push : data }, function(err, results){
                        if(err) {
                            res.status(404).send({
                                message : "There was an Error with the Image, Chose any other!"
                            })
                        }
                        else{res.status(200).send({
                                message : "News Successfully Updated"
                            });
                        }
                    });
                } 
            }
        })
    },
    deleteGenNewsImg : function(req, res, next){
        var dept = mongoose.createConnection('localhost:27017/mainDb');
        var News = dept.model("News", NewsSchema.news);
        var data = { photos : req.body.title };
        News.update({ _id : req.body.id }, { $pull : data }, function(err, results){
            if(err){
                res.status(400).send({
                    message : "There was an error!"
                });
            }
            else{
                filePath = path.join(__dirname,"../uploads",req.body.title);
                fs.unlinkSync(filePath);
                res.status(200).send({
                    message : "News Successfully Updated"
                });
            }
        });
    }
}

module.exports = newsStuff;