const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//CORS Middleware (after ./auth) allowed origins)
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://tc-movie-api.herokuapp.com/', 'https://tc-movie-api.herokuapp.com/login', 'https://tc-movie-api.herokuapp.com/users', 'https://tc-movie-api.herokuapp.com/movies' ];

app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application does not allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

//Passport Middleware (after AUTH)
const passport = require('passport');
require('./passport');

//morgan log writing
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('combined', {stream: accessLogStream}));

//welcome message
app.get("/", (req, res) => {
  console.log("Welcome to myFlix");
  res.send("Welcome to myFlix!");
});

//READ - Return ALL movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.get('/movies/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.post('/users',
	//validation logic
	[
		check('Username', 'Username is required').isLength({min: 5}),
		check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
		check('Password', 'Password is required').not().isEmpty(),
		check('Email', 'Email does not appear to be valid').isEmail()
 	], (req, res) => {
	
	// check the validation object for errors
	let errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	
	let hashedPassword = Users.hashPassword(req.body.Password);
	Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
	  .then((user) => {
		if (user) {
		//If the user is found, send a response that it already exists
		  return res.status(400).send(req.body.Username + ' already exists');
		} else {
		  Users
			.create({
			  Username: req.body.Username,
			  Password: hashedPassword,
			  Email: req.body.Email,
			  Birthday: req.body.Birthday
			})
			.then((user) => { res.status(201).json(user) })
			.catch((error) => {
			  console.error(error);
			  res.status(500).send('Error: ' + error);
			});
		}
	})
	
	.catch((error) => {
		console.error(error);
		res.status(500).send('Error: ' + error);
	});
});

//UPDATE (change) - users data (all) by 'name'
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$set: {
				Username: req.body.Username,
				Email: req.body.Email,
				Password: req.body.Password,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true }
	)
		.then((user) => {
			if (!user) {
				return res.status(404).send('Error: No user was found');
			} else {
				res.json(user);
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
});

//UPDATE (add) - users favourite movie by 'name' (username) and 'movie ID'
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$addToSet: { FavouriteMovies: req.params.MovieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User was not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//UPDATE (remove) - users favourite movies by 'name' (username) and 'movie ID'
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{
			$pull: { FavouriteMovies: req.params.MovieID },
		},
		{ new: true }
	)
		.then((updatedUser) => {
			if (!updatedUser) {
				return res.status(404).send('Error: User not found');
			} else {
				res.json(updatedUser);
			}
		})
		.catch((error) => {
			console.error(error);
			res.status(500).send('Error: ' + error);
		});
});

//DELETE - user (all data) by 'name'
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
	Users.findOneAndRemove({ Username: req.params.Username })
		.then((user) => {
			if (!user) {
				res.status(404).send('User ' + req.params.Username + ' was not found');
			} else {
				res.status(200).send(req.params.Username + ' was deleted.');
			}
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send('Error: ' + err);
		});
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


//App listen
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});