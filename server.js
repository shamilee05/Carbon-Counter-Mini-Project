// Server-side programming

const express = require('express'); // Require Express
const app = express(); // Create the app, basically the website
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening at the port")
}); // 3000 cause it most probably won't be used by any other server

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false })); // For POST requests
app.use(bodyParser.json()); //For POST requests
app.use(cookieParser());

// Temporary database for now
const database = {
    'Vehicular Travelling': {option1: 'Using a car', option2: 'Using a motorcycle'},
    'Domestic Activities': {option1: 'Using the geyser', option2: 'Using the kettle'},
    'Work Activities': {option1: 'Using the laptop', option2: 'Using the printer'}
};

var myLogger = function (req, res, next) {
    console.log('We will be displaying activities now.');
    next();
}
  
app.use(myLogger);

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

// var requestChecker = require('./middleware');

// // Add the middleware to express app 
// app.use(requestChecker);

// // Another middleware will get executed after above one.
// // Order of middleware is sequential.
// app.use(function(req,res) {
//     res.send('Hello there!');
// });


// For MongoDB
const mongoose = require('mongoose');
const url = /* "mongodb://localhost:27017/users" || */ "mongodb+srv://cluster0-2pnd0.mongodb.net/test?retryWrites=true&w=majority";

// Legacy code - Not needed with Mongoose5
// mongoose.Promise = global.Promise;

mongoose.connect(url,
    { 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false,
	dbName: 'users',
    	user: 'sham_ait',
    	pass: 'x3cbFO0coQE5FINr'
    },
	function(err,db) {  //Connect to the 'users' database using MongoDB
	if(err) {
		console.log("Error " + err);
	}
	else {
		console.log("Connected on url " + url);
	} 
});

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    tokens:[{
		access : {
			type : String,
			required : true
		},
		token : {
			type : String,
			required : true
		}
	}]
});

// 'users' is the name of the database
var UserModel = mongoose.model('UserModel', UserSchema, 'users');

// Creating a new user
app.post('/register_new_user', function(req,res) { 
    console.log("Creating a new user");
    var newUser = new UserModel();      //When creating a new user(document), always use the model and not the schema
    newUser.firstname = req.body.fname; 
    newUser.lastname = req.body.lname; 
    newUser.username = req.body.uname; 
    newUser.password = req.body.pwd; 
    
    // console.log(req.body.uname);

    newUser.save(function(err, users) {
        if(err) {
            console.log("Error "+err);
        } else {
            res.redirect("login.html");
        }
    })
});

// Reading the database and displaying all users' data
app.get('/display_all_users',function(req,res) {
    console.log('Show all users');
    UserModel.find({})
    .exec(function(err, users){
        if(err) {
            console.log("Error "+err);
        } else {
            res.json(users);
        }
    }); 
});

// Reading the database and displaying data for a particular user
app.get('/display_user/:uname',function(req,res) {
    console.log('Showing user for the given username');
    //console.log(req.params.uname);
    UserModel.findOne({ username: req.params.uname})
    .exec(function(err, user_part){
        if(err) {
            console.log("Error "+err);
        } else {
            res.json(user_part);
        }
    }); 
});

// Updating a user's data
app.put('/update_user/:uname',function(req,res) { 
    console.log('Updating user details');
    console.log(req.body.newpwd);
    UserModel.findOneAndUpdate({ username: req.params.uname}, { password: req.body.newpwd }, function(err,updateDoc) {
        if(err) {
            console.log("Error "+err);
        }
        else {
            res.send("User password updated successfully");
        } 
    })
});

// Deleting a user from the database
app.get('/delete_user/:uname',function(req,res) {
    console.log('Deleting this user');
    UserModel.deleteOne({ username: req.params.uname }, function (err) {
        if(err) {
            console.log("Error "+err);
        } else {
            res.send("User deleted successfully");
        }   
    });
});

// Verifying user before logging in 
app.post('/login_user', function(req,res) { 
    UserModel.findOne({ username: req.body.uname },(err,retrived_user)=> {
            if(retrived_user.password === req.body.pwd) {
                console.log("Successful Login");
                res.redirect("home.html");
            }
            else {
                console.log("Incorrect Password");
                res.send("Incorrect Password. Please enter the correct password.");
            }
        }    
    );
});

// Route not found (404)
app.use(function(req, res) {
    return res.status(404).send({ message: 'Route'+req.url+' Not found.' });
});
