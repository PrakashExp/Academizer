const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var adminModel = new Schema({
	name : { type : String, required : false },
    username : { type : String, required : true },
    password : { type : String, required : true }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = adminModel;