const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var rohschema = new Schema({
	name : { type : String, required : true },
    event : { type : String, required : true },
    year : { type : Number, required : true },
    level : { type : String, required : true }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = rohschema;