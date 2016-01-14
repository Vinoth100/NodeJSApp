/**
 Node js App for Employee CRUD (Create,Read,Update and Delete) on MongoDB.
*/

// Express JS - NodeJS Web App Framework 
var express = require('express');

// Mongoose - Monogodb driver
var mongoose = require('mongoose');

// Express application object
var app = express();

// To read the POST operation data 
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// database connection URL
var dbURL =  'mongodb://localhost/test';

// Connect to the Database - Single connection throughout the application
mongoose.connect(dbURL);

console.log('Connected to DB');

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
var empModel = mongoose.model('employee', empSchema);


//Add new employee
app.post('/employee', function (req, res) {
	
	var instance = new empModel();
	instance.id = req.body.id;
	instance.name = req.body.name;
	instance.location = req.body.location;
	instance.dob = req.body.date;
	
	empModel.findOne({id:req.body.id},function(err,data){
		if(err) console.error(err);
		
		if(!data || data.length === 0){
				instance.save(function(err){console.error(err);});
				res.send('Inserted');
		}else res.send('Employee already exist');
	
	});
	


	console.log('After save');

   //res.send(instance) ;
    
});

// Update one record
app.put('/employee', function(req,res){
	var empModel = mongoose.model('employee', empSchema);
	
	var update = {name:req.body.name};
	empModel.findOneAndUpdate({id:req.body.id}, update,function(err,list){ 
		if(err) console.error(err);
		//list.remove();
		if (!list || list.length ===0) {res.send('Employee not found');}
		else res.send('Updated ' + list);
	});
	
	//res.send(req.params.id);
});


// Delete one record
app.delete('/employee/:id', function(req,res){
	var empModel = mongoose.model('employee', empSchema);
		
	empModel.findOneAndRemove({id:req.params.id},function(err,list){ 
		if(err) console.error(err);
		//list.remove();
		if (!list || list.length ===0) {res.send('Employee not found');}
		else res.send('Deleted ' + list);
	});
	
	//res.send(req.params.id);
});


//mongoose.disconnect();
// Get all employee list
app.get('/employee', function (req, res) {
var empModel = mongoose.model('employee', empSchema);
empModel.find(function(err,data){ console.log(data); res.send(data);});
 
});

app.listen(3000, function () {
  console.log('Employee app listening on port 3000!');
})
