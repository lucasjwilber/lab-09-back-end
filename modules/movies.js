'use strict';

const superagent = require('superagent');
const client = require('../modules/client.js');
require('dotenv').config();

function handleMovies(request, response) {
  const location = request.query.data.search_query;
  console.log(location);

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}`;

  console.log('making the api call to themoviedb');
  superagent.get(url)
    .then(resultsFromSuperagent => {
      let topMovies = resultsFromSuperagent.body.results;
      topMovies = topMovies.sort((a, b) => {
        if (a.popularity < b.popularity) { return 1; }
        else if (a.popularity > b.popularity) { return -1; }
        else { return 0; }
      });
      let movieResults = [];
      topMovies.forEach(movie => {
        movieResults.push(new Movie(movie));
      });
      response.status(200).send(movieResults);
      console.log('done calling the movie db API');
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('server error.');
    });

};

function Movie(obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

module.exports = handleMovies;