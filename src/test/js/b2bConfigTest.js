var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/target/framework/js/';
var configLocation = currentWorkingDir + '/src/main/js/';

var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ configLocation, frameworkLocation] );

describe("b2bConfigTest",function() {


	// spy object to replace console
	var console;

	beforeEach(function() {
		console = jasmine.createSpyObj('console',
				[ 'debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency','options' ]);
		console.debug = function(msg) {
			print(msg);
		};
	});

	it("testNoSandboxConfig", function() {
					
		var apiConfig;
		try {
			var util = require("Util.js");
			// pass name and version s null as they are used to construct name of config file. during test the file doesn't contain these name components.
			apiConfig = util.loadApiConfig(frameworkLocation, configLocation, "PublicSandbo", "","", console);
		} catch(e) {
			console.debug(e);
		}

		expect(apiConfig).toBeNull();
	});
	
	it("testSandboxConfig", function() {
				
		
		var util = require("Util.js");
		
		console.debug(util);

		var apiConfig = util.loadApiConfig(frameworkLocation, configLocation, "b2b", "","", console);
		
		console.debug(apiConfig);
		expect(apiConfig.name).toEqual("${artifactId}");
		expect(apiConfig.version).toEqual("${api.version}");				
	});
});
