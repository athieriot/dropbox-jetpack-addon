$("#auth").submit(function (event) {
  var login = $("#login").val();
  var password = $("#password").val();
  
  var oAuth = new SoundCloud.OAuth("https://api.dropbox.com/0/token", "https://api.dropbox.com/", "of0tf7a61z9zf83", "of0tf7a61z9zf83", {"email": login, "password": password}, oauthCallback);
  oAuth.startAuthentication(); 
  postMessage(oAuth); 

  function oauthCallback(oauthObj) {
     postMessage(oauthObj.accessToken, oauthObj.accessTokenSecret);
  };  
});

