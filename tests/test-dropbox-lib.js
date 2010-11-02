var dropbox = require("dropbox-lib");

exports.ensureWhoDropBoxLibIs = function(test) {
  test.assertEqual(dropbox.who(), 'DropBox JS Library ! What else ?', "DropBox Library is aware of itself");
};
