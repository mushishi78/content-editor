var getConfig = require('hjs-webpack');

module.exports = getConfig({
  in: 'src/app.js',
  out: 'public',
  clearBeforeBuild: '!(icons|favicon.ico)',
  html: function (data) {
    return {
      'index.html': html(data),
      '200.html': html(data)
    }
  }
});

function html(data) {
  var sep = data.relative ? '' : '/';

  return [
    "<!DOCTYPE html>",
    "<html>",
    "<head>",
    "<meta charset='utf-8'>",
    "<meta http-equiv='X-UA-Compatible' content='IE=edge'>",
    "<meta name='viewport' content='width=device-width, initial-scale=1'>",
    "<meta name='description' content='Content Editor for Static-Sites hosted on GitHub'>",
    "<title>Content Editor</title>",
    "<link href='https://fonts.googleapis.com/css?family=Ubuntu|Yanone+Kaffeesatz' rel='stylesheet' type='text/css'>",
    "<link rel='stylesheet' href='" + sep + data.css + "'/>",
    "</head>",
    "<body>",
    "<script src='" + sep + data.main + "'></script>",
    "</body>",
    "</html>"
  ].join('');
}
