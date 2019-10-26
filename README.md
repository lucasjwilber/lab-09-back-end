# lab-08-back-end

**Author**Lucas Wilber
**Collaborators** Will Huang, Rachel Rice, James Bond
**Version**: 2.3.0 (increment the patch/fix version number if you make more commits past your first submission)

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->
This is a back-end app that gets the search query input by a visitor on the front end, and using that returns information about movies, restaurants, trails, and weather, in a format which the front end can render. It also shows a map centered on the input location.

## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->
1. Create basic server with all packages installed (express, dotenv, cors)
2. Create an app on heroku.
3. Get API keys for Trails, TheMovieDB, Google Maps, Yelp, and DarkSky.
4. Create a route for each API call
5. Create a function for each route, which queries the respective API and sends the front-end the required data in the required format
6. Set up a Postgres DB on heroku
7. Add DB storage to each function to store the data.

## Architecture
<!-- Provide a detailed description of the application design. What technologies (languages, libraries, etc) you're using, and any other relevant design information. -->
- Languages: Javascript, SQL
- Libraries: express, cors, dotenv, superagent, pg
- APIs: yelp, themoviedb, trails, darksky, google geocode

## Change Log
== 1.0.0 ==
- Refactored code
- Database setup


**Number and name of feature: Repo Set-Up**

Estimate of time needed to complete: 30 minutes

Start time: 9:15

Finish time: 9:45

Actual time needed to complete: 30 minutes

**Number and name of feature: Location Queries**

Estimate of time needed to complete: 1 hour

Start time: 9:50

Finish time: 10:54

Actual time needed to complete: 1 hour 4 minutes

**Number and name of feature: Weather***

Estimate of time needed to complete: 1 hour

Start time: 11

Finish time: 11:25

Actual time needed to complete: 25 minutes

**Number and name of feature: Errors**

Estimate of time needed to complete: 20 minutes

Start time: 11:20

Finish time: 11:40

Actual time needed to complete: 20 minutes

**Number and name of feature: Refactor Code**

Estimate of time needed to complete: 45 minutes

Start time: 9:20

Finish time: 10:00

Actual time needed to complete: 40 minutes

**Number and name of feature: Database Setup**

Estimate of time needed to complete: 1 hour

Start time: 10:00

Finish time: 10:45

Actual time needed to complete: 45 minutes

**Number and name of feature: Database Caching**

Estimate of time needed to complete: 1 hour

Start time: 10:50

Finish time: 12:05

Actual time needed to complete: 1 hour 15 minutes

**Number and name of feature: Refactoring**

Estimate of time needed to complete: 1 hour

Start time: 9:00

Finish time:

Actual time needed to complete:

**Number and name of feature: Movies DB***

Estimate of time needed to complete: 30 minutes

Start time: 10:18

Finish time: 10:51

Actual time needed to complete: 33 minutes

**Number and name of feature: Yelp**

Estimate of time needed to complete: 1 hour

Start time: 10:55

Finish time: 11:50

Actual time needed to complete: 55 minutes

**Number and name of feature: Refactoring into different files**

Estimate of time needed to complete: 1 hour

Start time: 1:00

Finish time: 6:00

Actual time needed to complete: about 3 hours (took some breaks)
