var dropbox = require("dropbox-lib");

var clientData = {
	"token": "jxjxmvxyaiwjvt9",
        "secret": "34s78vlfshegojm"
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
	dropbox.accountInfo(clientData, function(response) {
		test.assertEqual(response.status, '200');
		console.log(response.text);
		console.log(response.json.display_name);	
		test.done();
	});		
	test.waitUntilDone(100000);
};
