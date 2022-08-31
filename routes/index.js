var express = require('express'),
    router  = express.Router();       //this is express router
    
var passport = require('passport'),
    User     = require('../models/user')


// root route
router.get("/",(req,res)=>{
    res.render("landing");
})

//=================================================
//           AUTH ROUTES
//=================================================

//          ====SIGN UP ROUTES====


// show the SIGN UP form 
router.get("/register",function(req,res){
    res.render("register", {page: 'register'});
});

// handle the signup process
router.post("/register",function(req,res){
    var newUser = new User({username : req.body.username});
    User.register(newUser , req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        //this logs the user in ...takes care of session
        passport.authenticate("local")(req, res, function(){
            res.redirect("/houses");
        });
    });
});


//        =====LOGIN ROUTES====

// show the login form 
router.get("/login",function(req,res){
    res.render("login", {page: 'login'});
})

//LOGIN logic
//this is like app.post("/login",middleware,callback);
router.post("/login", passport.authenticate("local",
    {
        successRedirect : "/houses",
        failureRedirect : "/login"
    }), function(req,res){
    
})


//LOGOUT logic
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/houses");
})


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
