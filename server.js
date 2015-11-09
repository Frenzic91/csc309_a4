var db = require('./source/database.js');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
	//res.redirect('http://www.google.com')
});

app.get('/signup', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

app.post('/addProfile', [db.addProfile], function(req, res, next) {
	res.redirect(302, '/account');
});

app.get('/account', function(req, res, next) {
	res.sendFile(path.join(__dirname + '/views/account.html'));
});

app.listen(3000);
console.log('Server listening on port 3000...');