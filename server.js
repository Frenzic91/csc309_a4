var db = require('./source/database.js');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({resave: true, saveUninitialized: true, secret: 'dog1337', cookie: { maxAge: 60000 }}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/home.html'));
});

app.get('/signup', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/signup.html'));
});

app.get('/login', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/login.html'));
});

app.get('/account', db.getAllProfiles, function(req, res, next) {
	if (req.session.sessionid != undefined) {
		res.render('account', {pageTitle: 'Account Page', usersObject: req.profiles});
	} else {
		res.redirect('/');
	}
});

app.post('/addProfile', db.addProfile, function(req, res, next) {
	res.redirect(302, '/');
});

app.post('/validateLogin', db.validateLogin, function(req, res) {
	if (req.profileCount > 0) {
		// user exists and validated, set sessionid and whatever else...
		req.session.sessionid = req.body.email;
		res.redirect('/account');
	} else {
		res.redirect('/login');
	}
});

app.get('/viewprofile/:email', db.profileViewSetup, function(req, res) {	
	if (req.session.sessionid != undefined) {
		res.render('viewprofile', {pageTitle: 'View Profile', profile: req.viewableProfile});
	} else {
		res.redirect('/');
	}
});

app.get('/editprofile', function(req, res) {
	console.log("Session id: " + req.session.sessionid);
	if (req.session.sessionid != undefined) {
		res.render('editprofile');
	} else {
		res.redirect('/');
	}
});

app.post('/updateProfile', db.updateProfile, function(req, res) {
	res.redirect('/editprofile');
});

app.post('/changePassword', db.changePassword, function(req, res) {
	res.redirect('/editprofile');
});

app.listen(3000);
console.log('Server listening on port 3000...');