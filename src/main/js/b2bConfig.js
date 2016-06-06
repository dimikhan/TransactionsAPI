/**
 * API Version : ${api.version}
 */
var name="${artifactId}";
var version="${api.version}";
var logLevel=7;

var config = [
              {name:"getPosts",
            	  methods:[
            	           {name:"GET", targetUrl:"http://api-springboot.mybluemix.net/operate/add/51/57"}
            	           ]
              },
              {name:"getPostById",
            	  methods:[
            	           {name:"GET", targetUrl:"http://jsonplaceholder.typicode.com/posts/{id}"}
            	           ]
              },
              {name:"getPostComments",
            	  methods:[
            	           {name:"GET", targetUrl:"http://jsonplaceholder.typicode.com/posts/{id}/comments"}
            	           ]
              }                            
             ];

exports.getApiConfig = function(frameworkLocation, console) {

	var util = require(frameworkLocation + 'Util.js');
		
	return util.getApiConfig(frameworkLocation, console, name, version, config, logLevel);
}


