var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/target/framework/js/';
var configLocation = currentWorkingDir + '/src/main/js/';

var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ configLocation, frameworkLocation] );

describe("TransformationsTest",function() {

	// spy object to replace console
	var console;
	var apim;
	var config = [
	              {name:"/users",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users"}]},
	              {name:"/users/all",methods:[{name:"GET", targetUrl:"https://randomuser.me/api/users/all"}]}
	             ];

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency','options' ]);
		apim = jasmine.createSpyObj('apim',['getvariable']);
		
		var log = function(msg) {
			print(msg);
		}
				
		console.info.and.callFake(log);
		console.notice.and.callFake(log);
		console.debug.and.callFake(log);
	});

	it("testTransformRequestMessageBody", function() {

		try {
			var transformations = require("Transformations.js");
			var api = require("Api.js").newApi(frameworkLocation,"api","1.0.0", config, require('Logger.js').newLogger(7, console));
			
			// mock body to transform
			var body = {
					  some: {
						    crazy: [
						      {
						        example: 'A'
						      },
						      {
						        example: 'B'
						      }
						    ]
						  }
						};
			
			apim.getvariable.and.callFake(function(variable) {			
				return body;
			});			
			
			var result = transformations.transformRequestMessageBody(frameworkLocation, api, apim);
			var expectedResults = '{"foo":[{"bar":"A"},{"bar":"B"}]}';
			var actualResults = JSON.stringify(result);
			
			expect(expectedResults).toBe(actualResults);
			
			console.info(actualResults);

			expect(apim.getvariable).toHaveBeenCalledWith('message.body');

		} catch(e) {
			console.debug(e);
		}
	});
	
});
