var cjsOAuth = require("cjsOAuth");
var Request = require("request").Request;

var applicationData = {
	"token": "of0tf7a61z9zf83",
	"secret": "5m0xlf74kkewvtl"
}

var serverData = {
	"realm": "https://api.dropbox.com",
	"version": "0"
}

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

exports.accountInfo = function accountInfo(clientData, callback) {

	var url = serverData.realm + "/" 
                  + serverData.version + "/"
                  + "account/info";

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

	signatureString = cjsOAuth.toSignatureBaseString('GET', url, headerParams);
	signature = cjsOAuth.OAuth.signatureMethod['HMAC-SHA1'](applicationData.secret, clientData.secret, signatureString);
	console.log(signatureString);
	console.log(signature);
	headerParams.oauth_signature = signature;

	Request({
		url: url, 
		headers: {'Authorization': 'OAuth ' + cjsOAuth.toHeaderString(headerParams)},
		onComplete: callback
	}).get();
};
