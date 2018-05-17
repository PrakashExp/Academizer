const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var deptIndexSchema = new Schema({
    name : { type : String, required : true },
    nameInDb : { type : String, required : true, unique : true },
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = deptIndexSchema;