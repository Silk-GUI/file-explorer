var path = "/";
var server = null;

var eurecaClient = new Eureca.Client({
  transport: 'sockjs'
});

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if(decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if(decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}

function file_explorer(elem) {
  if(typeof elem == "undefined")
    elem = "body";
  this.elem = jQuery(elem);
  this.filePicker = getQueryVariable('filePicker') || false;
  this.files = this.elem.find(".files");
  this.cd = this.elem.find(".current_path");
  this.href = "";
  var that = this;
  jQuery(this.elem).on("click", ".current_path a,.files .directory a", function (e) {
    e.preventDefault();
    that.changeDirectory($(this).attr("href"))
    return false;
  })
  // open file when clicked
  jQuery(this.elem).on("click", ".files .file a", function (e) {
    e.preventDefault();
    Manager.get('open', {path: $(this).attr("href"), mime: $(this).parent().attr("data-mime")})
      .then(function (result) {
        console.log('result', result);
      }, function (error) {
        console.log('error', error);
      });
    // alert("You're going to have to setup a default view for mimetype: " + $(this).parent().attr("data-mime"));
    return false;
  })
  // Create folder
  jQuery("#newFolder").click(function (e) {
    var name = prompt("Name of Folder");
    server.createFolder({ path: that.href, name: name }).onReady(function (result) {
      that.changeDirectory(path);
    })
  })

  this.changeDirectory(path);
}

file_explorer.prototype.changeDirectory = function (href) {
  let that = this;
  // get files in / directory
  console.log("sending href: " + href);
  this.href = href;
  server.list(href).onReady(function (list) {
    that.processList(href, list);
  });
}

file_explorer.prototype.processCD = function (href) {
  aref = href.split("/");
  if(/\/$/.test(href)) {
    aref.pop();
  }
  this.cd.empty();
  var netref = "";
  for (var i = 0; i < aref.length; i++) {
    var name = aref[i];
    if(name == "") {
      name = "root";
    } else
      netref += "/" + name
    this.cd.append("<i class='fa fa-caret-right'></i><span>/</span><a href='" + netref + "'>" + name + "</a>");
  }
}
file_explorer.prototype.processList = function (href, list) {
  var files = [];
  this.processCD(href);
  this.files.empty();

  // add folders and separate files
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    if(item.isDir) {
      var el = jQuery("<li><a href='" + item.path + "'><i class='fa fa-folder'></i>" + item.name + "</a></li>");
      this.files.append(el);
      el.addClass("directory");

    } else {
      files.push(item);
    }
  }

  // add files
  for (var i = 0; i < files.length; i++) {
    var item = list[i];
    var el = jQuery("<li><a href='" + item.path + "'><i class='fa fa-file-o'></i>" + item.name + "</a></li>");
    this.files.append(el);
    el.addClass("file");
    el.attr("data-mime", item.mime);

  }

}

eurecaClient.ready(function (serverProxy) {
  server = serverProxy;
  serverProxy.home().onReady(function (data) {
    path = data;
    new file_explorer();
  });
});
