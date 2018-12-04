// ^^ initiate Node libraries & modules
var fs = require("fs");
var axios = require("axios");
var moment = require("moment");
var Spotify = require("node-spotify-api");

// ^^ require `dotenv` module to read in Spotify keys to app
require("dotenv").config();

// ^^ require `keys.js` file in order to pass Spotify keys to Spotify API
var keysJs = require("./keys.js"); 
var spotify = new Spotify(keysJs.spotify); 

// ^^ user command arguments stored assigned to variables
var liriArgum = process.argv;
var liriExecution = liriArgum[2];
var keyword = liriArgum.slice(3);

// ^^ formating variable for writing to `log.txt`
var newLine = "\r\n";


// *******************************************************
// switch-cases to run functions based on CLI argument passed to LIRI 
// -------------------------------------------------------

switch (liriExecution) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

// *******************************************************
// function to write to `log.txt`
// -------------------------------------------------------

function writeToLog(data) {
    fs.appendFile("log.txt", (data), function(err) {
        if (err) {
            return console.log(err);
        }
    });
    fs.appendFile("log.txt", "\r\n\r\n\r\n\r\n", function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(newLine + "log.txt was updated...");
    });
}

// *******************************************************
// function to make request to `Bands in Town Artist Events` API, when `liriExecution` (argument passed to LIRI) === "concert-this"
// -------------------------------------------------------

function concertThis() {
    console.log("\n");

    var logOutput = "";

    switch (keyword.length) {
        case 0:
            // ^^ if no artist/band name is given, LIRI responds with message stating nothing was entered
            logOutput = "REQUEST TERM... [no artist/band entered for Concert Search]";
            writeToLog(logOutput);
            return console.log(logOutput);
        default:
            var bandName = keyword.join("%20");
            // console.log("REQUEST TERM... " + bandName + "\n");
            logOutput = "REQUEST TERM... " + bandName + "\r\n\r\n";
    }

    // ^^ make request to `Bands in Town Artist Events` API
    var queryURL = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
 
    axios.get(queryURL)
    .then(function(response) {
        if (!response.data.length) {
            // console.log("Sorry, there are currently no concerts for that entry.");
            logOutput += "Sorry, there are currently no concerts for that entry.";
        } else {
            for (i = 0; i < response.data.length; i++) {
                // console.log("Venue: " + response.data[i].venue.name);
                // console.log("Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);

                logOutput += 
                    "Venue: " + response.data[i].venue.name + newLine +
                    "Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country + newLine;

                // ^^ event date (use Moment.js to format as MM/DD/YYYY)
                var date = response.data[i].datetime;
                var formatedDate = moment(date).format('MM/DD/YYYY');
                // console.log("Date: " + formatedDate);
                logOutput += "Date: " + formatedDate + newLine;

                // console.log("----------");
                if (i === response.data.length - 1) {
                    logOutput += "----------";
                } else {
                    logOutput += "----------\r\n";
                }
            }
        }

        console.log(logOutput);
        writeToLog(logOutput);
    })
    .catch(function(err) {
        console.log(err);
        logOutput += "There was an error in requesting the artist/band.";
        writeToLog(logOutput);
    });
}

// *******************************************************
// function to make request to Spotify API using `node-spotify-api` module, 
// when `liriExecution` (argument passed to LIRI) === "spotify-this-song"
// -------------------------------------------------------

