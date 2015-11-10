var db = require('./source/database.js');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/signup', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.post('/addProfile', [db.addProfile], function(req, res, next) {
	res.redirect(302, '/');
});

app.post('/validateLogin', db.validateLogin, function(req, res) {
	if (req.profileCount > 0) {
		// user exists and validated, set sessionid and whatever else...
		res.redirect('/account');
	} else {
		res.redirect('/login');
	}
});

// account.html will be replaced by account.jade which will be rendered by the jade middleware
app.get('/account', db.getAllProfiles, function(req, res, next) {
	//res.sendFile(path.join(__dirname + '/views/account.html'));
	res.render('account', {pageTitle: 'Account Page', usersObject: req.profiles});
});

app.listen(3000);
console.log('Server listening on port 3000...');