/*
 Centralized logging
**/

/*
log(severity,message) - Logs to console based on the severity
*/
exports.log = function(severity, message){
	
	var logMessage='';
	logMessage = new Date(); 
	logMessage += severity +'-'+message;
	if(severity === 'ERROR'){
	 console.error(logMessage);
	}else{
	 console.log(logMessage);
	}

}