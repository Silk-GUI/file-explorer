var sockjs = require('sockjs');
var http = require('http');
var Eureca = require('eureca.io');
var electronApp = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var express = require('express');

var exports = require('./exports');

var app = express();
var server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

var eurecaServer = new Eureca.Server({ transport: 'sockjs' });
eurecaServer.attach(server);
eurecaServer.exports = exports;

server.listen(2006, '0.0.0.0');

electronApp.on('ready', function () {
  var window = new BrowserWindow();
  window.loadUrl('http://localhost:2006');
});
