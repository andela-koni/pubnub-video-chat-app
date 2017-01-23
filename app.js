var express = require('express');
var port = process.env.PORT || '5556'
var path = require('path');

require('dotenv').config();

var app = express();

app.use(express.static('src'));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.listen(port, function() {
  console.log('app running on 5556');
});
