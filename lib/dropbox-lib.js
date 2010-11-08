var cjsOAuth = require("cjsOAuth");
var Request = require("request").Request;
var sha1 = require("sha1");

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

	var url = 'http://term.ie/oauth/example/echo_api.php';
	applicationData.token = 'key';
	applicationData.secret = 'secret';

	clientData.token = 'accesskey';
	clientData.secret = 'accesssecret';

	var headerParams = {
		'oauth_callback': 'oob',
		'oauth_consumer_key': applicationData.token,
		'oauth_token': clientData.token,
		'oauth_signature_method': 'HMAC-SHA1',
		'oauth_timestamp': cjsOAuth.getTimestamp(),
		'oauth_nonce': cjsOAuth.getNonce(),
		'oauth_verifier': '',
		'oauth_version': cjsOAuth.OAuth.version 
	};

	signatureString = cjsOAuth.toSignatureBaseString('GET', url, headerParams  + '\r\n');
	signature = sha1.b64_hmac_sha1(applicationData.secret + '&' + clientData.secret, signatureString);
	// cjsOAuth.OAuth.signatureMethod['HMAC-SHA1'](applicationData.secret, clientData.secret, signatureString);

	console.log(signatureString);
	console.log(signature);
	headerParams.oauth_signature = signature;

	Request({
		url: url, 
		headers: {'Authorization': 'OAuth ' + cjsOAuth.toHeaderString(headerParams), 'X-Requested-With': 'XMLHttpRequest'},
		onComplete: callback
	}).get();
};
