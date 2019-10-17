Skip to content
Search or jump to…

Pull requests
Issues
Marketplace
Explore
 
@jcihnacik 
Learn Git and GitHub without any code!
Using the Hello World guide, you’ll start a branch, write comments, and open a pull request.


1
00gainstrive/LIRI-BOT
 Code Issues 0 Pull requests 0 Projects 0 Wiki Security Insights
LIRI-BOT/liri.js
@gainstrive gainstrive README.md Updated with video/desc .
7896545 3 hours ago
188 lines (165 sloc)  7.05 KB
  
// =======================================================
// =================== PACKAGES & REQS ===================
// =======================================================

require("dotenv").config();

// JS file containing a ref to our API keys...
var keys = require("./keys.js");
var Axios = require("axios");
var Spotify = require('node-spotify-api');
var Moment = require("moment");
var fs = require("fs");
var searchTerm = process.argv.slice(3).join("-");  // ** NO SPACES **
// =======================================================
// ================== COLLECT CLI ARGS ===================
// =======================================================

console.log("\n\n\n");
console.log("==========================");
console.log("INTRODUCING LIRI-BOT:");
console.log("---------------------")
console.log("LIRI takes in user commands\nand makes AXIOS calls to:\nSpotify, OMDB, Bands-In-Town.")
console.log("==========================\n");
console.log("AVAILABLE COMMANDS:\n'spotify-this-song', 'movie-this', 'concert-this', 'do-what-it-says'")

// Create a var that takes in cli args.
var nodeArgs = process.argv;
var liriCommand = [];
// Iterate through nodeArgs to create a string...
for (i = 2; i < nodeArgs.length; i++) {
    // Push arg into an empty array, used to intrp commands.
    liriCommand.push(nodeArgs[i]);
}

// =======================================================
// ================== INTERP. CLI ARGS ===================
// =======================================================

    // **** IF user uses the "this-song" command ***
if (liriCommand[0] === "spotify-this-song") {
    spotifySearch(searchTerm);
}
else if (liriCommand[0] === "do-what-it-says"){
    // Use node fs to read the contents of "random.txt"...
    fs.readFile("random.txt", "utf8", function(error, fileData) {

        // If the code encounters an error, log it...
        if (error) {
          return console.log(error);
        }
        // Split the contents of "random.txt" into an array...
        let fileArr = fileData.split(",")
        // Create a ref to the index we'll use to search spotify...
        var searchTerm = fileArr[1];
        // Call the spotifySearch() func. and pass in that refernce...
        spotifySearch(searchTerm);
      });
}
else if (liriCommand[0] === "movie-this") {
    omdbSearch();
}
else if (liriCommand[0] === "concert-this") {
    bandsInTownSearch();
}
else if(liriCommand[0] === "do-what-it-says") {
    spotifySearch();
}
else {
    throw "AVAILABLE COMMANDS:'spotify-this song-name-here'," + 
    "'movie-this movie-title-here"
}

// =======================================================
// =================== SPOTIFY COMMAND ===================
// =======================================================

function spotifySearch(searchTerm) {
    // Create a query term out of arguments supplied by the user..
    console.log("\n*** SEARCHING SPOTIFY for \"" + searchTerm + "\" ***");

    // Init a new instance of spotify...
    var spotify = new Spotify(keys.spotify);

    if (!searchTerm) {
            console.log("*** USING DEFAULT SEARCH ***")
            searchTerm = "gainstrive";
    }

    // Init a new spotify search w/ user search params.
    spotify
    .search({ type: 'track', query: searchTerm, limit: 1})
    .then(function(data) {
        let spotifyResponse = data.tracks.items;

        for (x = 0; x < spotifyResponse.length; x++ )
            // Create refs to use in cli output...
            artistName = data.tracks.items[x].album.artists[0].name;
            songTitle = data.tracks.items[0].name;
            albumTitle = data.tracks.items[0].album.name;
            link = data.tracks.items[0].external_urls.spotify;
            console.log("\n(DISPLAYING TOP RESULT)");
            console.log("===========\nARTIST: " + artistName + "\nSONG: " + songTitle +
            "\nALBUM: " + albumTitle + "\nSPOTIFY-LINK: " + link);
    })
    .catch(function(err) {
      console.log(err);
    });
}

// =======================================================
// ===================== OMDB COMMAND ====================
// =======================================================

function omdbSearch() {
    // Create a query term out of arguments supplied by the user...
    var movieTitle = process.argv.slice(3).join("-");  // ** NO SPACES **

    // IF user fails to enter an argument, default Mr-Nobody...
    if (movieTitle === "") {movieTitle = "Mr-Nobody";}
    console.log("\n*** SEARCHING OMDB for \"" + movieTitle + "\" ***");

    var queryURL = "https://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy"

    Axios({
        method: 'get',
        url: queryURL,
      })
        .then(function (data, error) {
            var title = data.data.Title;
            var year = data.data.Year;
            var imdbRating = data.data.imdbRating;
            var rottenTomatoes = data.data.Ratings[1].Value;
            var country = data.data.Country;
            var language = data.data.Language;
            var plot = data.data.Plot;
            var actors = data.data.Actors;
            if (data.status === 200) {
                console.log("\n===========\nTITLE: " + title + "\nYEAR: " + year +
                "\nIMDB-RATING: " + imdbRating + "\nROTTEN-TOMATOES: " + rottenTomatoes +
                "\nCOUNTRY: " + country + "\nLANGUAGE(S): " + language + "\nPLOT: " + plot +
                "\nACTORS: " + actors + "\n===========\n");
            }
            else if (error) {
                throw "MOVIE NOT FOUND!"
            }
        });
}

// =======================================================
// ================= BANDS IN TOWN COMMAND ===============
// =======================================================

function bandsInTownSearch() {
    // Create a query term out of arguments supplied by the user...
    var concertSearch = process.argv.slice(3).join("-");  // ** NO SPACES **

    // IF user fails to enter an argument, default Mr-Nobody...
    if (concertSearch === "") {concertSearch = "Foo-Fighters";}
    console.log("\n*** SEARCHING BANDS-IN-TOWN for \"" + concertSearch + "\" ***");

    var queryURL = "https://rest.bandsintown.com/artists/" + concertSearch + "/events?app_id=codingbootcamp";
    
    Axios({
        method: 'get',
        url: queryURL,
      })
        .then(function (data) {
            var events = data.data[0];
            // console.log(events);
            if (data.status === 200) {
                var lineup = events.lineup;
                var info = {
                    venueName: events.venue.name,
                    venueCountry: events.venue.country,
                    venueCity: events.venue.city,
                }
                var eventDate = events.venue.dateTime;
                var link = events.url;
                console.log("\n===========\nARTIST(S) : " + lineup + 
                "\nVENUE: " + info.venueName + "\nCOUNTRY: " + info.venueCountry +
                "\nCITY: " + info.venueCity + "\nDATE: " + Moment(eventDate).format("L") +
                "\nLINK :" + link + "\n===========\n");
            }
            else if (error) {
                throw "CONCERT NOT FOUND!"
            }
        });
}