function spotifyThisSong() {
    console.log("\n");

    var logOutput = "";

    switch (keyword.length) {
        case 0:
            // ^^ if no song title is given, LIRI defaults to "The Sign" by Ace of Base
            songName = "the sign ace of base";
            // console.log("The default for an unspecified song is The Sign.\n");
            logOutput = "The default for an unspecified song is The Sign.\r\n\r\n";
            break;
        default:
            songName = keyword.join(" ");
            // console.log("REQUEST TERM... " + songName + "\n");
            logOutput = "REQUEST TERM... " + songName + "\r\n\r\n";
    }

    // ^^ make request to Spotify API
    spotify.search( {type: "track", query: songName} )
    .then(function(response) {
        var tracks = response.tracks.items;

        // console.log("Artist: " + tracks[0].artists[0].name); 
        // console.log("Track Name: " + tracks[0].name);
        // console.log("Preview link: " + tracks[0].preview_url);
        // console.log("Album: " + tracks[0].album.name);

        logOutput += 
            "Artist: " + tracks[0].artists[0].name + newLine +
            "Track Name: " + tracks[0].name + newLine +
            "Preview link: " + tracks[0].preview_url + newLine +
            "Album: " + tracks[0].album.name;

        console.log(logOutput);
        writeToLog(logOutput);
    })
    .catch(function(err) {
        console.log(err);
        logOutput += "There was an error in requesting the song.";
        writeToLog(logOutput);
    });
}

// *******************************************************
// function to make request to OMDb API, when `liriExecution` (argument passed to LIRI) === "movie-this"
// -------------------------------------------------------

function movieThis() {
    console.log("\n");

    var logOutput = "";

    switch (keyword.length) {
        case 0:
            // ^^ if no movie title is given, LIRI defaults to "Mr Nobody"
            movieName = "Mr+Nobody";
            // console.log("The default for an unspecified movie is Mr Nobody.\n");
            logOutput = "The default for an unspecified movie is Mr Nobody.\r\n\r\n";
            break;
        default:
            movieName = keyword.join("+");
            // console.log("REQUEST TERM... " + keyword.join(" ") + "\n");
            logOutput = "REQUEST TERM... " + keyword.join(" ") + "\r\n\r\n"
    }

    // ^^ make request to OMDb API
    queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL)
    .then(function(response) {
        // console.log(response.data);

        if (response.data.Title === undefined) {
            logOutput += "LIRI did not find any movie matching that entry.";
            writeToLog(logOutput);
            return console.log(logOutput);
        }

        // console.log("Title: " + response.data.Title);
        // console.log("Year: " + response.data.Year);
        // console.log("IMDB Rating: " + response.data.imdbRating);

        // ^^ Rotten Tomatoes rating for the movie
        // if (response.data.Ratings[1] === undefined) {
        //     console.log("* Rating from 2nd source is undefined.");
        // } else {
        //     console.log(response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value);
        // }

        // console.log("Country: " + response.data.Country);
        // console.log("Language: " + response.data.Language);
        // console.log("Plot: " + response.data.Plot);
        // console.log("Actors: " + response.data.Actors);

        logOutput += 
            "Title: " + response.data.Title + newLine +
            "Year: " + response.data.Year + newLine +
            "IMDB Rating: " + response.data.imdbRating + newLine;

        // ^^ Rotten Tomatoes rating for the movie
        if (response.data.Ratings[1] === undefined) {
            logOutput += "* Rating from 2nd source is undefined." + newLine;
        } else {
            logOutput += response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value + newLine;
        }

        logOutput += 
            "Country: " + response.data.Country + newLine +
            "Language: " + response.data.Language + newLine +
            "Plot: " + response.data.Plot + newLine +
            "Actors: " + response.data.Actors;

        console.log(logOutput);
        writeToLog(logOutput);
    })
    .catch(function(err) {
        console.log(err);
        logOutput += "There was an error in requesting the movie.";
        writeToLog(logOutput);
    });
}

// *******************************************************
// function to make request to Spotify API with default song "I Want It that Way", 
// when `liriExecution` (argument passed to LIRI) === "do-what-it-says"
// -------------------------------------------------------

function doWhatItSays() {
    // using built-in `fs` node library, LIRI reads `random.txt` and passes string inside file as LIRI command
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        };

        data = data.split(",");
        // console.log(data);
        liriExecution = data[0];
        keyword = data[1].substr(1, data[1].length - 2).split(" ");
        // console.log(keyword);

        // runs LIRI command `spotify-this-song` for the song "I Want It That Way" as indicated in `random.txt`
        spotifyThisSong();
    }); 
}