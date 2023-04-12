const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');
const uuid = require('uuid');

app.use(bodyParser.json());

//users json
let users = [
  {
    "id": "1",
    "name": "Bill",
    "favouriteMovies": []
  },
  {
    "id": "2",
    "name": "Tom",
    "favouriteMovies": "Test"
  }
]
//top movies json
let topMovies = [   
      {
        Title: "The Lord of the Rings: The Return of the King", 
        Description: "Continuing the plot of the previous film, Frodo, Sam and Gollum are making their final way toward Mount Doom in Mordor in order to destroy the One Ring, unaware of true intentions, while Merry, Pippin, Gandalf, Aragorn, Legolas, Gimli and the rest are joining forces together against Sauron and his legions in Minas Tirith.",
        Genre: 
        {
            Name: "fantasy",
            Description: "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.",
        },
        Director: 
        {
            Name: "Peter Jackson",
            bio: "Sir Peter Robert Jackson is a New Zealand film director, screenwriter and producer.",
            Birthyear: "1961",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/be/The_Lord_of_the_Rings_-_The_Return_of_the_King_%282003%29.jpg",
        year: "2003",
        featured: "yes",
      },
      {
        Title: "Inception", 
        Description: "The film stars Leonardo DiCaprio as a professional thief who steals information by infiltrating the subconscious of his targets.",
        Genre: {
            Name: "science fiction",
            Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.",
        },
        Director: 
        {
            Name: "Christopher Nolan",
            bio: "Christopher Edward Nolan is a British-American filmmaker who is known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.",
            Birthyear: "1970",
            Deathyear: "present",
        },
        imageUrl: "https://www.dvdsreleasedates.com/posters/800/I/Inception-movie-poster.jpg",
        year: "2010",
        featured: "yes",
      },
      {
        Title: "Spirited Away", 
        Description: "During her move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.",
        Genre: {
            Name: "anime",
            Description: "Anime is a style of animation originating in Japan that is characterized by stark colorful graphics depicting vibrant characters in action-filled plots often with fantastic or futuristic themes.",
        },
        Director: 
        {
            Name: "Hayao Miyazaki",
            bio: "Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and manga artist.",
            Birthyear: "1941",
            Deathyear: "present",
        },
        imageUrl: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/412B0Cvv2GL._AC_UF894,1000_QL80_.jpg",
        year: "2001",
        featured: "yes",
      },
      {
        Title: "The Prestige", 
        Description: "The Prestige is based on the 1995 novel by Christopher Priest. It follows Robert Angier and Alfred Borden, rival stage magicians in Victorian London who feud over a perfect teleportation trick.",
        Genre: {
            Name: "thriller",
            Description: "Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.",
        },
        Director: 
        {
            Name: "Christopher Nolan",
            bio: "Christopher Edward Nolan is a British-American filmmaker who is known for his Hollywood blockbusters with complex storytelling, Nolan is considered a leading filmmaker of the 21st century.",
            Birthyear: "1970",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/d/d2/Prestige_poster.jpg",
        year: "2006",
        featured: "yes",
      },
      {
        Title: "Pirates of the Caribbean: The Curse of the Black Pearl",
        Description: "Blacksmith Will Turner teams up with eccentric pirate Captain Jack Sparrow to save his love, the daughter, from former pirate allies, who are now undead.",
        Genre: {
            Name: "action",
            Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
        },
        Director: 
        {
            Name: "Gore Verbinski",
            bio: "Gregor Justin Gore Verbinski is an American film director, screenwriter, producer, and musician.",
            Birthyear: "1964",
            Deathyear: "present",
        },
        imageUrl: "https://lumiere-a.akamaihd.net/v1/images/p_piratesofthecaribbean_thecurseoftheblackpearl_19642_d1ba8e66.jpeg",
        year: "2003",
        featured: "yes",
      },
      {
        Title: "Coco", 
        Description: "Aspiring musician Miguel, confronted with his ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
        Genre: {
            Name: "musical",
            Description: "Musical film is a film genre in which songs by the characters are interwoven into the narrative, sometimes accompanied by dancing.",
        },
        Director: 
        {
            Name: "Lee Unkrich",
            bio: "Lee Edward Unkrich (born August 8, 1967) is an American film director, film editor, screenwriter, and animator.",
            Birthyear: "1967",
            Deathyear: "present",
        },
        imageUrl: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/71dN0ekpUqL._AC_UF894,1000_QL80_.jpg",
        year: "2017",
        featured: "yes",
      },
      {
        Title: "Gone Girl", 
        Description: "With his disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when suspected that he may not be innocent.",
        Genre: {
            Name: "thriller",
            Description: "Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.",
        },
        Director: 
        {
            Name: "David Fincher",
            bio: "David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director.",
            Birthyear: "1962",
            Deathyear: "present",
        },
        imageUrl: "https://media.posterlounge.com/images/l/1900414.jpg",
        year: "2014",
        featured: "yes",
      },
      {
        Title: "Gone with the Wind", 
        Description: "Gone with the Wind is a 1939 American epic historical romance film adapted from the 1936 novel by Margaret Mitchell.",
        Genre: {
            Name: "romance",
            Description: "Romance films, romance movies, or ship films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters.",
        },
        Director: 
        { 
            Name: "Victor Fleming",
            bio: "Victor Lonzo Fleming was an American film director, cinematographer, and producer.",
            Birthyear: "1889",
            Deathyear: "1949",
        },
        imageUrl: "https://cdn.shopify.com/s/files/1/1057/4964/products/Gone-With-the-Wind-Vintage-Movie-Poster-Original-1-Sheet-27x41_a4b03463-4d56-4ba0-9370-08af7f40d9ac.jpg?v=1639623969",
        year:"1939",
        featured: "yes",
      },
      {
        Title: "Star Wars", 
        Description: "Amid a galactic civil war, Rebel Alliance spies have stolen plans to the Galactic Empire's Death Star, a massive space station capable of destroying entire planets. Imperial Senator Princess Leia Organa of Alderaan, secretly one of the Rebellion's leaders, has obtained its schematics, but her starship is intercepted by an Imperial Star Destroyer under the command of the ruthless Darth Vader. Before she is captured, Leia hides the plans in the memory system of astromech droid R2-D2, who flees in an escape pod to the nearby desert planet Tatooine alongside his companion, protocol droid C-3PO.",
        Genre: {
            Name: "science fiction",
            Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.",
        },
        Director: 
        {
            Name: "George Lucas",
            bio: "George Walton Lucas Jr. is an American filmmaker. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic and THX.",
            Birthyear: "1944",
            Deathyear: "present",
        },
        imageUrl: "https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/71r3KD7BatL._AC_UF894,1000_QL80_.jpg",
        year: "1977",
        featured: "yes",
      },
      {
        Title: "Avatar: The Way of Water", 
        Description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the race to protect their home.",
        Genre: {
            Name: "action",
            Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
        },
        Director: 
        {
            Name: "James Cameron", 
            bio: "James Francis Cameron is a Canadian filmmaker, who is a major figure in the post-New Hollywood era, he is considered one of the most innovative filmmakers, regularly pushing the boundaries of cinematic capability with his use of novel technologies.",
            Birthyear: "1954",
            Deathyear: "present",
        },
        imageUrl: "https://i.ebayimg.com/images/g/ycEAAOSwQNhjkAk6/s-l1600.jpg",
        year: "2022",
        featured: "yes",
      },
      {
        Title: "Pulp Fiction", 
        Description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
        Genre: {
            Name: "action",
            Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
        },
        Director: 
        {
            Name: "Quentin Tarantino", 
            bio: "Quentin Tarantino was born on March 27, 1963, in Knoxville, Tennessee. He is the only child of Connie McHugh, who is part Cherokee and part Irish, and actor Tony Tarantino, who left the family before Quentin was born. Moving to California at the age of 4, Tarantino developed his love for movies at an early age.",
            Birthyear: "1963",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/3b/Pulp_Fiction_%281994%29_poster.jpg",
        year: "1994",
        featured: "yes",
      },
      {
        Title: "Inglorious Basterds", 
        Description: "The film tells an alternate history story of two plots to assassinate Nazi Germany's leadership—one planned by Shosanna Dreyfus, a young French Jewish cinema proprietor, and the other by the British; but is ultimately conducted solely by a team of Jewish American soldiers led by First Lieutenant Aldo Raine.",
        Genre: {
            Name: "action",
            Description: "Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.",
        },
        Director: 
        {
            Name: "Quentin Tarantino", 
            bio: "Quentin Tarantino was born on March 27, 1963, in Knoxville, Tennessee. He is the only child of Connie McHugh, who is part Cherokee and part Irish, and actor Tony Tarantino, who left the family before Quentin was born. Moving to California at the age of 4, Tarantino developed his love for movies at an early age.",
            Birthyear: "1963",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/c/c3/Inglourious_Basterds_poster.jpg",
        year: "2009",
        featured: "yes",
      },
      {
        Title: "Star Wars: The Rise of Skywalker", 
        Description: "The Rise of Skywalker follows Rey, Finn, and Poe Dameron as they lead the Resistance's final stand against Supreme Leader Kylo Ren and the First Order, who are aided by the return of the Galactic Emperor, Palpatine. Lucasfilm Ltd.",
        Genre: {
            Name: "science fiction",
            Description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies.",
        },
        Director: 
        {
            Name: "George Lucas",
            bio: "George Walton Lucas Jr. is an American filmmaker. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic and THX.",
            Birthyear: "1944",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/af/Star_Wars_The_Rise_of_Skywalker_poster.jpg",
        year: "2019",
        featured: "yes",
      },
      {
        Title: "The Wizard of Oz", 
        Description: "Young Dorothy Gale and her dog Toto are swept away by a tornado from their Kansas farm to the magical Land of Oz, and embark on a quest with three new friends to see the Wizard, who can return her to her home and fulfill the others' wishes.",
        Genre: {
            Name: "fantasy",
            Description: "Fantasy films are films that belong to the fantasy genre with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.",
        },
        Director: 
        { 
            Name: "Victor Fleming",
            bio: "Victor Lonzo Fleming was an American film director, cinematographer, and producer.",
            Birthyear: "1889",
            Deathyear: "1949",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Wizard_of_oz_movie_poster.jpg/401px-Wizard_of_oz_movie_poster.jpg",
        year:"1939",
        featured: "yes",
      },
      {
        Title: "Fight Club", 
        Description: "It is based on the 1996 novel of the same name by Chuck Palahniuk. Norton plays the unnamed narrator, who is discontented with his white-collar job. He forms a fight club with soap salesman Tyler Durden (Pitt), and becomes embroiled in a relationship with a mysterious woman, Marla Singer (Bonham Carter).",
        Genre: {
            Name: "thriller",
            Description: "Thriller is a genre of fiction with numerous, often overlapping, subgenres, including crime, horror and detective fiction.",
        },
        Director: 
        {
            Name: "David Fincher",
            bio: "David Andrew Leo Fincher is an American film director. His films, mostly psychological thrillers, have received 40 nominations at the Academy Awards, including three for him as Best Director.",
            Birthyear: "1962",
            Deathyear: "present",
        },
        imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/fc/Fight_Club_poster.jpg",
        year: "1999",
        featured: "yes",
      }
]

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

//POST (create) user data for top movies
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
 
  let user = users.find( user => user.id == id );

  if (user) {
    user.favouriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to User ${id}'s array`)
  } else {
    res.status(400).send("Movie not added")
  }
})

//DELETE user data for top movies
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;
 
  let user = users.find( user => user.id == id );

  if (user) {
    user.favouriteMovies = user.favouriteMovies.filter( title => title != movieTitle)
    res.status(200).send(`${movieTitle} has been removed from User ${id}'s array`)
  } else {
    res.status(400).send("Movie not deleted")
  }
})

//DELETE user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
 
  let user = users.find( user => user.id == id );

  if (user) {
    users = users.filter( user => user.id != id)
    res.status(200).send(`User ${id} has been deleted`)
  } else {
    res.status(400).send("User not found")
  }
})

//PUT (update) user data
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find( user => user.id == id );

  if(user) {
    user.name = updatedUser.name;
    res.status(200).json(user)
  } else {
    res.status(400).send("User ID doens't exist")
  }
})

//GET (read) - URL /movies to return all topMpovies
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
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

// GET (read) - URL /movies/genre/[genre name] to return genre information
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = topMovies.find( movie => movie.Genre.Name === genreName ).Genre;
  
  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("Genre not in Top Movies")
  }

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