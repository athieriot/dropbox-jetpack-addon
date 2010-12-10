var widgets = require("widget");
var data = require("self").data;
var tabs = require("tabs");
var panels = require("panel");
var simpleStorage = require("simple-storage");
var dropbox = require("dropbox-lib");

var applicationData = {
	"token": "of0tf7a61z9zf83",
	"secret": "5m0xlf74kkewvtl"
}

exports.main = function (options, callbacks) {

	if(!simpleStorage.storage.clientData) {
   		simpleStorage.storage.clientData = {
      			"token": "jxjxmvxyaiwjvt9",
      			"secret": "34s78vlfshegojm"
		};
	} else {
		console.log(simpleStorage.storage.cientData.token + " - " + simpleStorage.storage.clientData.secret);
	}

	var authenticationPanel = panels.Panel({
    		width: 320,
    		height: 120,
    		contentURL: data.url("pages/auth.html"),
    		contentScriptURL: [data.url("script/jquery-1.4.3.min.js"), data.url("script/auth.js")],
    		contentScriptWhen: "ready",
    		onMessage: function(ident) {
      	 		console.log(ident.login + " - " + ident.password);
			dropbox.token(ident.login, ident.password, function (response) {
				console.log(response.status);
				simpleStorage.storage.clientData.token = response.json.token;
				simpleStorage.storage.clientData.secret = response.json.secret;
				console.log(simpleStorage.storage.clientData.token);
				console.log(simpleStorage.storage.clientData.secret);
			});
    		}
	});

	var browserPanel = panels.Panel({
		width: 320,
		height: 120,
		contentURL: data.url("pages/browser.html"),
		contentScriptURL: [data.url("script/jquery-1.4.3.min.js"), data.url("script/browser.js")],
		contentScriptWhen: "ready",
		onMessage: function(login, password) {
			console.log(login + " - " + password);
    		}
	});

	widgets.Widget({
  		label: "DropBox JetPack Addon Configuration",
  		contentURL: data.url("images/favicon.ico"),
  		panel: function() {
     			if(!simpleStorage.storage.clientData.token) {
        			return authenticationPanel;
			} else {
				return browserPanel;
			}
		}()
	});
}
