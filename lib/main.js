var widgets = require("widget");
var data = require("self").data;
var tabs = require("tabs");
var panels = require("panel");

widgets.add(widgets.Widget({
  label: "DropBox JetPack Addon Configuration",
  image: data.url("images/favicon.ico"),
  panel: panels.Panel({
    width: 320,
    height: 120,
    contentURL: data.url("pages/auth.html"),
    contentScriptURL: [data.url("script/jquery-1.4.3.min.js"),
                       data.url("jsOAuth-0.7RC1.min.js"),
		       data.url("script/auth.js")],
    contentScriptWhen: "ready",
    onMessage: function(token, secretToken) {
       console.log(token + " - " + secretToken);
    }
  })
}));
