var cjsOAuth = require("cjsOAuth");
var Request = require("request").Request;
var sha1 = require("sha1");

var serverData = {
	"realm": "https://api.dropbox.com",
	"version": "0"
};

exports.who  = function who() {
  return 'DropBox JS Library ! What else ?';
};

exports.token = function token(login, password, callback) {
	Request({
		url: serverData.realm + "/" 
		     + serverData.version + "/" 
		     + "token" 
		     + "?email=" 
		     + login 
	  	     + "&password=" 
		     + password 
		     + "&oauth_consumer_key=" 
		     + applicationData.token,
		onComplete: callback
	}).get();
};

function callAPI(method, resource, applicationData, clientData, args, callback) {

	var url = serverData.realm + "/" 
                  + serverData.version + "/"
                  + resource;
	
	for(i in args) {
		if(i == 0) url += '?'; else url += '&';
		url = url + i + '=' + args[i]; 	
	}

	var headerParams = {
		'oauth_callback': '',
		'oauth_consumer_key': applicationData.token,
		'oauth_token': clientData.token,
		'oauth_signature_method': 'HMAC-SHA1',
		'oauth_timestamp': cjsOAuth.getTimestamp(),
		'oauth_nonce': cjsOAuth.getNonce(),
		'oauth_verifier': '',
		'oauth_version': cjsOAuth.version 
	};

	var signatureString = cjsOAuth.toSignatureBaseString(method, url, headerParams);
	var signature = sha1.b64_hmac_sha1(applicationData.secret + '&' + clientData.secret, signatureString);
	//var signature = cjsOAuth.OAuth.signatureMethod['HMAC-SHA1'](applicationData.secret, clientData.secret, signatureString);

	console.log(signatureString);
	console.log(signature);
	headerParams.oauth_signature = signature;

	var request = Request({
		url: url, 
		headers: {'Authorization': 'OAuth ' + cjsOAuth.toHeaderString(headerParams), 'X-Requested-With': 'XMLHttpRequest'},
		onComplete: callback
	})
	
	if(method == 'GET') request.get();
	else if(method == 'POST') request.post();
};

exports.accountInfo = function(applicationData, clientData, callback) callAPI('GET', 'account/info', applicationData, clientData, {}, callback);
