const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var gallerySchema = new Schema({
	title : { type : String, required : true },
	photos : [{ type : String}]
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = gallerySchema;