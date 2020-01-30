// Server-side programming

const express = require('express'); // Require Express
const app = express(); // Create the app, basically the website

app.listen(3000, () => {
    console.log("Listening at the port 3000")
}); // 3000 cause it most probably won't be used by any other server

app.use(express.static('actual_website'));

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