// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var passport = require('passport');
var flash    = require('connect-flash');
// var stripe = require('stripe')("sk_live_3QktKuwk8odp01gzpo8Z75bJ");

var crypto = require('crypto');
var uuid = require('node-uuid');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

 //configure mongoDB



var cartCollection;
var client = MongoClient.connect(configDB.url, function(err, client) {
    if(err)
        throw err;
    console.log("connected to the mongoDB !");
    var db = client.db('styleecommerce');
    cartCollection = db.collection('cart');
    var cart = cartCollection.findOne(function(err, doc) {
        console.log(doc);
        if (doc === null) {
            cartCollection.insertOne({cart:[]});
        }
    });

});

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true }, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db);
}); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
