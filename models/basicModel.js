const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var basicDeptSchema = new Schema({
	name : { type : String, required : true },
    nameInDb : { type : String, required : true },
	description : { type : String, required : true },
	highlights : [ { type : String } ]
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = basicDeptSchema;