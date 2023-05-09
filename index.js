const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());


//morgan log writing
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//welcome message
app.get("/", (req, res) => {
  console.log("Welcome to myFlix");
  res.send("Welcome to myFlix!");
});

//POST (create) user data
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
  } else {
    res.status(400).send("Users needs names")
  }

})

});

//GET (read) - URL /movies/[title] to return movie data
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = topMovies.find( movie => movie.Title === title );
  
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("This is not a Top Movie")
  }

});


});

// GET (read) - URL /movies/genre/[genre name] to return genre information
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = topMovies.find( movie => movie.Director.Name === directorName ).Director;
  
  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("Director not in Top Movies")
  }

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