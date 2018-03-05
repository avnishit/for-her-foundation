/*
Common Web & API Server Base for forHERFoundation.com
Author : Avnishn Chandra Suman
email  : avnishchandrasuman@gmail.com
*/

var sitePrimaryIP = '52.11.116.39';
var sitePrimaryAddress = 'ec2-52-11-116-39.us-west-2.compute.amazonaws.com';

var express = require('express');
var app=express();
var path=require('path');
var redirect = require("express-redirect");
var session = require('express-session');
var fs=require('fs');

// Setup HTTPS
/*
var https = require('https');
var httpsPort = 443;
var httpsoptions = {
  key: fs.readFileSync('/var/fhkeys/ttps/private.key'),
  cert: fs.readFileSync('/var/fhkeys/ttps/certificate.pem')
};
*/

//Setting Up Database, Needs to Async
var mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/test' );
mongoose.set('debug', true);
var models=require('./models');

//Setting Up Routes
var errors = require('./routes/errors');
var dummyapi = require('./routes/dummyapi');
var homeroute = require('./routes/home');
var profile = require('./routes/profile');
var blog = require('./routes/blog');
var events = require('./routes/event');


//Setting up Engine
var exphbs  = require('express-handlebars');
//exphbs.ExpressHandlebars.prototype.layoutsDir = '/home/ubuntu/tests/fh00/app/';
app.engine('hbs', exphbs({defaultLayout: 'index'}));
app.set('view engine', 'hbs');
app.enable('view cache'); //Enabled Caching for handlebars


//Setting Up Client Sessions 
const clientSessions = require("client-sessions");
app.use(clientSessions({
  cookieName: 'fhclSession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  cookie: {
//   path: '/api/v0.2/', // cookie will only be sent to requests under '/api'
//    maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
    ephemeral: false, // when true, cookie expires when the browser closes
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));
//

var bodyParser = require('body-parser');
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Express Session Init
app.use(session({
    secret: 'hiiihhaaa',
    //name: cookie_name,
    //store: sessionStore, // connect-mongo session store
    //proxy: true,
    //resave: true,
    //saveUninitialized: true
}));

// Providing Static Routes before passport
app.use(express.static('app'));


/*/Redirecting all IP based request to domain requests
app.use(function(req, res, next){
  console.log(req.get('host'));
  if(req.get('host')===sitePrimaryIP) {
      var fullUrl = req.protocol + '://' + sitePrimaryAddress + req.originalUrl;
    res.redirect(fullUrl);
  }
});
*/

//Passport
var passport = require('passport');
require('./config/passport.js')(passport,app);
app.use(passport.initialize());
app.use(passport.session());


//Routing
redirect(app);

homeroute(app);

// Securing all donation traffic
app.all('/donate*', function(req, res, next){
  if (req.secure) {
    return next();
  };
 res.redirect('https://'+req.hostname+':'+httpsPort+req.url);
});

app.get('/donate',function(req,res){
res.render('donate',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
});

profile(app,passport);
events(app);
blog(app);
dummyapi(app,path);
errors(app); // error handlers

//Routing ends

//Start Listening
var server=app.listen(80,function(){
var host = server.address().address;
var port = server.address().port;
console.log('App Listening at http://%s:%s',host,port);
});

//var secureServer = https.createServer(httpsoptions, app).listen(httpsPort);
