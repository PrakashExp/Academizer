//Getting the Dependencies
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;
const url = require("url");
const fs = require("fs");
const path = require("path");
const nodemailer = require('nodemailer');
const xoauth2 = require("xoauth2");

//Setting the Schema and Importing the Models
const Schema = mongoose.Schema;
const AlumniSchema = require("../models/index");

//Setting Uploading Configuration
const upload = require("../config/multerConfig");
const transporter = require("../config/nodemailer.js");

var alumniStuff = {
	addAlumni : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni');
		var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
		var newAlumni = new Alumni({
            name : req.body.name,
            email : req.body.email,
            address : req.body.add,
            photo : "defaultImg.jpg",
            batchOfYear : req.body.year,
            course : req.body.course,
            occupation : req.body.occ
        });
		var promise = newAlumni.save(function(err){
            if(err)
                res.status(404).send({
                    message : "This email is already registered with another user!"
                });
                // throw err;
            else
            	res.status(200).send({
                    message : "Request Successfully Sent!"
                });
        });
	},
	registerAlumni : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni');
        var Request = database.model("alumniRequest", AlumniSchema.alumniRequest);
        var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
		Alumni.find({ email : req.body.email },function(err, records){
			if(records.length > 0){
				res.status(404).send({
                    message : "This email is already registered with another user!"
                });
			}
			else{
				var newAlumni = new Request({
		            name : req.body.name,
		            email : req.body.email,
		            address : req.body.address,
		            batchOfYear : req.body.year,
		            course : req.body.course,
		            occupation : req.body.occupation
		        });
				var promise = newAlumni.save(function(err){
		            if(err)
		                res.status(404).send({
		                    message : "This email is already registered with another user!"
		                });
		            else
		            	res.status(200).send({
		                    message : "Request Successfully Sent!"
		                });
		        });
			}
		});
	},
	getAlumniRequest : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni');
        var Request = database.model("alumniRequest", AlumniSchema.alumniRequest);
        Request.find({} ,function(err, records) {
            if(records.length > 0){
                res.status(200).send({
                    message : "Requests Found!",
                    data : records
                });
            }
            else{
                res.status(404).send({
                    message : "No Requests Found"
                });  
            }
        });
	},
	getAlumniList : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
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
					message : "Records Not Found!",
					records : records
				});	
			}
		})
	},
	respondAlumniRequest : function(req, res, next){
		var respond = req.body.response;
		var id = req.body.id;
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
        var Request = database.model("alumniRequest", AlumniSchema.alumniRequest); //Alumni Request
        var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
        
        if( respond === true )
        	acceptRequest();
        else
        	deleteRecord(id,"","");

        function deleteRecord(id,email,idt){
        	Request.find({ _id : id }).remove(function(err){
	            if(err){ 
	            	res.status(400).send({
	            		message : "There was an Error ! Try again after sometime!"
	            	});
	            }
	            else{
	            	Request.find({ }, function(err, records){
	            		if( records.length == 0 ){
	            			res.status(200).send({
			            		message : "Action Successful",
			            		lastRecord : true
			            	})
			            	console.log(id,email);
	            		}
	            		else{
	            			res.status(200).send({
			            		message : "Action Successful",
			            		lastRecord : false
			            	})
	            		}
	            	});
	            	if(respond === true)
	            		var html = "<html><head><style>body{margin: 0; padding: 0; mso-line-height-rule: exactly; min-width: 100%;}.wrapper{display: table; table-layout: fixed; width: 100%; min-width: 620px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}body, .wrapper{background-color: #ffffff;}/* Basic */table{border-collapse: collapse; border-spacing: 0;}table.center{margin: 0 auto; width: 602px;}td{padding: 0; vertical-align: top;}.spacer,.border{font-size: 1px; line-height: 1px;}.spacer{width: 100%; line-height: 16px}.border{background-color: #e0e0e0; width: 1px;}.padded{padding: 0 24px;}img{border: 0; -ms-interpolation-mode: bicubic;}.image{font-size: 12px;}.image img{display: block;}strong, .strong{font-weight: 700;}h1,h2,h3,p,ol,ul,li{margin-top: 0;}ol,ul,li{padding-left: 0;}a{text-decoration: none; color: #616161;}.btn{background-color:#2196F3; border:1px solid #2196F3; border-radius:2px; color:#ffffff; display:inline-block; font-family:Roboto, Helvetica, sans-serif; font-size:14px; font-weight:400; line-height:36px; text-align:center; text-decoration:none; text-transform:uppercase; width:200px; height: 36px; padding: 0 8px; margin: 0; outline: 0; outline-offset: 0; -webkit-text-size-adjust:none; mso-hide:all;}/* Top panel */.title{text-align: left;}.subject{text-align: right;}.title, .subject{width: 300px; padding: 8px 0; color: #616161; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 12px; line-height: 14px;}/* Header */.logo{padding: 16px 0;}/* Logo */.logo-image{}/* Main */.main{-webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24); -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);}/* Content */.columns{margin: 0 auto; width: 600px; background-color: #ffffff; font-size: 14px;}.column{text-align: left; background-color: #ffffff; font-size: 14px;}.column-top{font-size: 24px; line-height: 24px;}.content{width: 100%;}.column-bottom{font-size: 8px; line-height: 8px;}.content h1{margin-top: 0; margin-bottom: 16px; color: #212121; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 20px; line-height: 28px;}.content p{margin-top: 0; margin-bottom: 16px; color: #212121; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 16px; line-height: 24px;}.content .caption{color: #616161; font-size: 12px; line-height: 20px;}/* Footer */.signature, .subscription{vertical-align: bottom; width: 300px; padding-top: 8px; margin-bottom: 16px;}.signature{text-align: left;}.subscription{text-align: right;}.signature p, .subscription p{margin-top: 0; margin-bottom: 8px; color: #616161; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 12px; line-height: 18px;}</style></head><body><center class='wrapper'> <table class='top-panel center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='title' width='300'>St. Mary's Shirva</td><td class='subject' width='300'><a class='strong' href='#' target='_blank'>www.smcshirva.com</a></td></tr><tr> <td class='border' colspan='2'>&nbsp;</td></tr></tbody> </table> <div class='spacer'>&nbsp;</div><table class='main center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='column'> <div class='column-top'>&nbsp;</div><table class='content' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padded'> <h1>St. Mary's Alumni Association</h1> <span><strong>Congratulations</strong><br><br>Your request to be the Alumni of St. Mary's College is verified and accepted by the admin. But there are few things that you need to do in order to save your name among he alumni list of the college<br><br><center>This is your unique ID <h1>"+ idt +"</h1> </span> Follow these steps to register your name! </center> <ol> <li> Present this ID which is generated in the St. Mary's Office. This ID identifies your request uniquely.</li><li> After verification, you will be told about the furthur proceedings. </ol> <br><br><center> <h1>Welcome to the Family</h1> <span>We will look forward for your arrival</span> </center> <br><br><p style='text-align:center;'><a href='#' class='btn'>Go to the Website</a></p><p class='caption'>This is a caption text in main email body.</p></td></tr></tbody> </table> <div class='column-bottom'>&nbsp;</div></td></tr></tbody> </table> <div class='spacer'>&nbsp;</div><table class='footer center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='border' colspan='2'>&nbsp;</td></tr><tr> <td class='signature' width='300'> <p> With best regards,<br>St. Mary's Alumni Association<br>+0 (000) 00-00-00, Velan Max<br></p><p> Support: <a class='strong' href='mailto:#' target='_blank'>support@smcshirva.com</a> </p></td><td class='subscription' width='300'> <div class='logo-image'> <a href='https://zavoloklom.github.io/material-design-iconic-font/' target='_blank'><img src='https://zavoloklom.github.io/material-design-iconic-font/icons/mstile-70x70.png' alt='logo-alt' width='70' height='70'></a> </div><p> <a class='strong block' href='#' target='_blank'> Unsubscribe </a> <span class='hide'>&nbsp;&nbsp;|&nbsp;&nbsp;</span> <a class='strong block' href='#' target='_blank'> Account Settings </a> </p></td></tr></tbody> </table></center></body></html>";
	            	else
	            		var html = "<html><head><style>/* This styles you should add to your html as inline-styles *//* You can easily do it with http://inlinestyler.torchboxapps.com/ *//* Copy this html-window code converter and click convert button *//* After that you can remove this style from your code */ body{margin: 0; padding: 0; mso-line-height-rule: exactly; min-width: 100%;}.wrapper{display: table; table-layout: fixed; width: 100%; min-width: 620px; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}body, .wrapper{background-color: #ffffff;}/* Basic */table{border-collapse: collapse; border-spacing: 0;}table.center{margin: 0 auto; width: 602px;}td{padding: 0; vertical-align: top;}.spacer,.border{font-size: 1px; line-height: 1px;}.spacer{width: 100%; line-height: 16px}.border{background-color: #e0e0e0; width: 1px;}.padded{padding: 0 24px;}img{border: 0; -ms-interpolation-mode: bicubic;}.image{font-size: 12px;}.image img{display: block;}strong, .strong{font-weight: 700;}h1,h2,h3,p,ol,ul,li{margin-top: 0;}ol,ul,li{padding-left: 0;}a{text-decoration: none; color: #616161;}.btn{background-color:#2196F3; border:1px solid #2196F3; border-radius:2px; color:#ffffff; display:inline-block; font-family:Roboto, Helvetica, sans-serif; font-size:14px; font-weight:400; line-height:36px; text-align:center; text-decoration:none; text-transform:uppercase; width:200px; height: 36px; padding: 0 8px; margin: 0; outline: 0; outline-offset: 0; -webkit-text-size-adjust:none; mso-hide:all;}/* Top panel */.title{text-align: left;}.subject{text-align: right;}.title, .subject{width: 300px; padding: 8px 0; color: #616161; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 12px; line-height: 14px;}/* Header */.logo{padding: 16px 0;}/* Logo */.logo-image{}/* Main */.main{-webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24); -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24); box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);}/* Content */.columns{margin: 0 auto; width: 600px; background-color: #ffffff; font-size: 14px;}.column{text-align: left; background-color: #ffffff; font-size: 14px;}.column-top{font-size: 24px; line-height: 24px;}.content{width: 100%;}.column-bottom{font-size: 8px; line-height: 8px;}.content h1{margin-top: 0; margin-bottom: 16px; color: #212121; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 20px; line-height: 28px;}.content p{margin-top: 0; margin-bottom: 16px; color: #212121; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 16px; line-height: 24px;}.content .caption{color: #616161; font-size: 12px; line-height: 20px;}/* Footer */.signature, .subscription{vertical-align: bottom; width: 300px; padding-top: 8px; margin-bottom: 16px;}.signature{text-align: left;}.subscription{text-align: right;}.signature p, .subscription p{margin-top: 0; margin-bottom: 8px; color: #616161; font-family: Roboto, Helvetica, sans-serif; font-weight: 400; font-size: 12px; line-height: 18px;}</style></head><body><center class='wrapper'> <table class='top-panel center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='title' width='300'>St. Mary's Shirva</td><td class='subject' width='300'><a class='strong' href='#' target='_blank'>www.smcshirva.com</a></td></tr><tr> <td class='border' colspan='2'>&nbsp;</td></tr></tbody> </table> <div class='spacer'>&nbsp;</div><table class='main center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='column'> <div class='column-top'>&nbsp;</div><table class='content' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='padded'> <center> <h1>St. Mary's Alumni Association</h1> We regret to inform you that your request to be St. Mary's alumni has been rejected. No worries. You can still be in touch with us. We need upur support <br><br><h1>Always Welcome to the St. Mary's Family</h1> </center> <br><br><p style='text-align:center;'><a href='#' class='btn'>Go to the Website</a></p><p class='caption'>Have a nice day.</p></td></tr></tbody> </table> <div class='column-bottom'>&nbsp;</div></td></tr></tbody> </table> <div class='spacer'>&nbsp;</div><table class='footer center' width='602' border='0' cellspacing='0' cellpadding='0'> <tbody> <tr> <td class='border' colspan='2'>&nbsp;</td></tr><tr> <td class='signature' width='300'> <p> With best regards,<br>St. Mary's Alumni Association<br>+0 (000) 00-00-00, Velan Max<br></p><p> Support: <a class='strong' href='mailto:#' target='_blank'>support@smcshirva.com</a> </p></td><td class='subscription' width='300'> <div class='logo-image'> <a href='https://zavoloklom.github.io/material-design-iconic-font/' target='_blank'><img src='https://zavoloklom.github.io/material-design-iconic-font/icons/mstile-70x70.png' alt='logo-alt' width='70' height='70'></a> </div><p> <a class='strong block' href='#' target='_blank'> Unsubscribe </a> <span class='hide'>&nbsp;&nbsp;|&nbsp;&nbsp;</span> <a class='strong block' href='#' target='_blank'> Account Settings </a> </p></td></tr></tbody> </table></center></body></html>";
	            	alumniStuff.sendMail(
	            		"<"+email+">",
	            		"Alumni Approval",
	            		html
	            	);
	            }
	        });
        }

        function acceptRequest(){
        	Request.find({ _id : id }, function(err, records){
	            if(err){ 
	            	res.status(400).send({
	            		message : "There was an Error! Try again after sometime!"
	            	});
	            }
	            else{
	            	data = {
	                	name : records[0].name,
	                	email : records[0].email,
	                	address : records[0].address,
	                	occupation : records[0].occupation,
	                	batchOfYear : records[0].batchOfYear,
	                	course : records[0].course,
	                	photo : "defaultImg.jpg",
	                	designation : null,
	                	typeOfAlumni : "Patreon",
	                	emailSent : true
	                };
	                idToDelete = records[0]._id;
	                var newAlumni = new Alumni(data);
	                var promise = newAlumni.save(function(err, res){
	    				if(err){ 
			            	res.status(400).send({
			            		message : "Alumni with same email address is already Registered!"
			            	});
			            }
			            else{
			            	deleteRecord(idToDelete,data.email,res._id);
			            }
	    			});
				}
        	});
        }
	},
	deleteSelectedAlumni : function(req, res, next){
		var id = req.body.id;
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
		Alumni.find({ _id : id }).remove(function(err){
            if(err){ 
            	res.status(400).send({
            		message : "There was an Error ! Try again after sometime!"
            	});
            }
            else{
            	res.status(200).send({
            		message : "Alumni Successfully Deleted !"
            	})
            }
        });
	},
	editSelectedAlumni : function(req, res, next){
		var data = {
			name : req.body.name,
			address : req.body.address,
			occupation : req.body.occupation,
			typeOfAlumni : req.body.typeOfAlumni,
			designation : req.body.designation,
			batchOfYear : req.body.batchOfYear,
			course : req.body.course
		};
		var id = req.body.id;
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
		Alumni.findOneAndUpdate({ _id : id }, data, { upsert : true }, function(err, results){
            if(err) 
            	res.status(400).send({
            		message : "There was an Error!"
            	});
            else
            	res.status(200).send({
            		message : "Information Updated !"
            	});
        });
	},
	uploadAlumniImg : function(req, res, next){
		upload(req, res, function (err) {
            if (err) {
              res.end(err);
            }
            else{
                var id = req.body.id;
                var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
				var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
                if( typeof req.file == undefined || req.file == null ){
                    res.status(404).send({
                        message : "There was an Error with the Image, Chose any other!"
                    });
                }
                else{
                    var imageContent = {
                        photo : req.file.filename
                    };
                    Alumni.findOneAndUpdate({ _id : id }, imageContent, { upsert : true }, function(err, results){
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
	sendMail : function(to, subject, html){
		console.log(to,subject);
		var mailOptions = {
			from: '"St. Mary\'s Authority - Alumni Registeration" <smconline.authority@gmail.com>',
		    to: '<'+ to +'>',
		    subject: subject,
		    html: html,
		    auth: {
		        user: 'smconline.authority@gmail.com',
		        refreshToken: '1/-D3NW2unyQUJcEOdVGsEVI0LMiQRmpuqv63H0eQeloIjqH9x_OrlnygegVd_9_ge',
		        accessToken: 'ya29.GltjBdt5zj9orMORrUsOWOvAVXlKiuP4wZcjpbn_Wg-rnyuxr5xqfYwNNCFOSd5dVrbDcKDLyRtDD1-f3IkTPXs-gYAwTU2kygTBceGFRw16gBVm5uM5c10dvi55',
		        expires: 1484314697598
		    }
		}

		transporter.sendMail(mailOptions,function(err, info){
			if(err)
				console.log(err);
			console.log(info);
		});
	},
	addAlumniNotification : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNotification", AlumniSchema.alumniNotification); //Alumni Model
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
	getAlumniNotifications : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNotification", AlumniSchema.alumniNotification); //Alumni Model
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
	deleteAlumniNotification : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNotification", AlumniSchema.alumniNotification); //Alumni Model
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
	editAlumniNotification : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNotification", AlumniSchema.alumniNotification); //Alumni Model
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
	addAlumniNews : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNews", AlumniSchema.news); //Alumni Model
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
	getAlumniNews : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNews", AlumniSchema.news); //Alumni Model
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
	deleteAlumniNews : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNews", AlumniSchema.news); //Alumni Model
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
	editAlumniNews : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniNews", AlumniSchema.news); //Alumni Model
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
	getAlumniIDDetails : function(req, res, next){
		var database = mongoose.createConnection('localhost:27017/alumni'); //Connection
		var Alumni = database.model("alumniModel", AlumniSchema.alumniModel); //Alumni Model
		Alumni.find({ _id : req.body.id },function(err, records){
			if(err) throw err;
			if(records.length > 0){
				res.status(200).send({
					message : "Records Found!",
					records : records
				});
			}
			else{
				res.status(400).send({
					message : "Records Not Found!",
					records : records
				});	
			}
		})
	},
	uploadAlumniNewsImg : function(req, res, next){
		upload(req, res, function (err) {
            if (err) {
              res.send("error");
              throw err;
            }
            else{
                var id = req.body.id;
                var dept = mongoose.createConnection('localhost:27017/alumni');
                var News = dept.model("alumniNews", AlumniSchema.news);
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
	deleteAlumniNewsImage : function(req, res, next){
		var dept = mongoose.createConnection('localhost:27017/alumni');
        var News = dept.model("alumniNews", AlumniSchema.news);
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
};

module.exports = alumniStuff;