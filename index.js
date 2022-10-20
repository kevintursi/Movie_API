const express = require('express');
  morgan = require('morgan');

  fs = require('fs'),
  path = require('path');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

let topMovies = [
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
];

app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));

//GET route for requests
app.get('/', (req, res) =>{
  res.send('Welcome to MyFlix!');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
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
