var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(req, res) {
	res.redirect('/home');
});

app.get('/home', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.listen(3000);
console.log('Server listening on port 3000...');