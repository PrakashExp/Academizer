 const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var newsSchema = new Schema({
	title : { type : String, required : true },
    description : { type : String, required : true },
	photos : [{ type : String}],
	date : { type : Date }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = newsSchema;