"use strict";

var http = require('http');
const Router = require('./lib/router');
const Templates = require('./lib/templates');
const serveFile = require('./src/serve-file');
const serveHome = require('./src/serve-home');
const serveArrangement = require('./src/serve-arrangement');
const serveArrangementImage = require('./src/serve-arrangement-image');
const serve404 = require('./src/serve404');

var router = new Router(serve404);
var templates = new Templates("./templates");

const PORT = process.env.PORT || 3000;

router.addRoute("GET", "/public/:filename", serveFile);
router.addRoute("GET", "/", serveHome);
router.addRoute("GET", "/index", serveHome);
router.addRoute("GET", "/index.html", serveHome);
router.addRoute("GET", "/arrangements/:id", serveArrangement);
router.addRoute("GET", "/arrangement-images/:id", serveArrangementImage);

var server = http.createServer({}, (req, res) => {
  res.templates = templates;  
  router.route(req, res);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});