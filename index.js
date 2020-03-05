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

const userSchema = new Schema({
    username: String,
    password: String
});

mongoose.model('user', userSchema, 'users');

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
app.post('/student', function(req,res) { 
    console.log("Creating a new user");
    var newUser = new User(); 
    newUser.username = req.body.username; 
    newUser.password = req.body.password; 
    
    console.log(req.body.username);

    newUser.save(function(err, insertedDoc){
        if(err){
            console.log("Error "+err);
        } else{
            res.json(insertedDoc);
        }
    })
});