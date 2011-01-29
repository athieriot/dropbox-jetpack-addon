var dropbox = require("dropbox-lib");
var _ = require("underscore").Underscore;

var clientData = {
	"token": "jxjxmvxyaiwjvt9",
        "secret": "34s78vlfshegojm"
}

var applicationData = {
        "token": "of0tf7a61z9zf83",
        "secret": "5m0xlf74kkewvtl"
}

exports.ensureWhoDropBoxLibIs = function(test) {
	console.log('Who test');
	test.assertEqual(dropbox.who(), 'DropBox JS Library ! What else ?', "DropBox Library is aware of itself");
}

exports.testGetToken = function(test) {
	dropbox.token(applicationData, 'a.thieriot@gmail.com', 'psycho00714', function(response) {
		console.log('Token test');
		test.assertEqual(response.status, '200');
		clientData.token = response.json.token;
		clientData.secret = response.json.secret;
		console.log("Token : " + response.json.token + "- Secret : " + response.json.secret);	
		test.done();
	});		
	test.waitUntilDone(100000);
}

exports.testGetAccountInfo = function(test) {
	dropbox.accountInfo(applicationData, clientData, function(response) {
		console.log('Account Info test');
		
		var result = new Array();
		result.push(response.status == '200');
		result.push(response.json.display_name == 'Aur\u00e9lien Thieriot');
		result.push(response.json.country == 'FR');
		result.push(response.json.email == 'a.thieriot@gmail.com');

		test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
		test.done();
	});		
	test.waitUntilDone(100000);
}

exports.testGetMetadataFile = function(test) {
	dropbox.metadata(applicationData, clientData, 'test.txt', {}, function(response) {
		console.log('Metadata file test');
		
		var result = new Array();
		result.push(response.status == '200');
		console.log(response.json.revision);
		result.push(response.json.revision == '7121');
		
		test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
		test.done();
	});		
	test.waitUntilDone(100000);
}

exports.testGetMetadataDirectory = function(test) {
	dropbox.metadata(applicationData, clientData, 'TestDir', {}, function(response) {
		console.log('Metadata directory test');
		
		var result = new Array();
		result.push(response.status == '200');
		result.push(response.json.hash == 'b8f293f4c10fa3b1bc422709323dd148');
		result.push(response.json.contents.length == 2);
		
		test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
		test.done();
	});		
	test.waitUntilDone(100000);
}

exports.testGetMetadataDirectoryWithHash = function(test) {
	dropbox.metadata(applicationData, clientData, 'TestDir', {file_limit: 10000, hash: 'b8f293f4c10fa3b1bc422709323dd148'},  function(response) {
		console.log('Metadata directory with hash test');
		
		var result = new Array();
		console.log(response.text);
		result.push(response.status == '304');

		test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
		test.done();
	});		
	test.waitUntilDone(100000);
}

exports.testGetThumbnails = function(test) {
	dropbox.thumbnails(applicationData, clientData, 'five.jpg', {size: 'medium', format: 'PNG'}, function(response) {
		console.log('Thumbnails test');

		var result = new Array();
		console.log(response.text);
		result.push(response.status == '200');

		test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
		test.done();
	});
	test.waitUntilDone(100000);
}

exports.testGetFile = function(test) {
        dropbox.getFile(applicationData, clientData, 'getFile.test', {}, function(response) {
                console.log('get File test');

                var result = new Array();
                console.log(response.text);
		result.push(response.text.indexOf('Content of the file. So test OK') >= 0)
                result.push(response.status == '200');

                test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
                test.done();
        });
        test.waitUntilDone(100000);
}
/*
exports.testPostFile = function(test) {
        dropbox.postFile(applicationData, clientData, 'testFileDir', {}, function(response) {
                console.log('post File test');

                var result = new Array();
                console.log(response.text);
                result.push(response.status == '200');

                test.assertEqual(_.reduce(result, function(memo, num){ return memo && num}, true), true);
                test.done();
        }, './postFile');
        test.waitUntilDone(100000);
}
*/
