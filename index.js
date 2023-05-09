const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://127.0.0.1:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

//morgan log writing
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//welcome message
app.get("/", (req, res) => {
  console.log("Welcome to myFlix");
  res.send("Welcome to myFlix!");
});

//READ - Return ALL movies
app.get('/movies', (req, res) => {
	Movies.find()
		.then((movies) => {
			res.status(201).json(movies);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// READ - Return ONE movie (all data) by 'movie title'
app.get('/movies/title/:Title', (req, res) => {
	Movies.findOne({ Title: req.params.Title })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: ' + req.params.Title + ' was not found');
			}
			res.status(201).json(movie);
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

// READ - Return ONE genre (description) by 'genre name'
app.get('/movies/genre_description/:Genre', (req, res) => {
	Movies.findOne({ 'Genre.Name': req.params.Genre })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: ' + req.params.Genre + ' was not found');
			} else {
				res.status(201).json(movie.Genre.Description);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//READ - Return director data (all) by 'director name'
app.get('/movies/director_description/:Director', (req, res) => {
	Movies.findOne({ 'Director.Name': req.params.Director })
		.then((movie) => {
			if (!movie) {
				return res.status(404).send('Error: ' + req.params.Director + ' was not found');
			} else {
				res.status(201).json(movie.Director);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//CREATE - user (new) by all parametres
app.post('/users', (req, res) => {
	Users.findOne({ Name: req.body.Name })
		.then((user) => {
			if (user) {
				return res.status(400).send(req.body.Name + ' already exists');
			} else {
				Users.create({
					Name: req.body.Name,
					Password: req.body.Password,
					Email: req.body.Email,
					Birthday: req.body.Birthday,
				})
					.then((user) => {
						res.status(201).json(user);
					})
					.catch((error) => {
						console.error(error);
						res.status(500).send('Error: ' + error);
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