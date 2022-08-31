var express = require('express'),
    router  = express.Router();      // this is express Router
var Campground = require('../models/campground');
var middleware = require('../middleware') //if we require a directory it will automatically require index.js inside that directory


// INDEX  -- show all campgrounds
router.get("/houses",(req,res)=>{
    //Get campgrounds from DB amd then render it
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            // console.log(allCampgrounds)
            res.render("campgrounds/index" ,{campgrounds:allCampgrounds, page: 'campgrounds'});  //req.user contians info about currently logged in user
        }
    });
});


// CREATE -- create a new campground 
router.post("/houses", middleware.isLoggedIn, (req,res)=>{
    // get data from the form and add it to the campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id , 
        username : req.user.username
    };
    //now push the datas to the campgrounds array
    var newCampground = {name: name,price: price, image:image, description: desc, author : author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            // now redirect to /campgrounds (get request)
            res.redirect("/houses");
        }
    })
    
});


// NEW -- show the form to create a new campground
router.get("/houses/new", middleware.isLoggedIn, (req,res)=>{
    res.render("campgrounds/new.ejs");
})


// SHOW -- shows more info about the campground
router.get("/houses/:id",function(req,res){
    // find the campground with provided id 
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
             // render show template for that campground
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
   
});


//EDIT CAMPGROUNDS
router.get("/houses/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findById(req.params.id, function(err,foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUNDS
router.put("/houses/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find ahttps://www.google.com/search?q=house&sxsrf=ALiCzsbhBA8AAbjwOZCQr79hN5ZI0J88vw:1656416105857&tbm=isch&source=iu&ictx=1&vet=1&fir=PCj5VWGURIThbM%252Cw_edFuvJNI2ApM%252C_%253B9qAvQPZ8JzcJqM%252CxCIuxCOW5lAuIM%252C_%253BzZX_6N9gJAnIFM%252Cycr1f-MM1FMK6M%252C_%253B9xns9Iqc3cNNsM%252CeJvVnNA6DtNy7M%252C_%253B6iqw6QtsXQQNqM%252CY9vB55R2tNGDmM%252C_%253Btlxt7ZlcQKIDTM%252CcxH1oOA7j7DoOM%252C_%253BTYbhjTZTg4cY3M%252CW1XZb07kUNqdBM%252C_%253BH8QuGQ6oGLUmwM%252CuzjYTWgExXvPCM%252C_%253B0uttkJggaCROfM%252CXK8DUNClm8MVmM%252C_%253BkLhGdOQP1hrl2M%252CsRMoSCUWF_uqtM%252C_%253BiWsLYOhk7RWGeM%252CN98AdZ30Tf_moM%252C_%253BYjx4mdlsPXD_uM%252CImAjdUBN0BOQSM%252C_&usg=AI4_-kRrauMOKdwOnQKws9g4Ff29x9JY-w&sa=X&ved=2ahUKEwi12tvshtD4AhXkxjgGHf6-CJkQ9QF6BAgGEAE#imgrc=PCj5VWGURIThbMnd update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
           res.redirect("/houses");
        }else{
            //redirect to the show page
            res.redirect("/houses/"+ req.params.id);
        }
    })
})

//DESTROY CAMPGROUND ROUTE
router.delete("/houses/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/houses");
        }else{
            res.redirect("/houses");
        }
    })
})







module.exports = router ;