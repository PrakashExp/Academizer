const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AlumniNotification = new Schema({
	notification : { type : String, required : true },
	date : { type : Date, required : true }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = AlumniNotification;