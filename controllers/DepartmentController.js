//Getting the Dependencies
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const url = require("url");
const fs = require("fs");
const path = require("path");

//Setting the Schema and Importing the Models
const Schema = mongoose.Schema;
const DeptSchema = require("../models/index");

//Setting Uploading Configuration
const upload = require("../config/multerConfig");

var AdminStuff = {
    
    //Creating the Department
    createDepartment : function(req, res, next){
        var databaseName = req.body.nameInDb,
            deptName = req.body.deptName,
            deptDesc = req.body.deptDesc;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Basic = dept.model("basicInfo", DeptSchema.basic);     
        var newDept = new Basic({
            name : deptName,
            nameInDb : databaseName,
            description : deptDesc
        });
        var promise = newDept.save(function(err){
            if(err)
                res.status(404).send({
                    message : "There was an Error!"
                });
            else
            {
                var mainDb = mongoose.createConnection('localhost:27017/mainDb');
                var Index = mainDb.model("deptIndex", DeptSchema.deptIndex);     
                var index = new Index({
                    name : deptName,
                    nameInDb : databaseName,
                });
                var promise = index.save(function(err){
                    if(err)
                        res.status(404).send({
                            message : "There was an Error!"
                        });
                    else
                    {
                        res.status(200).send({
                            message : deptName+" Department was Successfully Created"
                        })
                    }
                });
            }
        });
    },
    
    //Fetch The Departments from Dept Index
    fetchDepartments : function(req, res, next){
        var mainDb = mongoose.createConnection('localhost:27017/mainDb');
        var Index = mainDb.model("deptIndex", DeptSchema.deptIndex);
        Index.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Databases Found",
                    data : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Databases Found"
                });  
            }
        });
    },
    
    //Fetch the Department information from the selected department
    fetchSelectedDept : function(req, res, next){
        var deptName = req.body.deptName;
        var dept = mongoose.createConnection('localhost:27017/'+deptName);
        var Basic = dept.model("basicInfo", DeptSchema.basic);
        Basic.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Records Found",
                    data : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Databases Found"
                });  
            }
        });
    },
    
    //Delete the selected department
    deleteSelectedDept : function(req, res, next){
        var name = req.body.deptName;
        var url = "mongodb://localhost:27017/"+name;
        MongoClient.connect(url, function(err, db) {
            if (err) 
                throw err;
            db.dropDatabase(function(err, result){
                if (err) 
                    throw err;
                else{
                    var mainDb = mongoose.createConnection('localhost:27017/mainDb');
                    var Index = mainDb.model("deptIndex", DeptSchema.deptIndex);
                    Index.find({ nameInDb : name }).remove(function(err){
                        if(err) throw err
                        else{
                            res.status(200).send({
                                message : "Database is Successfully removed"
                            });
                        }
                    })
                }
                db.close();
            });
        });
    },
    
    //Edit the selected department
    editSelectedDept : function(req, res, next){
        var deptName = req.body.deptName;
        var high1 = req.body.high1;
        var high2 = req.body.high2;
        var high3 = req.body.high3;
        //console.log(deptName);
        //var newDeptName = req.body.newDeptName;
        //var newNameInDb = req.body.newNameInDb;
        var newDeptDesc = req.body.newDeptDesc;       
        var updatedRecords = {
            //name : newDeptName,
            //nameInDb : newNameInDb,
            description : newDeptDesc,
            highlights : [ high1, high2, high3 ]
        }
        var dept = mongoose.createConnection('localhost:27017/'+deptName);
        var Basic = dept.model("basicInfo", DeptSchema.basic);
        Basic.findOneAndUpdate({ "nameInDb" : deptName }, updatedRecords, { upsert : true }, function(err, results){
            if(err) throw err;
            else{
                /*var mainDb = mongoose.createConnection('localhost:27017/mainDb');
                var Index = mainDb.model("deptIndex", DeptSchema.deptIndex);
                var updatedRecords = {
                    name : newDeptName,
                    nameInDb : newNameInDb
                };
                Index.findOneAndUpdate({ "nameInDb" : deptName }, updatedRecords, { upsert : true }, function(err, results){
                    if(err) throw err;
                    else{

                    }
                });*/
                res.status(200).send({
                    message : "Database Successfully Updated"
                });
            }
        });
    },
    
    //Add the Faculty
    addFaculty : function(req, res, next){
        var name = req.body.name;
        var desc = req.body.desc;
        var qual = req.body.qual;
        var desig = req.body.desig;
        var doj = req.body.doj;
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        var newFaculty = new Faculty({
            image : "defaultImg.jpg",
            description : desc,
            name : name,
            qualification : qual,
            designation : desig,
            doj : doj
        });
        var promise = newFaculty.save(function(err){
            if(err){
                throw err;
                /*res.status(400).send({
                    message : "There was an Error!"
                });*/
            }
            else
            {
                res.status(200).send({
                    message : "Faculty "+ name +" Successfully Registered"
                })
            }
        });
    },
    
    //Get Faculty information
    getFaculty : function(req, res, next){
        var databaseName = req.body.deptName;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        Faculty.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Records Found",
                    content : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Records Found",
                });  
            }
        });
    },
    
    //Delete faculty information
    deleteFaculty : function(req, res, next){
        var databaseName = req.body.dept;
        var id = req.body.id;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        Faculty.find({ _id : id }).remove(function(err){
            if(err) throw err
            else{
                Faculty.find({} ,function(err, records) {
                    if( records.length > 0 ){
                        res.status(200).send({
                            message : "Faculty Successfully deleted",
                            lastRecord : false
                        })
                    }
                    else{
                        res.status(200).send({
                            message : "Faculty Successfully deleted",
                            lastRecord : true
                        })
                    }
                })
            }
        })
    },
    
    //Edit Faculty Information
    updateFaculty : function(req, res, next){
        var facName = req.body.name;
        var facDesc = req.body.desc;
        var facQual = req.body.qualification;
        var facDesig = req.body.designation;
        var facDate = req.body.date;
        var deptName = req.body.dept;
        var facId = req.body.id;
        var data = {
            name : facName,
            description : facDesc,
            qualification : facQual,
            designation : facDesig,
            doj : facDate
        };
        var dept = mongoose.createConnection('localhost:27017/'+deptName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        Faculty.findOneAndUpdate({ _id : facId }, data, { upsert : true }, function(err, results){
            if(err) throw err;
            else{res.status(200).send({
                    message : "Faculty Successfully Updated"
                });
            }
        });  
    },
    
    //Add Faculty achievement
    addAchievement : function(req, res, next){
        var id = req.body.id;
        var deptName = req.body.dept;
        var title = req.body.title;
        var desc = req.body.desc;
        var data = {
            achCat : title,
            achDesc : desc 
        };
        var delData = {
            achCat : title
        };
        var dept = mongoose.createConnection('localhost:27017/'+deptName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        Faculty.update({ _id : id }, { $pull :{ achievement: delData } }, function(err, results){
            Faculty.update({ _id : id }, { $push :{ achievement: data } }, function(err, results){
                if(err) throw err;
                else{res.status(200).send({
                        message : "Achievement Successfully Updated"
                    });
                }
            }); 
        });
    },
    
    //Delete Faculty achievement
    deleteAchievement : function(req, res, next){
        var title = req.body.title;
        var deptName = req.body.dept;
        var id = req.body.id;
        data = {
            achCat : title
        };
        var dept = mongoose.createConnection('localhost:27017/'+deptName);
        var Faculty = dept.model("faculty", DeptSchema.faculty);
        Faculty.update({ _id : id }, { $pull :{ achievement: data } }, function(err, results){
            if(err) throw err;
            else{res.status(200).send({
                    message : "Achievement Successfully Updated"
                });
            }
        });
    },
    
    //Upload Faculty image
    uploadFacultyImg : function(req,res,next){
        upload(req, res, function (err) {
            if (err) {
              res.end(err);
            }
            else{
                var databaseName = req.body.dept;
                var id = req.body.id;
                var dept = mongoose.createConnection('localhost:27017/'+databaseName);
                var Faculty = dept.model("faculty", DeptSchema.faculty);
                if( typeof req.file == undefined || req.file == null ){
                    res.status(404).send({
                        message : "There was an Error with the Image, Chose any other!"
                    });
                }
                else{
                    var imageContent = {
                        image : req.file.filename
                     };
                    Faculty.findOneAndUpdate({ _id : id }, imageContent, { upsert : true }, function(err, results){
                        if(err) 
                            res.status(404).send({
                                message : "There was an Error with the Image, Chose any other!"
                            })
                        else{
                            res.status(200).send({
                                message : "Image SuccessFully Updated"
                            });
                        }
                    })
                }
            }
        })
    },
    
    //Get Image from database
    getFacultyImg : function(req, res, next){
        var image = req.query.img;
        console.log(req.query);
        fs.readFile('./uploads/' + image, function (err, content) {
            if (err) {
                res.writeHead(400, {'Content-type':'text/html'})
                console.log(err);
                res.end("No such image");    
            } else {
                //specify the content type in the response will be an image
                res.writeHead(200,{'Content-type':'image/jpg'});
                res.end(content);
            }
        });
    },
    
    //Adding News to Database
    addNews : function(req, res, next){
        var title = req.body.title;
        var desc = req.body.desc;
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var News = dept.model("news", DeptSchema.news);
        var newNews = new News({
            title : title,
            description : desc
        });
        var promise = newNews.save(function(err){
            if(err)
                res.status(404).send({
                    message : "There was an Error!"
                });
            else
            {
                res.status(200).send({
                    message : "News Successfully Added"
                })
            }
        });
    },

    //Getting News from the database
    getNews : function(req, res, next){
        var databaseName = req.body.dept;
        console.log(databaseName);
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var News = dept.model("news", DeptSchema.news);
        News.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Records found",
                    data : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Records Found"
                });  
            }
        });
    },

    //Deleting the news
    deleteNews : function(req, res, next){
        var id = req.body.id;
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var News = dept.model("news", DeptSchema.news);
        News.find({ _id : id }).remove(function(err){
            if(err) throw err
            else{
                News.find({} ,function(err, records) {
                    if( records.length > 0 ){
                        res.status(200).send({
                            message : "News Successfully deleted",
                            lastRecord : false
                        })
                    }
                    else{
                        res.status(200).send({
                            message : "News Successfully deleted",
                            lastRecord : true
                        })
                    }
                })
            }
        })
    },

    //Updating News Image
    addNewsImg : function(req, res, next){
        upload(req, res, function (err) {
            if (err) {
              res.send("error");
              throw err;
            }
            else{
                var id = req.body.id;
                var databaseName = req.body.dept;
                var dept = mongoose.createConnection('localhost:27017/'+databaseName);
                var News = dept.model("news", DeptSchema.news);
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

    //Delete news Image
    deleteNewsImg : function(req, res, next){
        var name = req.body.name;
        var databaseName = req.body.dept;
        var id = req.body.id;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var News = dept.model("news", DeptSchema.news);
        var data = { photos : name };
        News.update({ _id : id }, { $pull : data }, function(err, results){
            if(err) throw err;
            else 
                filePath = path.join(__dirname,"../uploads",name);
                fs.unlinkSync(filePath);
                res.    status(200).send({
                    message : "Achievement Successfully Updated"
                });
        });
    },

    //Edit News
    editNews : function(req, res, next){
        var id = req.body.id;
        var databaseName = req.body.dept;
        var title = req.body.title;
        var desc = req.body.desc;
        var data = {
            title : title,
            description : desc
        };
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var News = dept.model("news", DeptSchema.news);
        News.findOneAndUpdate({ _id : id }, data, { upsert : true }, function(err, results){
            if(err) throw err;
            else{res.status(200).send({
                    message : "News Successfully Updated"
                });
            }
        });  
    },

    //Add Album
    addAlbum : function(req, res, next){
        var name = req.body.name;
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Gallery = dept.model("gallery", DeptSchema.gallery);
        var newEntry = new Gallery({
            title : name
        });
        var promise = newEntry.save(function(err){
            if(err)
                res.status(404).send({
                    message : "There was an Error!"
                });
            else
            {
                res.status(200).send({
                    message : "Gallery Successfully Created!"
                })
            }
        });
    },

    //Getting Album Details
    getAlbum : function(req, res, next){
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Gallery = dept.model("gallery", DeptSchema.gallery);
        Gallery.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Records Found",
                    data : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Records Found"
                });  
            }
        });
    },

    //Delete Entire Album
    deleteAlbum : function(req, res, next){
        var id = req.body.id;
        var databaseName = req.body.dept;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Gallery = dept.model("gallery", DeptSchema.gallery);
        Gallery.find({ _id : id }).remove(function(err){
            if(err) throw err
            else{
                Gallery.find({} ,function(err, records) {
                    if( records.length > 0 ){
                        res.status(200).send({
                            message : "Faculty Successfully deleted",
                            lastRecord : false
                        })
                    }
                    else{
                        res.status(200).send({
                            message : "Faculty Successfully deleted",
                            lastRecord : true
                        })
                    }
                })
            }
        });
    },

    //Adding images to Gallery
    addGalleryImg : function(req, res, next){
        upload(req, res, function (err) {
            if (err) {
              res.send("error");
              throw err;
            }
            else{
                var id = req.body.id;
                var databaseName = req.body.dept;
                var dept = mongoose.createConnection('localhost:27017/'+databaseName);
                var Gallery = dept.model("gallery", DeptSchema.gallery);
                if( typeof req.file == undefined || req.file == null ){
                    res.status(404).send({
                        message : "There was an Error with the Image, Chose any other!"
                    });
                }
                else{
                    var data = { photos : req.file.filename };
                    Gallery.update({ _id : id }, { $push : data }, function(err, results){
                        if(err) throw err;
                        else{res.status(200).send({
                                message : "Photo Successfully Added!"
                            });
                        }
                    });
                } 
            }
        })
    },

    //Deleting Images from Gallery
    deleteGalleryImg : function(req, res, next){
        var name = req.body.name;
        var databaseName = req.body.dept;
        var id = req.body.id;
        var dept = mongoose.createConnection('localhost:27017/'+databaseName);
        var Gallery = dept.model("gallery", DeptSchema.gallery);
        var data = { photos : name };
        Gallery.update({ _id : id }, { $pull : data }, function(err, results){
            /*News.update({ _id : id }, { $push :{ achievement: data } }, function(err, results){
                if(err) throw err;
                else{res.status(200).send({
                        message : "Achievement Successfully Updated"
                    });
                }
            });*/
            if(err) {
                res.status(404).send({
                    message : "There was an Error with the Image, Chose any other!"
                })
            }
            else 
                filePath = path.join(__dirname,"../uploads",name);
                fs.unlinkSync(filePath);
                res.status(200).send({
                    message : "Photo Successfully Updated"
                });
        });
    } 
}

module.exports = AdminStuff;