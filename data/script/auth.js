$("#auth").submit(function (event) {
  postMessage({"login": $("#login").val(), "password": $("#password").val()});
});

