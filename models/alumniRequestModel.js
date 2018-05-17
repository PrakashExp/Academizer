const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AlumniRequest = new Schema({
	name : { type : String, required : true },
    email : { type : String, required : true, unique : true },
    address : { type : String, required : true },
    occupation : { type : String, required : true },
    batchOfYear : { type : Number, required : true },
    course : { type : String, required : true }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = AlumniRequest;