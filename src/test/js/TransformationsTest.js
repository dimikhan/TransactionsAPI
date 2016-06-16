var currentWorkingDir = java.lang.System.getProperty("user.dir");
var frameworkLocation = currentWorkingDir + '/target/framework/js/';
var configLocation = currentWorkingDir + '/src/main/js/';
var Require = load('src/main/js/lib/Require.js');
var require = Require( './' , [ frameworkLocation, configLocation ] );

describe(
		"TransformationsTest",
		function() {

			// spy object to replace console
			var console;
			var apim;

			var logger;
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

				logger = require('Logger.js').newLogger({ 
					logLevel: "7"
				}, console);
			
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
					api.setConfigLocation(configLocation);

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
							api.setConfigLocation(configLocation);

							// mock body to transform
							var body = {
								"AcctTrnInqRs" : {
									"RqUID" : "e6253a70-e57f-085e-2153-c109037f7fdd",
									"CustId" : {
										"CustPermId" : "2398xxxxx ",
										"AdditionalProperties" : {}
									},
									"SelRangeDt" : {
										"StartDt" : "2016-02-20",
										"EndDt" : "2016-02-22",
										"AdditionalProperties" : {}
									},
									"RecCtrlOut" : {
										"SentRec" : "3",
										"AdditionalProperties" : {}
									},
									"BankAcctTrnRec" : [
											{
												"PostedDt" : "2016-02-22",
												"TrnDt" : "2014-02-21",
												"TrnType" : "D",
												"TrnCode" : "505",
												"Desc1" : "LATE PAYMENT FEE",
												"Desc2" : "CARD USED : 5434xxxxxxxxxx",
												"Amt" : "47.08",
												"RunningBal" : "8171.39",
												"RefNum" : "1000003457xxxxxxx95480",
												"CardUsed" : "5434xxxxxxxxxx",
												"CardSequence" : "0",
												"CategoryCode" : "0",
												"Plan" : "10002",
												"PlanSeq" : "2",
												"AdditionalProperties" : {}
											},
											{
												"PostedDt" : "2016-02-21",
												"TrnDt" : "2014-02-20",
												"TrnType" : "D",
												"TrnCode" : "519",
												"Desc1" : "INTEREST CHARGED ON PURCHASES",
												"Desc2" : "CARD USED : 5434xxxxxxxxxx",
												"Amt" : "83.38",
												"RunningBal" : "421.35",
												"RefNum" : "19999999xxxxxxxx9995450",
												"CardUsed" : "5434xxxxxxxxxx ",
												"CardSequence" : "0",
												"CategoryCode" : "0",
												"Plan" : "10002",
												"PlanSeq" : "1",
												"AdditionalProperties" : {}
											},
											{
												"PostedDt" : "2016-02-20",
												"TrnDt" : "2014-02-19",
												"TrnType" : "D",
												"TrnCode" : "505",
												"Desc1" : "LATE PAYMENT FEE",
												"Desc2" : "CARD USED : 5434xxxxxxxxxx",
												"Amt" : "29.5",
												"RunningBal" : "420.08",
												"RefNum" : "1000003345xxxxxxx5440",
												"CardUsed" : "5434xxxxxxxxxx",
												"CardSequence" : "0",
												"CategoryCode" : "0",
												"Plan" : "10002",
												"PlanSeq" : "2",
												"AdditionalProperties" : {}
											} ],
									"AdditionalProperties" : {},
									"AnzacctId" : {
										"AcctId" : "5434xxxxxxxxxx ",
										"AcctNo" : "5434xxxxxxxxxx ",
										"AcctType" : "PCP",
										"AdditionalProperties" : {}
									}
								},
								"AdditionalProperties" : {}
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
			
			it("testTransactionsPostTransformSingleTransaction",
					function() {

						try {
							var transformations = require("Transformations.js");
							var api = require("Api.js").newApi(
									frameworkLocation, "api", "1.0.0", config,
									logger, logger);
							api.setConfigLocation(configLocation);

							// mock body to transform
							var body = {
								"AcctTrnInqRs" : {
									"RqUID" : "e6253a70-e57f-085e-2153-c109037f7fdd",
									"CustId" : {
										"CustPermId" : "2398xxxxx ",
										"AdditionalProperties" : {}
									},
									"SelRangeDt" : {
										"StartDt" : "2016-02-20",
										"EndDt" : "2016-02-22",
										"AdditionalProperties" : {}
									},
									"RecCtrlOut" : {
										"SentRec" : "3",
										"AdditionalProperties" : {}
									},
									"BankAcctTrnRec" : 
											{
												"PostedDt" : "2016-02-22",
												"TrnDt" : "2014-02-21",
												"TrnType" : "D",
												"TrnCode" : "505",
												"Desc1" : "LATE PAYMENT FEE",
												"Desc2" : "CARD USED : 5434xxxxxxxxxx",
												"Amt" : "47.08",
												"RunningBal" : "8171.39",
												"RefNum" : "1000003457xxxxxxx95480",
												"CardUsed" : "5434xxxxxxxxxx",
												"CardSequence" : "0",
												"CategoryCode" : "0",
												"Plan" : "10002",
												"PlanSeq" : "2",
												"AdditionalProperties" : {}
											},
									"AdditionalProperties" : {},
									"AnzacctId" : {
										"AcctId" : "5434xxxxxxxxxx ",
										"AcctNo" : "5434xxxxxxxxxx ",
										"AcctType" : "PCP",
										"AdditionalProperties" : {}
									}
								},
								"AdditionalProperties" : {}
							};

							apim.getvariable.and.callFake(function(variable) {
								return body;
							});

							var result = transformations
									.transactionsPostTransform(
											frameworkLocation, api, apim);
							api.logger.info(result);
							var expectedResults = '{"Transaction":{"referenceNumber":"1000003457xxxxxxx95480","transactionDate":"2014-02-21","processedDate":"2016-02-22","type":"D","amount":"47.08","shortDescription":"LATE PAYMENT FEE","detailedDescription":"CARD USED : 5434xxxxxxxxxx","runningBalance":"8171.39","cardUsed":"5434xxxxxxxxxx"}}';
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
							var expectedResults = '{"AcctTrnInqRq":{"ANZTraceInfo":{"EffDt":"2016-04-06","InitCompany":"00010","OperatorId":"finacleu","BranchId":"003026","OrigApp":"PCB"},"RqUID":"e6253a70-e57f-085e-2153-c109037f7fdd","ANZAcctId":{"AcctId":"5430480002988320","AcctNo":"5430480002988320","AcctType":"PCP"},"CustId":{"CustPermId":"314925343"},"SelRangeDt":{"StartDt":"2016-02-20","EndDt":"2016-02-22"},"IncDetail":"1","RecCtrlIn":"2000"}}';
							var actualResults = JSON.stringify(result);

							expect(expectedResults).toBe(actualResults);

							console.info(actualResults);


						} catch (e) {
							console.debug(e);
						}
					});
			
			it("testJsonToXml",
					function() {
				try {
					console.info("Executing testJsonToXml");
					var js2xmlparser = require(frameworkLocation + "js2xmlparser.js");
					console.info("js2xmlparser= " + js2xmlparser);
					var data = {
					    "firstName": "John",
					    "lastName": "Smith"
					};
					var actualResults = js2xmlparser("person", data);
					console.info(actualResults);
					
					var expected = '<?xmlversion="1.0"encoding="UTF-8"?><person><firstName>John</firstName><lastName>Smith</lastName></person>';					
					expect(expected).toBe(actualResults.replace(/\s/g, '').replace(/\n/g, ''));
				} catch(e) {
					console.debug(e);
				}

			});
			
			it("testXmlToJson",
					function() {
				try {
					console.info("Executing testXmlToJson");
					var parser = require(frameworkLocation +  'xml2json.js');
					var xml = '<person><name>John Doe</name></person>';
					
					var json = parser.xml2json(xml); 
					console.info(JSON.stringify(json)); 
					
					var expected = '{"person":{"name":"John Doe"}}';					
					expect(expected).toBe(JSON.stringify(json));
				} catch(e) {
					console.debug(e);
				}

			});
	

		});
