const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var facultySchema = new Schema({
    image : { type : String },
	name : { type : String, required : true },
	description : { type : String, required : true },
	qualification : { type : String, required : true },
	designation : { type : String, required : true },
	doj : { type : String, required : true, default: Date.now },
	achievement : {
		achCat : { type : String },
		achDesc : String
	}
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = facultySchema;