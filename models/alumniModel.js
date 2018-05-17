const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var AlumniModel = new Schema({
	name : { type : String, required : true },
    email : { type : String, required : true, unique : true },
    address : { type : String, required : true },
    occupation : { type : String, required : true },
    batchOfYear : { type : Number, required : true },
    course : { type : String, required : true },
    photo : { type : String },
    designation : { type : String },
    typeOfAlumni : { type : String }, // Life Member or Patreon
    emailSent : { type : Boolean }
},{
	timestamps: { 
		createdAt: 'createdAt',
		updatedAt: 'updatedAt' 
	}
});

module.exports = AlumniModel;