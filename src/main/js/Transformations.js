/**
 * API Version : ${api.version}
 */


/**
 * Masks the given string based on regular expressions
 * @param str String to be masked
 */
exports.mask = function(str) {
	var maskedStr = str;
	
	// Mask credit card account number
	maskedStr = maskedStr.replace(/\b(\d{12})(\d{4})\b/ig, 'xxxxxxxxxxxx$2');	
	// Mask reference number
	maskedStr = maskedStr.replace(/(?:"(refNum|referenceNumber)"\s*:\s*")\b(\d{4})\d+(\d{4})\b/ig, '"$1": "$2xxxxxxxx$3');
	
	return maskedStr;
}

exports.transactionsPreTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("transactionsPreTransform Entry");
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	
	var accountId = apim.getvariable('request.parameters.accountNo');
	
	var value = {
			  "acctTrnInqRq": {
				    "additionalProperties": {},
				    "anzacctId": {
				      "acctId": accountId,
				      "acctNo": accountId,
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
	
	api.logger.debug("transactionsPreTransform Exit");
		
	return value;		
}


exports.transactionsPostTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("transactionsPostTransform Entry");
	
	var data = apim.getvariable('message.body');
	if(data != null && data.errorCode != null) {
		return api.generateBusinessError(frameworkLocation, apim, 'Oracle MSL', data.errorCode);
	}
	
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	 
	var template = {
			Transactions: ['$.acctTrnInqRs.bankAcctTrnRec', {
	            referenceNumber: '$.refNum',
	            transactionDate: '$.trnDt',
	            processedDate: '$.postedDt',
	            type: '$.trnType',
	            amount: '$.amt',
	            shortDescription: '$.desc1',
	            detailedDescription: '$.desc2',
	            runningBalance: '$.runningBal',
	            cardUsed: '$.cardUsed'
			  }]
			};
	
	
	var ret = transformer.transform(data, template);
	api.logger.debug("transactionsPostTransform Exit");
		
	return ret;		
}
