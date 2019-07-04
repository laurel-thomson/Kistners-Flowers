function serve500(req, res) {
  console.error(`500 Server Error`);
  // Set the status code & message
  res.statusCode = 500;
  res.statusMessage = "Server Error";
  // Render a pretty error page
  var html = res.templates.render('500.html',{});
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

module.exports = serve500;
