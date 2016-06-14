exports.statusCodes =  [{
		"httpCode" : "400",
		"status" : { 
			"statusCode" : "11029",
			"severity" : "Error",
			"statusDesc" : "Mobile Number in use for an in-progress registration"
		}
	}, {
		"httpCode" : "400",
		"status" : { 
			"statusCode" : "11040",
			"severity" : "Error",
			"statusDesc" : "GoPayAccount or pay to mobile number is not set"
		}
	}, {
		"httpCode" : "400",
		"status" : { 
			"statusCode" : "Unknown",
			"severity" : "Error",
			"statusDesc" : "Internal Error"
		}
	}];

exports.maps = [{
		"provider" : "Oracle MSL",
		"codes" : [{
			"code" : "80063",
			"statusCode" : "11029"
		}, {
			"code" : "80064",
			"statusCode" : "11040"
		}]
	}];

