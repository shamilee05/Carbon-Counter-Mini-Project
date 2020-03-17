// Server-side programming

const express = require('express'); // Require Express
const app = express(); // Create the app, basically the website
var bodyParser = require("body-parser");

app.listen(3000, () => {
    console.log("Listening at the port 3000")
}); // 3000 cause it most probably won't be used by any other server

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); // For POST requests
app.use(bodyParser.json()); //For POST requests

// Temporary database for now
const database = {
    'Vehicular Travelling': {option1: 'Using a car', option2: 'Using a motorcycle'},
    'Domestic Activities': {option1: 'Using the geyser', option2: 'Using the kettle'},
    'Work Activities': {option1: 'Using the laptop', option2: 'Using the printer'}
};

app.get('/activities', (req,res) => {
    const allActivities = Object.keys(database);
    // console.log("All of the activities are " + allActivities);
    // console.log(typeof allActivities);
    res.send(allActivities);
});

app.get('/activities/:activityID', (req,res) => {
    const activityToLookUp = req.params.activityID;
    var act = database[activityToLookUp];

    if(act) {
        res.send(act);
    }
    else {
        res.send("No such activity is available on our website as yet."); // The activity couldn't be looked up
    }
});

// For MongoDB
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String
});

// users is the name of the database
var UserModel = mongoose.model('UserModel', UserSchema, 'users');

const url = "mongodb://localhost:27017/users";

// Legacy code - Not needed with Mongoose5
// mongoose.Promise = global.Promise;

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err,db){
    if(err) {
        console.log("Error " + err);
    }
    else {
        console.log("Connected on url " + url);
} });

// Creating a new user
app.post('/register_new_user', function(req,res) { 
    console.log("Creating a new user");
    var newUser = new UserModel();
    newUser.firstname = req.body.fname; 
    newUser.lastname = req.body.lname; 
    newUser.username = req.body.uname; 
    newUser.password = req.body.pwd; 
    
    // console.log(req.body.uname);

    newUser.save(function(err, insertedDoc){
        if(err) {
            console.log("Error "+err);
        } else {
            res.redirect("login.html");
        }
    })
});

// Verifying user before logging in 
app.post('/login_user', function(req,res) { 
    console.log("Thodi si dhool meri");
    var found_user = UserModel.findOne({username: req.body.uname});

    if(found_user) {
        console.log(found_user.name);
        res.end();
    }
});
