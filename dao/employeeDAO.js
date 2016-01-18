//Employe DB access for CRUD operation

var empModel = require('../schema/employee.js');

// Get all employee list
exports.getAllEmployees = function(response){

	empModel.find(function(err,empList){
		if (err) {
			throw err;
		}
		console.log('Read success');
                response.send(empList);
		//return empList;
	});


}



