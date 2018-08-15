var stripe = require('stripe')("sk_live_3QktKuwk8odp01gzpo8Z75bJ ");
var MongoClient = require('mongodb').MongoClient;
var configDB = require('../config/database.js');


module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

//QUIZ SECTION
    app.get('/quiz', function(req, res) {
        res.render('quiz.ejs');
  });
//STYLE Types
  app.get('/cart', function(req, res) {
    var cartArray;
    var cartCollection;
  var client = MongoClient.connect(configDB.url, function(err, client) {
      if(err)
          throw err;
      console.log("connected to the mongoDB !");
      var db = client.db('styleecommerce');
      cartCollection = db.collection('cart');
      var cart = cartCollection.findOne(function(err, doc) {
          console.log("the cart:" + JSON.stringify(doc));
          if (doc === null) {
              cartCollection.insertOne({cart:[req.query.prodId]}).then(function(db) {
                  console.log("inserted");
                  res.render('cart.ejs',{cartArray: [req.query.prodId]});
              });
          } else {
              cartArray = doc.cart;
              if (req.query.prodId){
                cartArray.push(req.query.prodId);
              cartCollection.updateOne({}, {$set: {"cart":cartArray}}).then(function(db) {
                  console.log("updated");
                  res.render('cart.ejs',{cartArray: cartArray});
              });
            }else{
              res.render('cart.ejs',{cartArray: cartArray});
            }
          }
      });

  });
      console.log("prodId"+req.query.prodId)

  });

    app.get('/blog', function(req, res) {
        res.render('blog.ejs');
      });

    app.get('/eclectic', function(req, res) {
        res.render('eclectic.ejs');
    });


    app.get('/maverick', function(req, res) {
        res.render('maverick.ejs');
    });

    app.get('/minimalist', function(req, res) {
        res.render('minimalist.ejs');
    });

    //product page
    app.get('/minprod1', function(req, res) {
        res.render('minimalistProducts/minprod1.ejs');
    });

    app.get('/minprod2', function(req, res) {
        res.render('minimalistProducts/minprod2.ejs');
    });

    app.get('/minprod3', function(req, res) {
        res.render('minimalistProducts/minprod3.ejs');
    });

    app.get('/minprod4', function(req, res) {
        res.render('minimalistProducts/minprod4.ejs');
    });

    app.get('/minprod5', function(req, res) {
        res.render('minimalistProducts/minprod5.ejs');
    });

    app.get('/minprod6', function(req, res) {
        res.render('minimalistProducts/minprod6.ejs');
    });

    app.get('/minprod7', function(req, res) {
        res.render('minimalistProducts/minprod7.ejs');
    });

    app.get('/minprod8', function(req, res) {
        res.render('minimalistProducts/minprod8.ejs');
    });

    app.get('/minprod9', function(req, res) {
        res.render('minimalistProducts/minprod9.ejs');
    });
    //success PAYMENT
    app.get('/paymentsuccess', function(req, res) {
        res.render('paymentsuccess.ejs');
    });

    app.post('/charge', function (req, res){
      const token = req.body.stripeToken; // Using Express
      const chargeAmount = req.body.chargeAmount;
      const charge = stripe.charges.create({
        amount: 0008,
        currency: 'usd',
        description: 'Example charge',
        source: token,
      },function(err, charge){
        if(err &err.type ==="StripeCardError"){
          console.log("yikes")
        }
      }
    );
    console.log("ayy")
    res.redirect('/paymentsuccess')
    })

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('messages').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            messages: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================






// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });
        
        //logout
        app.get('/logout', function(req, res) {
           req.logout();
           res.redirect('/');
         });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/quiz', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
