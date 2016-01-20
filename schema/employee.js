// Mongoose library
var mongoose = require('mongoose');

//Schema object
var Schema = mongoose.Schema;
 
//empSchema Defining employee table structure
var empSchema = new Schema({
    id	    : Number,	
    name     : String,
    location : String,
    dob      : Date
});

// Registering employee table with the model
module.exports = mongoose.model('employee', empSchema);
