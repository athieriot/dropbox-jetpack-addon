var jsOAuth = require("jsOAuth");
var Request = require("request").Request;
var _ = require("underscore").Underscore;

var serverData = {
	realm: "https://api.dropbox.com",
	version: "0"
};
var fileServerData = {
	realm: "https://api-content.dropbox.com",
	version: "0"
};

function constructUrl(serverData, resource, path, args) {
	return  serverData.realm + "/" + serverData.version + "/" + resource
		+ (path == '' || !path ? '' : '/' + path)
		+ _.reduce(args, function (memo, item, key) {return memo + (memo == '' ? '?' : '&') + key + '=' + item}, '');
};
function constructHeader(method, applicationData, clientData, url) {
	var headerParams = {
		'oauth_callback': '',
		'oauth_consumer_key': applicationData.token,
		'oauth_token': clientData.token,
		'oauth_signature_method': 'HMAC-SHA1',
		'oauth_timestamp': jsOAuth.getTimestamp(),
		'oauth_nonce': jsOAuth.getNonce(),
		'oauth_verifier': '',
		'oauth_version': jsOAuth.version 
	};

	var signatureString = jsOAuth.toSignatureBaseString(method, url, headerParams);
	var signature = jsOAuth.OAuth.signatureMethod['HMAC-SHA1'](applicationData.secret, clientData.secret, signatureString);
console.log(signatureString);
	headerParams.oauth_signature = signature;

	return jsOAuth.toHeaderString(headerParams);
};
function callAPI(method, serverData, resource, applicationData, clientData, path, args, callback) {
	var url = constructUrl(serverData, resource, path, args);
	console.log(url);

	var request = Request({
		url: url, 
		headers: {'Authorization': 'OAuth ' + constructHeader(method, applicationData, clientData, url), 'X-Requested-With': 'XMLHttpRequest'},
		onComplete: callback
	});

	if(method == 'GET') request.get()
	else if(method == 'POST') request.post();
};

exports.who  = function who() {return 'DropBox JS Library ! What else ?';};
exports.token = function(applicationData, email, password, callback) callAPI('GET', serverData, 'token', applicationData, {token: '', secret: ''}, '', {email: email, password: password}, callback);
exports.accountInfo = function(applicationData, clientData, callback) callAPI('GET', serverData, 'account/info', applicationData, clientData, '', {}, callback);
exports.account = function(applicationData, email, first_name, last_name,  password, callback) callAPI('GET', serverData, 'account', applicationData, {token: '', secret: ''}, '', {email: email, first_name: first_name, last_name: last_name, password: password}, callback);
exports.metadata = function(applicationData, clientData, path, options, callback) callAPI('GET', serverData, 'metadata/dropbox', applicationData, clientData, path, options, callback);
