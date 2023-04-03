const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();

//have expresss use common morgan setup
app.use(morgan('common'));

//top movie array for json
let topMovies = [
    {
        title: 'There Will Be Blood'
    }
];

//morgan log writing
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//welcome message
app.get("/", (req, res) => {
    console.log("Welcome to myFlix");
    res.send("Welcome to myFlix!");
  });

//have /movies URL call topMpovies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//serve documentation.html from public folder
app.use(express.static("public"));
app.get("/documentation", (req, res) => {
    res.sendFile("public/documentation.html", { root: __dirname });
});
 
//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('An error ocurred..');
});


