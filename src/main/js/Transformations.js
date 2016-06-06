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

exports.getPostsPostTransform = function(frameworkLocation,api,apim) {

	api.logger.debug("getPostsPostTransform Entry");
	var transformer = require(frameworkLocation + 'JsonTransformer.js').newJsonTransformer(frameworkLocation);
	 
	var template = {
		backend: '$.imeplementation', 
	    addition: '$.result'
	};
	
	var data = apim.getvariable('message.body');
	var ret = transformer.transform(data, template);
	api.logger.debug("transfomed body= " + JSON.stringify(ret));
	api.logger.debug("getPostsPostTransform Exit");
		
	return ret;		
}
