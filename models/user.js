var mongoose              = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

//adds functions of passportLocalMongoose to UserSchema
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);