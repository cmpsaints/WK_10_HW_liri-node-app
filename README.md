# WK_10_HW_liri-node-app

LIRI Node app --

LIRI is like iPhone's SIRI. However, while SIRI is a Speech Interpretation & Recognition Interface, LIRI is a "Language Interpretation & Recognition Interface". LIRI is a command line node app that takes in parameters and makes requests to `Bands In Town` for concerts, `Spotify` for songs, and `OMDB` for movies.


REQUIREMENTS:
- create a Node.js app that takes user inputs, passing in commands & queries from the CLI and from a file
- integrate [1]Bands In Town, [2]Spotify, and [3]OMDb APIs via NPM modules
- use asynch API calls in node (Axios) and parse/format returned responses, outputting them in the terminal and in a log file


TECHNOLOGIES USED:
- JavaScript
- Node.js
- built-in Node file system module (FS)
- axios.js (Node module for asynch API requests)
- moment.js (module for parsing/formatting time & dates)
- node-spotify-api.js (Spotify Node module for making API requests to Spotify)
- `Bands In Town` API (via asynch calls using Axios Node module)
- `Spotify` API (via asynch calls using Spotify Node module)
- `OMDb` API (via asynch calls using Axios Node module)


HOW TO USE / APP EXPLANATION:
- Spotify authentication keys are stored in a `.env` file, its contents are exported via `keys.js` to the `liri.js` app file
- app has 4 main features:
  (1) `Band In Town` concert lookup for an artist/band,
  (2) `Spotify` lookup for a song,
  (3) `OMDb` lookup for a movie,
  (4) read a query from a text file

1- To search for concerts, type in the CLI: node liri concert-this <artist/band name>
Returns to terminal-- Venue Name, Location, Date of the Event

2- To search for song info by name: node liri spotify-this-song <song name>
Returns to terminal-- Artist, Song Name, preview link from Spotify, Album Name

3- To search for movie info by title: node liri movie-this <movie name>
Returns to terminal-- Title, Release Year, IMDB Rating, Rotten Tomatoes Rating, Country of Origin, Language(s), Plot, Actors

4- Type: node liri do-what-it-says
Returns to terminal-- Artist: Backstreet Boys, Song Name: I Want It That Way, preview link from Spotify, Album Name: The Hits Chapter One