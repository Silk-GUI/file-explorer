var Silk = {};

Silk.fileToOpen = function () {
  name = "file", name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)", regex = new RegExp(regexS), results = regex.exec(window.location.href);
  return null == results ? null : decodeURIComponent(results[1]);
};
