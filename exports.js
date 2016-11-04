var fs = require('fs');
var mime = require("mime");
var home = require("home");

function parsePath(path) {
  var files = fs.readdirSync(path);
  for (var i = 0; i < files.length; i++) {
    files[i] = {
      name: files[i],
      path: path + files[i],
    }
    var stats = fs.statSync(files[i].path);
    files[i].isDir = stats.isDirectory();
    if (!files[i].isDir)
      files[i].mime = mime.lookup(files[i].path);
  }
  return files;
}

module.exports = {
  home: function () {
    return home();
  },
  list: function (path) {
    if (typeof path == "undefined") {
      path = "/";
    }

    if (!/\/$/.test(path)) {
      path += "/";
    }

    // windows
    if (path.indexOf('/C:\\') === 0) {
      path = 'C:\\' + path.slice(3);
    }

    if (!fs.existsSync(path)) {
      throw new Error("path: '" + path + "' doesn't exist")
    }

    if (!fs.statSync(path).isDirectory()) {
      throw new Error("path:" + path + " is not a dirctory")
    }

    return parsePath(path);
  },
  createFolder(data) {
    var context = this;
    var path = data.path;
    var name = data.name;

    context.async = true;

    console.log(path);
    console.log(name);
    console.log(path + "/" + name);

    if (typeof path == "undefined") {
      path = "/"
    }
    if (typeof name == "undefined") {
      name = "Untitled";
    }

    fs.mkdir(path + "/" + name, function (err) {
      if (err) {
        if (err.code == 'EEXIST') context.return("Folder already exists"); // ignore the error if the folder already exists
        else context.return(err); // something else went wrong
      }
      else context.return({ "status": "done" }); // successfully created folder
    });

  }
};
