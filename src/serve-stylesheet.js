const fs = require('fs');

function serveStylesheet(filename, req, res) {
  fs.readFile('public/' + filename, function(err, data) {
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

module.exports = serveStylesheet;