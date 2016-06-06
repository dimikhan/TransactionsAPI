/**
 * API Version : ${api.version}
 */

exports.transformRequestMessageBody = function(frameworkLocation,api,apim) {

	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	 
	var template = {
	  foo: ['$.some.crazy', {
	    bar: '$.example'
	  }]
	};
	
	var data = apim.getvariable('message.body');
		
	return transformer.transform(data, template);		
}

exports.transactionsPreTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("transactionsPreTransform Entry");
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	 
	var value = {
			  "acctTrnInqRq": {
				    "additionalProperties": {},
				    "anzacctId": {
				      "acctId": "string",
				      "acctNo": "string",
				      "acctType": "string",
				      "additionalProperties": {}
				    },
				    "anztraceInfo": {
				      "additionalProperties": {},
				      "branchId": "string",
				      "effDt": "string",
				      "initCompany": "string",
				      "operatorId": "string",
				      "origApp": "string",
				      "terminalId": "string"
				    },
				    "custId": {
				      "additionalProperties": {},
				      "custPermId": "string"
				    },
				    "incDetail": "string",
				    "recCtrlIn": "string",
				    "rqUID": "string",
				    "selRangeDt": {
				      "additionalProperties": {},
				      "endDt": "string",
				      "startDt": "string"
				    }
				  },
				  "additionalProperties": {}
				};
	
	//var data = apim.getvariable('message.body');
	//var ret = transformer.transform(data, template);
	api.logger.debug("transfomed body= " + JSON.stringify(value));
	api.logger.debug("transactionsPreTransform Exit");
		
	return value;		
}
