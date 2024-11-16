const path = require('path');
const express = require('express');
const friends = require('./app/data/friends.json')

const app = express();
const PORT = 4500;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get index.html
app.use(express.static(path.join(__dirname, '/app/public')));

// get survey.html
app.get('/app/public/survey', (req, res) => {
    res.sendFile(path.join(__dirname, '/app/public/survey.html'));
});

// post results after survey is submitted
app.post("/results", function (req, res) {
    const newUser = req.body; // grab user's information from request body
    res.json(matchUser(newUser)) // run matchUser comparison function using newUser object data
});

// this compares user's answers with friends' answers to find closest match
function matchUser(newUser) {
    let matches = []; // to hold potential friends + their comparedScore
    let yourMatch; // to hold final friend match
    let userScore = newUser.scores; // user's array of scores

    // loop through friends array to pull individual score arrays
    for (let i = 0; i < friends.length; i++) {
        let friendsScore = friends[i].scores // friend's array of scores
        let comparedScore = 0; // to hold difference between user/friend scores

        // loop through friend's scores array, calculate difference between friend's answers and user's answers
        for (let j = 0; j < friendsScore.length; j++) {
            let diff = Math.abs(userScore[j] - friendsScore[j]); // difference between scores
            comparedScore = comparedScore += diff; // add the score difference from each iteration to the variable
        } // end j loop through friends' scores

        matches.push([comparedScore, friends[i]]); // pushes an item containing the total compared score difference between the user and the friend, and the corresponding friend object

        // calculate the lowest score to find best match, only keep that score in the array
        if (matches.length === 1) {
            // if there's only one entry in the array, do nothing
        } else if (matches[1][0] < matches[0][0]) {
            // if the current comparedScore is less than the value already in the array... 
            matches.shift(); // ...remove the first, larger item...
            yourMatch = matches[0][1]; // ...and set the yourMatch variable to the smaller item
        } else {
            // if the current comparedScore is larger than or equal to the value already in the array, remove the new item
            matches.pop();
            yourMatch = matches[0][1]; // set the yourMatch variable to the first item
        }
    } // end i loop through friends array
    return yourMatch; // return the user's best match
} // end matchUser

// port listener
app.listen(PORT, () => {
    console.log('server running on port ' + PORT)
});