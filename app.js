var mongoose      = require('mongoose'),
    express       = require('express'),
    app           = express(),
    passport      =require('passport'),
    LocalStrategy = require('passport-local'),
    bodyParser    = require('body-parser'),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user'),
    seedDB        = require('./seeds'),
    methodOverride= require('method-override');
    
//requiring routes    
var commentRoutes    = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes      = require('./routes/index');


// this statement conncts mongoose to the yelp_camp database....if theres not one it will create yelp_camp database...
mongoose.connect("mongodb+srv://pandaanwesh33:Thesandstorm@1@housing.k0kz6.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true })
// Just Memorize this line ...this tells express to use bodyparser...
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// seedDB();    // seed the DB
app.use(methodOverride("_method"));


// PASSPORT CONFIGURATION   
app.use(require("express-session")({
    secret : "Hey there Buddy!!!",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this statement pass currentUser variable to every route as parameter....
// req.user contains info about the curently logged in user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

// app.listen(5000,'0.0.0.0',()=>{
//     console.log("server has started");
// });