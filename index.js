const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

//top movie array for json
let topMovies = [
    {
        Title: '1. There Will Be Blood'
    },
    {
        Title: '2. Law Abiding Citizen'
    },
    {  
        Title: '3. Star Wars: The Phantom Menace'
    },
    {
        Title: '4. Lord of the Rings: Two Towers'
    },
    {
        Title: '5. John Wick 4'
    },
    {    
        Title: '6. Gangs of New York'
    },
    {
        Title: '7. Catch Me if You Can'
    },
    {
        Title: '8. 300'
    },  
    {    
        Title: '9. Role Models'
    },
    {    
        Title: '10.Lord of the Rings: Return of the King'
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


//localhost:8080 
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });