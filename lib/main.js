var widgets = require("widget");
var data = require("self").data;
var tabs = require("tabs");
var panels = require("panel");
var simpleStorage = require("simple-storage");
var Request = require("request").Request;

exports.main = function (options, callbacks) {

	if(!simpleStorage.storage.dropBoxData) {
   		simpleStorage.storage.dropBoxData = {
      			"token": "",
      			"secret": ""
 		};
	} else {
		console.log(simpleStorage.storage.dropBoxData.token + " - " + simpleStorage.storage.dropBoxData.secret);
	}

	var authenticationPanel = panels.Panel({
    		width: 320,
    		height: 120,
    		contentURL: data.url("pages/auth.html"),
    		contentScriptURL: [data.url("script/jquery-1.4.3.min.js"), data.url("script/auth.js")],
    		contentScriptWhen: "ready",
    		onMessage: function(ident) {
      	 		console.log(ident.login + " - " + ident.password);

       			Request({
				url: "https://api.dropbox.com/0/token?email=" + ident.login  + "&password=" + ident.password + "&oauth_consumer_key=of0tf7a61z9zf83",
          			onComplete: function (response) {
	     				console.log(response.status);
             				simpleStorage.storage.dropBoxData.token = response.json.token;
             				simpleStorage.storage.dropBoxData.secret = response.json.secret;
	     				console.log(simpleStorage.storage.dropBoxData.token);
             				console.log(simpleStorage.storage.dropBoxData.secret);
          			}
       			}).get();
    		}
	});

	var browerPanel = panels.Panel({
		width: 320,
		height: 120,
		contentURL: data.url("pages/browser.html"),
		contentScriptURL: [data.url("script/jquery-1.4.3.min.js"), data.url("script/browser.js")],
		contentScriptWhen: "ready",
		onMessage: function(login, password) {
			console.log(login + " - " + password);
    		}
	});

	widgets.add(widgets.Widget({
  		label: "DropBox JetPack Addon Configuration",
  		image: data.url("images/favicon.ico"),
  		panel: function() {
     			if(!simpleStorage.storage.dropBoxData.token) {
        			return authenticationPanel;
			} else {
				return browserPanel;
			}
		}()
	}));
}
