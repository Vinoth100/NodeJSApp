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
/*
insertEmployee - Insert employee into the DB   
**/
exports.insertEmployee = function(employee, response){

   	
	empModel.findOne({id:employee.id},function(err,data){
			if(err) console.error(err);
			
			if(!data || data.length === 0){
					employee.save(function(err){console.error(err);});
					response.send('Inserted');
			}else {
				response.send('Employee already exist');
			}
		
		});

}



