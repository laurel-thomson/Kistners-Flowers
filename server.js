"use strict";

var http = require('http');
var fs = require('fs');
var recipes = require('./src/recipes');

var port = 80;
var cardData = recipes.featured(9);

//our webserver
var server = http.createServer(function(req, res) {
  switch(req.url) {
    case '/':
    case '/index.html':
      serveIndex(req, res);
      break;
    case '/style.css':
      serveStylesheet('style.css', req, res);
      break;
    default:
      serveImage(req.url, req, res);
  }
});

/* Listen for incoming HTTP requests */
server.listen(port, function() {
  console.log("Listening on port " + port);
});

/** @function generateCardHTML
 * Generates an HTML string representing the cards
 * */
function generateCardHTML() {
  return cardData.map(function (data) {
    return `
    <a class="card" href="${data.images[0]}">
        <center>
      <img src=${data.images[0]} alt="thumbnail"><br>
        <span><b>${data.name}</b></span><br>
        <span>$${data.price}</span>
        </center>
    </a>
    `;
  });
}

/** @function serveIndex 
 * Serves an index page 
 */
function serveIndex(req, res) {
  
  res.setHeader("Content-Type", "text/html");
  res.end(
    `
    <!DOCTYPE html>
	<head>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet">
		<title>Kistner's Flowers</title>
	</head>
	<body>
        <nav>
         
            <a href="about.html">About Us</a>
            <div class="dropdown">
            <button class="dropbtn">Sorority Sisterhood</button>
                <div class="dropdown-content">
                    <a href="#">Gamma Phi Beta</a>
                    <a href="#">Alpha Chi Omega</a>
                    <a href="#">Kappa Alpha Theta</a>
                </div>
            </div> 
            <div class="dropdown">
            <button class="dropbtn">Occasions</button>
                <div class="dropdown-content">
                    <a href="#">Weddings</a>
                    <a href="#">New Baby</a>
                    <a href="#">Birthdays</a>
                </div>
            </div> 
        </nav>
        <div class="top_panel">
            <h1>Kistner's Flowers</h1>	
		</div>
        <br><br>
        <p>
            For the best and freshest flowers in Manhattan, Kistner's Flowers 
            has exactly what you're looking for! 
        </p>
        <p>
            Check out our wide selection of flower arrangements to make 
            your next occasion memorable.
	    </p>
        <main id="thumbnails">
            ${generateCardHTML().join("")} 
        </main>

        <footer>
            <center>
                <p>
                    <b>Kistner's Flowers</b><br>
                    1901 Pillsbury Dr. <br>
                    Manhattan, KS 66502<br><br>
                    (785) 776-7044<br>
                    (800) 532-3409
                </p>
            </center>
        </footer>

      </body>
    </html>
    `
  );
}

/** @function serveIndex 
 * Serves an image file
 */
function serveImage(filename, req, res) {
  fs.readFile('static/images/' + filename, function(err, data) {
    if(err) {
      res.statusCode = 404;
      res.statusMessage = "Not Found";
      res.end("Not Found");
      return;
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.end(data);
  });
}

/** @function serveIndex 
 * Serves a css stylesheet 
 */
function serveStylesheet(filename, req, res) {
  fs.readFile('static/' + filename, function(err, data) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = "Server Error";
      res.end();
      return;
    }
    
    res.setHeader("Content-Type", "text/css");
    res.end(data);
  });
}


