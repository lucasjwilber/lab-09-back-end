'use strict';

//libraries:
const express = require('express');
const app = express();
require('dotenv').config();
const superagent = require('superagent');
const cors = require('cors');
app.use(cors());
const client = require('./modules/client.js');

//imports:
// const handleLocation = require('./modules/location.js');

const Weather = require('./modules/weather.js');


const PORT = process.env.PORT || 3003;

client.on('error', err => { throw err; });



//routes:
app.get('/location', handleLocation);
app.get('/weather', handleWeather);
app.get('/trails', handleTrails);
app.get('/movies', handleMovies);
app.get('/yelp', handleYelp);
app.get('*', handleError);




//cached data:
let storedUrls = {};


function handleLocation(request, response) {
  const location = request.query.data;


  //query db to see if location is in the table:
  client.query('SELECT search_query FROM geocode WHERE search_query=$1', [location])
    .then(results => {

      //if it's not, make the api call and add the data to the table:
      if (results.rowCount === 0) {

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GEOCODE_API_KEY}`;

        console.log('making the api call to geocode');
        superagent.get(url)
          .then(resultsFromSuperagent => {
            const locationObject = new Location(location, resultsFromSuperagent.body.results[0]);
            let geoDataResults = resultsFromSuperagent.body.results[0];
            let SQL = 'INSERT INTO geocode (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4) RETURNING *';
            let safeValues = [location, geoDataResults.formatted_address, geoDataResults.geometry.location.lat, geoDataResults.geometry.location.lng];

            client.query(SQL, safeValues);
            response.status(200).send(locationObject);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        //else, if it is, use the data from the db
        let SQL = 'SELECT * FROM geocode WHERE search_query=$1';
        client.query(SQL, [location])
          .then(results => {
            let locationObj = results.rows[0];
            response.status(200).send(locationObj);
          })
          .catch(error => {
            console.error(error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      response.status(500).send('server error.');
    });
}

function Location(location, geoData) {
  this.search_query = location;
  this.formatted_query = geoData.formatted_address;
  this.latitude = geoData.geometry.location.lat;
  this.longitude = geoData.geometry.location.lng;
}




function handleWeather(request, response) {
  const locationObj = request.query.data;

  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${locationObj.latitude},${locationObj.longitude}`;

  if (storedUrls[url]) {
    response.send(storedUrls[url]);
  } else {
    console.log('making the api call to darksky');
    superagent.get(url)
      .then(resultsFromSuperagent => {
        let daysOfWeather = resultsFromSuperagent.body.daily.data;
        //console.log(daysOfWeather);
        let weatherArray = daysOfWeather.map(day => {
          return new Weather(day);
        });

        console.log('done calling the darksky API');
        response.status(200).send(weatherArray);
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send('server error.');
      });
  }
};



function handleTrails(request, response) {
  const locationObj = request.query.data;
  const url = `https://www.hikingproject.com/data/get-trails?lat=${locationObj.latitude}&lon=${locationObj.longitude}&key=${process.env.TRAILS_API_KEY}`;


  if (storedUrls[url]) {
    response.send(storedUrls[url]);
  } else {
    console.log('making the api call to trails');
    superagent.get(url)
      .then(resultsFromSuperagent => {
        let trailsArr = resultsFromSuperagent.body.trails.map(prop => {
          return new Trail(prop);
        })
        //storedUrls[url] = trailsArr;
        response.status(200).send(trailsArr);

      })
      .catch((error) => {
        console.error(error);
        response.status(500).send('server error.');
      });

  }
}

function Trail(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.star_votes;
  this.summary = obj.summary;
  this.trail_url = obj.trail_url;
  this.conditions = obj.conditionStatus;
  //API returns a full string but the front end requires that string to be split up:
  this.condition_date = obj.conditionDate.split(' ')[0];
  this.condition_time = obj.conditionDate.split(' ')[1];
}

function handleError(request, response) {
  response.status(404).send('Server connection problem');
}


function handleMovies(request, response) {
  const location = request.query.data.search_query;
  console.log(location);

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${location}`;

  if (storedUrls[url]) {
    // console.log('using cached url', storedUrls[url]);
    response.send(storedUrls[url]);
  } else {
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
  }
};

function Movie(obj) {
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = `https://s3-media3.fl.yelpcdn.com/bphoto/${obj.poster_path}`;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}


function handleYelp(request, response) {
  const location = request.query.data.search_query;

  const url = `https://api.yelp.com/v3/businesses/search?location=${location}`;

  if (storedUrls[url]) {
    // console.log('using cached url', storedUrls[url]);
    response.send(storedUrls[url]);
  } else {
    console.log('making the api call to yelp');
    superagent.get(url)
      .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
      .then(resultsFromSuperagent => {
        let yelpResults = resultsFromSuperagent.body.businesses;

        response.status(200).send(yelpResults);
        console.log('done calling the yelp API');
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send('server error.');
      });
  }
}




client.connect()
  .then(() => {
    console.log('connected to db');
    app.listen(PORT, () => console.log(`app is listening on ${PORT}`));
  })
  .catch(err => {
    throw `PG Startup Error: ${err.message}`;
  });
