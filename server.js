"use strict";

var http = require('http');
const Router = require('./lib/router');
const Templates = require('./lib/templates');
const serveFile = require('./src/serve-file');
const serveHome = require('./src/serve-home');
const serveArrangement = require('./src/serve-arrangement');
const serveArrangementImage = require('./src/serve-arrangement-image');
const serveSignup = require('./src/serve-signup');
const serveSignin = require('./src/serve-signin');
const serve404 = require('./src/serve404');
const serveAdmin = require('./src/serve-admin');
const postArrangement = require('./src/upload-arrangement');
const serveUploadArrangement = require('./src/serve-upload-arrangement');
const serveUpdateArrangement = require('./src/serve-update-arrangement');
const updateArrangementForm = require('./src/serve-update-arrangement-form');
const updateArrangement = require('./src/update-arrangement');
const createUser = require('./src/create-user');
const createSession = require('./src/create-session');
const loadSession = require('./lib/load-session');
const serveUpdatePassword = require('./src/serve-update-password');
const updatePassword = require('./src/update-password');

var router = new Router(serve404);
var templates = new Templates("./templates");

const PORT = process.env.PORT || 3000;

router.addRoute("GET", "/public/:filename", serveFile);
router.addRoute("GET", "/", serveHome);
router.addRoute("GET", "/index", serveHome);
router.addRoute("GET", "/index.html", serveHome);
router.addRoute("GET", "/arrangements/:id", serveArrangement);
router.addRoute("GET", "/arrangement-images/:id", serveArrangementImage);
router.addRoute("GET", "/admin", serveAdmin);
router.addRoute("POST", "/upload-arrangement", postArrangement);
router.addRoute("GET", "/upload-arrangement", serveUploadArrangement);
router.addRoute("GET", "/update-arrangement", serveUpdateArrangement);
router.addRoute("GET", "/update-arrangement-form/:id", updateArrangementForm);
router.addRoute("POST", "/update-arrangement", updateArrangement);
router.addRoute("GET", "/signup", serveSignup);
router.addRoute("POST", "/signup", createUser);
router.addRoute("GET", "/signin", serveSignin);
router.addRoute("POST", "/signin", createSession);
router.addRoute("GET", "/update-password", serveUpdatePassword);
router.addRoute("POST", "/update-password", updatePassword);

var server = http.createServer({}, (req, res) => {
  res.templates = templates;
  // Attempt to load the session before routing
  loadSession(req, res, (req, res) => {
    // Route the request
    router.route(req, res);
  });
});

// Begin listening for requests
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});