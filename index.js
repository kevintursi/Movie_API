const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const uuid = require('uuid');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let users = [
  {
    id: 1,
    name: 'Brent',
    favoriteMovies: []
  },
  {
    id: 2,
    name: 'Stephen',
    favoriteMovies: ['The Shawshank Redemption']
  },
];

let movies = [
  {
    "Title": "Superbad",
    "Description": "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.",
    "Genre": {
      "Name": "Comedy",
      "Description": "A comedy film is a category of film which emphasizes humor. These films are designed to make the audience laugh through amusement",
    },
    "Director": {
      "Name": "Greg Mottola",
      "Bio": "Gregory J. Mottola is an American film director, screenwriter, and television director.",
      "Birth": 1964,
    },
    "ImageUrl": "https://en.wikipedia.org/wiki/Superbad#/media/File:Superbad_Poster.png",
    "Featured": false
  },
  {
    "Title": "Good Will Hunting",
    "Description": "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist to find direction in his life.",
    "Genre": {
      "Name": "Psychological Drama",
      "Description": "A sub-genre of drama that places emphasis on psychological elements",
    },
    "Director": {
      "Name": "Gus Van Sant",
      "Bio": "Gus Van Sant is an American film director, producer, photographer, and musician.",
      "Birth": 1952,
    },
    "ImageUrl": "https://en.wikipedia.org/wiki/Good_Will_Hunting#/media/File:Good_Will_Hunting.png",
    "Featured": false
  },
  {
    "Title": "The Shawshank Redemption",
    "Description": "Andy Dufresne (Tim Robbins) is sentenced to two consecutive life terms in prison for the murders of his wife and her lover and is sentenced to a tough prison. However, only Andy knows he didn't commit the crimes. While there, he forms a friendship with Red (Morgan Freeman), experiences brutality of prison life, adapts, helps the warden, etc., all in 19 years.",
    "Genre": {
      "Name": "Drama",
      "Description": "A drama film is a category or genre of narrative fiction (or semi-fiction) intended to be more serious than humorous in tone.",
    },
    "Director": {
      "Name": "Frank Darabont",
      "Bio": "Frank Darabont is an American film director, screenwriter, and producer.",
      "Birth": 1959,
    },
    "ImageUrl": "https://en.wikipedia.org/wiki/The_Shawshank_Redemption#/media/File:ShawshankRedemptionMoviePoster.jpg",
    "Featured": false
  }
]
/*let topMovies = [
  {
    title: 'Good Will Hunting',
    director: 'Gus Van Sant'
  },
  {
    title: 'Superbad',
    director: 'Greg Mottola'
  },
  {
    title: 'The Shawshank Redemption',
    director: 'Frank Darabont'
  },
  {
    title: 'Saving Private Ryan',
    director: 'Steven Spielberg'
  },
  {
    title: 'Spider-Man',
    director: 'Sam Raimi'
  },
  {
    title: 'The Dark Knight',
    director: 'Christopher Nolan'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese'
  },
  {
    title: 'The Departed',
    director: 'Martin Scorsese'
  },
  {
    title: 'Hereditary',
    director: 'Ari Aster'
  },
  {
    title: 'Scareface',
    director: 'Brian De Palma'
  }
];*/

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));
app.use(bodyParser.json());

//GET route for requests
app.get('/', (req, res) =>{
  res.send('Welcome to MyFlix!');
});

//get all Movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
});

// get Movies by Title
app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find(movie => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No movie found with that title');
  }
});

// Get movie genre
app.get('/movies/genre/:genreName', (req,res) => {
  const { genreName } = req.params;
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre');
  }
});

// Get director's Name
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(movie => movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such director');
  }
});

// Allow new users to register
app.post('/users', (req, res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send('users need name');
  }
});

//Allow users to update their user information
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

//Allow users to add movies to favorites list
app.post('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

//Delete movie from favorite list
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

//Allow existing users to deregister
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

  if (user) {
    users = users.filter(user => user.id == id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
  }
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

// Error Handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('There was an error. Please try again soon!');
});

// Request listener
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
