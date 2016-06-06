/**
 * API Version : ${api.version}
 */

var name="${artifactId}";
var version="${api.version}";
var logLevel=7;

var config = [
              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
             ];

exports.getApiConfig = function(frameworkLocation, console) {

	var util = require(frameworkLocation + 'Util.js');
		
	return util.getApiConfig(frameworkLocation, console, name, version, config, logLevel);
}


