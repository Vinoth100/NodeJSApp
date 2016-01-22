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
**/

/* findOneAndUpdate - Update ONLY employee name into the employee DB


var update = {name:req.body.name};
	empModel.findOneAndUpdate({id:req.body.id}, update,function(err,list){ 
		if(err) console.error(err);
		if (!list || list.length ===0) {res.send('Employee not found');}
		else res.send('Updated ' + list);
	});
**/

exports.findOneAndUpdate = function(employee,callback){
	//console.log('DAO update:'+ employee);
	var query = {"id":employee.id};	
	var update={name:employee.name};

	//console.log(query+':'+update);

	empModel.findOneAndUpdate(query,update,function(err,employee){

	   if (err){
		
		callback(err);
	   }

	   if(!employee || employee.length===0){
		console.log('Emp not found');
		callback('Employee not found');
	   }
	   else{
		console.log('Emp updated');
	   	callback(null,'Employee updated in db');
	   }
		
	});
}

/*
 insertEmployee - Insert employee into the DB   
 **/
exports.insertEmployee = function(employee, callback){
    employee.save(function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, 'Employee successfully inserted in db');
        }
    });
}

// New method which gets the employee for the given id
// - Which is essentially was in your insertEmployee method
exports.findEmployeeById = function(employeeId, callback){
    console.log('Emp id:'+employeeId);
 	
    empModel.findOne({id:employeeId},function(err,employee){
        if(err || !employee || employee.length === 0) {
            // err or employee is Null. Creating artificial error to captured at the callback.
	    if (!err) {
		err='Employee does not exist';
	    }
	    callback(err);
        } else {
            callback(null, employee);
        }
    });
}

