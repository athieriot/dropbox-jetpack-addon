var dropbox = require("dropbox-lib");

var clientData = {
	"token": "jxjxmvxyaiwjvt9",
        "secret": "34s78vlfshegojm"
};

var applicationData = {
        "token": "of0tf7a61z9zf83",
        "secret": "5m0xlf74kkewvtl"
};

exports.ensureWhoDropBoxLibIs = function(test) {
	test.assertEqual(dropbox.who(), 'DropBox JS Library ! What else ?', "DropBox Library is aware of itself");
};

/*
exports.testGetToken = function(test) {
	dropbox.token('a.thieriot@gmail.com', '79a5sr13dy', function(response) {
		test.assertEqual(response.status, '200');
		console.log(response.json.token + "-" + response.json.secret);	
		test.done();
	});		
	test.waitUntilDone(100000);
};
*/

exports.testGetAccountInfo = function(test) {
	dropbox.accountInfo(applicationData, clientData, function(response) {
		console.info(' Account Info test result : ' + response.text);
	
		//TODO: Better test case
		if(response.status != '200') return;
		if(response.json.display_name != 'Aur\u00e9lien Thieriot') return;
		if(response.json.country != 'FR') return;
		if(response.json.email != 'a.thieriot@gmail.com') return;

		test.pass('Account Info test : passed');
		test.done();
	});		
	test.waitUntilDone(100000);
};


