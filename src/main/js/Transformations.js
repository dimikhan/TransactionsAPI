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
	
	var output = {};
	var AcctTrnInqRq = {};

	var ANZTraceInfo = {};
	ANZTraceInfo.EffDt = '2016-04-06';
	ANZTraceInfo.InitCompany = '00010';
	ANZTraceInfo.OperatorId = 'finacleu';
	ANZTraceInfo.BranchId = '003026';
	ANZTraceInfo.OrigApp = 'PCB';
	AcctTrnInqRq.ANZTraceInfo = ANZTraceInfo;

	AcctTrnInqRq.RqUID = 'e6253a70-e57f-085e-2153-c109037f7fdd';

	var ANZAcctId = {};
	ANZAcctId.AcctId = '5430480002988320';
	ANZAcctId.AcctNo = '5430480002988320';
	ANZAcctId.AcctType = 'PCP';
	AcctTrnInqRq.ANZAcctId = ANZAcctId;

	var CustId = {};
	CustId.CustPermId = '314925343';
	AcctTrnInqRq.CustId = CustId;

	var SelRangeDt = {};
	SelRangeDt.StartDt = '2016-02-20';
	SelRangeDt.EndDt = '2016-02-22';
	AcctTrnInqRq.SelRangeDt = SelRangeDt;

	AcctTrnInqRq.IncDetail = '1';
	AcctTrnInqRq.RecCtrlIn = '2000';
	
	var accountId = apim.getvariable('request.parameters.accountNo');
	if(accountId == '6000' || accountId == '5000') {
		ANZAcctId.AcctId = accountId;
		ANZAcctId.AcctNo = accountId;
	}

	output.AcctTrnInqRq = AcctTrnInqRq;
	
	api.logger.debug("transactionsPreTransform Exit");
		
	return output;		
}


exports.transactionsPostTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("transactionsPostTransform Entry");
	
	var data = apim.getvariable('message.body');
	if(data != null && data.errorCode != null) {
		return api.generateBusinessError(frameworkLocation, apim, 'Oracle MSL', data.errorCode);
	}
	
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);

	if(data.AcctTrnInqRs.BankAcctTrnRec.RefNum != null) {
		var template = {
			referenceNumber:  '$.AcctTrnInqRs.BankAcctTrnRec.RefNum',
            transactionDate: '$.AcctTrnInqRs.BankAcctTrnRec.TrnDt',
            processedDate: '$.AcctTrnInqRs.BankAcctTrnRec.PostedDt',
            type: '$.AcctTrnInqRs.BankAcctTrnRec.TrnType',
            amount: '$.AcctTrnInqRs.BankAcctTrnRec.Amt',
            shortDescription: '$.AcctTrnInqRs.BankAcctTrnRec.Desc1',
            detailedDescription: '$.AcctTrnInqRs.BankAcctTrnRec.Desc2',
            runningBalance: '$.AcctTrnInqRs.BankAcctTrnRec.RunningBal',
            cardUsed: '$.AcctTrnInqRs.BankAcctTrnRec.CardUsed'
		};
		var ret = transformer.transform(data, template);
		ret = {Transaction : ret};
	} else {
		var template = {
				Transactions: ['$.AcctTrnInqRs.BankAcctTrnRec', {
		            referenceNumber: '$.RefNum',
		            transactionDate: '$.TrnDt',
		            processedDate: '$.PostedDt',
		            type: '$.TrnType',
		            amount: '$.Amt',
		            shortDescription: '$.Desc1',
		            detailedDescription: '$.Desc2',
		            runningBalance: '$.RunningBal',
		            cardUsed: '$.CardUsed'
				  }]
				};
		var ret = transformer.transform(data, template);
	}
	
	
	
	api.logger.debug("transactionsPostTransform Exit");
		
	return ret;		
}
