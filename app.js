/**
 Node js App for Employee CRUD (Create,Read,Update and Delete) on MongoDB.
*/

// Express JS - NodeJS Web App Framework 
var express = require('express');

// Express application object
var app = express();

// File system module
var fs= require('fs');

// Application configuration file
var configurationFile = './config/configuration.json';

// Application configuration object 
var configuration;

// Mongoose - Monogodb driver
var mongoose = require('mongoose');

// Employee Schema and Model
var empModel = require('./schema/employee.js');

// Employee DAO for CRUD operations
var employeeDAO = require('./dao/employeeDAO.js');



// Centralized logging
var appLog = require('./logging/log.js');

// To read the POST operation data 
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/*
readAppConfiguration method reads the configuration file and stores in global configuration object.
**/
var readAppConfiguration = function(){

    try{
	configuration = JSON.parse(
			fs.readFileSync(configurationFile)
		);
	
	}catch(err){
	   appLog.log('ERROR','Exiting app,Error reading config file'+err);
	   process.exit(0);
	}
}



/*
validateDbConfiguration - checks the configuration value and returns true 

**/
var validateDbConfiguration = function(){


	if ((configuration.server || configuration.server.length > 0) && (configuration.database || configuration.database.length > 0)){
	   if(configuration.port ||  configuration.port.length > 0){
			   var pattern = /^[0-9]{1,5}$/; // Pattern for port number 
		       try{
				var result = pattern.test(configuration.port);
				return result;
			   }catch(err){
				 Applog.log('ERROR',err);
				 return false;
			   }
			   
	  }
	}


}

/*
   getDbUrl method returns a mongodb connection URL
   Example: 'mongodb://localhost/test'
*/
var getDbUrl = function(){

	var url='';

	//if ((configuration.server || configuration.server.length > 0) && (configuration.database || configuration.database.length > 0)) {
	
	if(validateDbConfiguration() === true) {
		url = 'mongodb://';		
		url += configuration.server+':'+configuration.port+'/'+configuration.database;
	
	}else {
		throw 'Check the server and database configuration value';
	}

	return url;
}

// Connect to database
var connectDB = function(){

	try{
		// Connect to the Database - Single connection throughout the application
		var url = getDbUrl();

		mongoose.connect(url);

		// CONNECTION EVENTS
		// If the connection throws an error
		mongoose.connection.on('error',function (err) {
		appLog.log('INFO','Mongoose default connection error: ' + err);
		appLog.log('INFO','Closing the application');
		process.exit(0);
		});
		

		// When successfully connected
		mongoose.connection.on('connected', function () {
		appLog.log('INFO','Mongoose default connection open to ' + url);
		});

		
		// When the connection is disconnected
		mongoose.connection.on('disconnected', function () {
		appLog.log('INFO','Mongoose default connection disconnected');
		});

	}
	catch(err){
		appLog.log('INFO','Error connecting to DB:'+err);
		// Exit the App 
		process.exit();
	}
}

// Read Application configuration
readAppConfiguration();

// Connect to DB.
connectDB();

// Get all employee list
app.get('/employee', function (request, response) {

employeeDAO.getAllEmployees(response);
//console.log(empList+'hi');
//response.send(empList);

/*  try {  	
  var empList = employeeDAO.getAllEmployees();
  
  if (empList.length ===0){
	response.send('No records found');
  }else{
  	response.send('Found records');
  }
  } catch(err){
	response.send('Error occurred:' + err);
  }*/
});


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
	


	appLog.log('INFO','After save');

   //res.send(instance) ;
    
});

// Update one record
app.put('/employee', function(req,res){
	
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
			
	empModel.findOneAndRemove({id:req.params.id},function(err,list){ 
		if(err) console.error(err);
		//list.remove();
		if (!list || list.length ===0) {res.send('Employee not found');}
		else res.send('Deleted ' + list);
	});
	
	//res.send(req.params.id);
});



app.listen(3000, function () {
  appLog.log('INFO','Employee app listening on port 3000!');
})
