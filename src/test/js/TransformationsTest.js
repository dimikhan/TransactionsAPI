var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/target/framework/js/';
var configLocation = currentWorkingDir + '/src/main/js/';

var Require = load('src/main/js/lib/Require.js');
var require = Require('./', [ configLocation, frameworkLocation ]);

describe(
		"TransformationsTest",
		function() {

			// spy object to replace console
			var console;
			var apim;

			var logger = require('Logger.js').newLogger({ 
					name: "gatewayscript-user",
					logLevel: "7"
				}, console);
			var config = [ {
				name : "/users",
				methods : [ {
					name : "GET",
					targetUrl : "https://randomuser.me/api/users"
				} ]
			}, {
				name : "/users/all",
				methods : [ {
					name : "GET",
					targetUrl : "https://randomuser.me/api/users/all"
				} ]
			} ];

			beforeEach(function() {
				console = jasmine.createSpyObj('console', [ 'debug', 'info',
						'notice', 'warning', 'error', 'critical', 'alert',
						'emergency', 'options' ]);
				apim = jasmine.createSpyObj('apim', [ 'getvariable' ]);

				var log = function(msg) {
					print(msg);
				}

				console.info.and.callFake(log);
				console.notice.and.callFake(log);
				console.debug.and.callFake(log);
				console.error.and.callFake(log);
			});

			it("testTransformRequestMessageBody", function() {

				try {
					var transformations = require("Transformations.js");
					var api = require("Api.js").newApi(frameworkLocation,
							"api", "1.0.0", config,
							logger, logger);

					// mock body to transform
					var body = {
						some : {
							crazy : [ {
								example : 'A'
							}, {
								example : 'B'
							} ]
						}
					};

					apim.getvariable.and.callFake(function(variable) {
						return body;
					});

					var result = transformations.transformRequestMessageBody(
							frameworkLocation, api, apim);
					var expectedResults = '{"foo":[{"bar":"A"},{"bar":"B"}]}';
					var actualResults = JSON.stringify(result);

					expect(expectedResults).toBe(actualResults);

					console.info(actualResults);

					expect(apim.getvariable).toHaveBeenCalledWith(
							'message.body');

				} catch (e) {
					console.debug(e);
				}
			});

			it("testTransactionsPostTransform",
					function() {

						try {
							var transformations = require("Transformations.js");
							var api = require("Api.js").newApi(
									frameworkLocation, "api", "1.0.0", config,
									logger, logger);

							// mock body to transform
							var body = {
								"acctTrnInqRs" : {
									"rqUID" : "e6253a70-e57f-085e-2153-c109037f7fdd",
									"custId" : {
										"custPermId" : "2398xxxxx ",
										"additionalProperties" : {}
									},
									"selRangeDt" : {
										"startDt" : "2016-02-20",
										"endDt" : "2016-02-22",
										"additionalProperties" : {}
									},
									"recCtrlOut" : {
										"sentRec" : "3",
										"additionalProperties" : {}
									},
									"bankAcctTrnRec" : [
											{
												"postedDt" : "2016-02-22",
												"trnDt" : "2014-02-21",
												"trnType" : "D",
												"trnCode" : "505",
												"desc1" : "LATE PAYMENT FEE",
												"desc2" : "CARD USED : 5434xxxxxxxxxx",
												"amt" : "47.08",
												"runningBal" : "8171.39",
												"refNum" : "1000003457xxxxxxx95480",
												"cardUsed" : "5434xxxxxxxxxx",
												"cardSequence" : "0",
												"categoryCode" : "0",
												"plan" : "10002",
												"planSeq" : "2",
												"additionalProperties" : {}
											},
											{
												"postedDt" : "2016-02-21",
												"trnDt" : "2014-02-20",
												"trnType" : "D",
												"trnCode" : "519",
												"desc1" : "INTEREST CHARGED ON PURCHASES",
												"desc2" : "CARD USED : 5434xxxxxxxxxx",
												"amt" : "83.38",
												"runningBal" : "421.35",
												"refNum" : "19999999xxxxxxxx9995450",
												"cardUsed" : "5434xxxxxxxxxx ",
												"cardSequence" : "0",
												"categoryCode" : "0",
												"plan" : "10002",
												"planSeq" : "1",
												"additionalProperties" : {}
											},
											{
												"postedDt" : "2016-02-20",
												"trnDt" : "2014-02-19",
												"trnType" : "D",
												"trnCode" : "505",
												"desc1" : "LATE PAYMENT FEE",
												"desc2" : "CARD USED : 5434xxxxxxxxxx",
												"amt" : "29.5",
												"runningBal" : "420.08",
												"refNum" : "1000003345xxxxxxx5440",
												"cardUsed" : "5434xxxxxxxxxx",
												"cardSequence" : "0",
												"categoryCode" : "0",
												"plan" : "10002",
												"planSeq" : "2",
												"additionalProperties" : {}
											} ],
									"additionalProperties" : {},
									"anzacctId" : {
										"acctId" : "5434xxxxxxxxxx ",
										"acctNo" : "5434xxxxxxxxxx ",
										"acctType" : "PCP",
										"additionalProperties" : {}
									}
								},
								"additionalProperties" : {}
							};

							apim.getvariable.and.callFake(function(variable) {
								return body;
							});

							var result = transformations
									.transactionsPostTransform(
											frameworkLocation, api, apim);
							api.logger.info(result);
							var expectedResults = '{"Transactions":[{"referenceNumber":"1000003457xxxxxxx95480","transactionDate":"2014-02-21","processedDate":"2016-02-22","type":"D","amount":"47.08","shortDescription":"LATE PAYMENT FEE","detailedDescription":"CARD USED : 5434xxxxxxxxxx","runningBalance":"8171.39","cardUsed":"5434xxxxxxxxxx"},{"referenceNumber":"19999999xxxxxxxx9995450","transactionDate":"2014-02-20","processedDate":"2016-02-21","type":"D","amount":"83.38","shortDescription":"INTEREST CHARGED ON PURCHASES","detailedDescription":"CARD USED : 5434xxxxxxxxxx","runningBalance":"421.35","cardUsed":"5434xxxxxxxxxx "},{"referenceNumber":"1000003345xxxxxxx5440","transactionDate":"2014-02-19","processedDate":"2016-02-20","type":"D","amount":"29.5","shortDescription":"LATE PAYMENT FEE","detailedDescription":"CARD USED : 5434xxxxxxxxxx","runningBalance":"420.08","cardUsed":"5434xxxxxxxxxx"}]}';
							var actualResults = JSON.stringify(result);

							expect(expectedResults).toBe(actualResults);

							console.info(actualResults);

							expect(apim.getvariable).toHaveBeenCalledWith(
									'message.body');

						} catch (e) {
							console.debug(e);
						}
					});
			
			it("testTransactionsPreTransform",
					function() {

						try {
							var transformations = require("Transformations.js");
							var api = require("Api.js").newApi(
									frameworkLocation, "api", "1.0.0", config,
									logger, logger);

							// mock body to transform
							var AccountId = '6584095';

							apim.getvariable.and.callFake(function(variable) {
								return AccountId;
							});

							var result = transformations
									.transactionsPreTransform(
											frameworkLocation, api, apim);
							api.logger.info(result);
							var expectedResults = '{"acctTrnInqRq":{"additionalProperties":{},"anzacctId":{"acctId":"6584095","acctNo":"6584095","acctType":"string","additionalProperties":{}},"anztraceInfo":{"additionalProperties":{},"branchId":"string","effDt":"string","initCompany":"string","operatorId":"string","origApp":"string","terminalId":"string"},"custId":{"additionalProperties":{},"custPermId":"string"},"incDetail":"string","recCtrlIn":"string","rqUID":"string","selRangeDt":{"additionalProperties":{},"endDt":"string","startDt":"string"}},"additionalProperties":{}}';
							var actualResults = JSON.stringify(result);

							expect(expectedResults).toBe(actualResults);

							console.info(actualResults);


						} catch (e) {
							console.debug(e);
						}
					});

	

		});
