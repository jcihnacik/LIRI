require(".env").config();

const request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var uCommand = process.argv[2];
var uParameter = process.argv[3];

function commandMenu(uCommand, uParameter){
  switch(uCommand){
      case 'concert-this':
        showThisConcert(uParameter);
        break;
      
      case 'spotify-this-song':
        showThisSpotify(uParameter);
        break;
      
      case 'movie-this':
        showThisMovie(uParameter);
        break;
      
    case 'do-what-it-says':
      showWhatItSays();
        break;
   
    default:
      console.log("Invalid input. Please use any of the following commands: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
  }
  
}

function showThisConcert(uParameter){
  var queryURL = "https://rest.bandsintown.com/artists/" + uParameter + "/events?app_id=codingbootcamp";
  request(queryURL, function(error, response, body){
   if (!error && response.statusCode === 200){
     let concerts = JSON.parse(body);
     for (i = 0; i < concerts.length; i++){
       let apiDateTimeInfo = concerts[i].datetime;
       let concertMonth = apiDateTimeInfo.substring(5,7);
       let concertDay = apiDateTimeInfo.substring(8,10);
       let concertYear = apiDateTimeInfo.substring(0,4);
       let apiDateTimeInfo = concertMonth + "/" + concertDay + "/" + concertYear;
       logThis("\n************************************\n");
       logThis("Date of Concert: " + apiDateTimeInfo);
       logThis("Name of Venue: " + concerts.venue.name);
       logThis("City: " + concerts.venue.city);
       logThis("\n************************************\n");
     }
   }
  })
};

function showThisSpotify(){
  var searchSong;
  if (uParameter === undefined){
    searchSong = "The Sign";
  } else {searchSong = uParameter};
  spotify.search(
  {type: "track",
   query: searchSong,
  }, function(error, data){
    if(error){
      logThis("Error occurred: " + error);
      return;
    } else {logThis("\n************************************\n");
           logThis("Song: " + data.tracks.items[0].name);
           logThis("Artist: " + data.tracks.items[0].artists[0].name);
           logThis("Album: " + data.tracks.items[0].album.name);
           logThis("Preview: " + data.tracks.items[3].preview_url);
           logThis("\n************************************\n");}
  } );
}

function showThisMovie(uParameter){
  var queryMovie;
  if (uParameter === undefined){
    queryMovie = "Mr. Nobody"
  } else {queryMovie = uParameter};
  // let queryURL = FIND THIS!;
  request (queryURL, function(err, res, body){
    let movie = JSON.parse(body);
    if (!err && res.statusCode === 200){
      logThis("\n************************************\n");
      logThis("Title: " + movie.title);
      logThis("Release Year: " + movie.Year);
      logThis("IMDB Rating: " + movie.imdbRating);
      logThis("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
      logThis("Country: " + movie.Country);
      logThis("Language: " + movie.Language);
      logThis("Plot: " + movie.Plot);
      logThis("Actors: " + movie.Actors);
      logThis("\n************************************\n");
    }
  });
    
};

// function showWhatItSays(){
//   fs.readFile("random.txt", "utf8", function(error, data){
//     if(error){
//       return logThis("Error occurred: " + error);
//     };
//     let randomArray = data.split(",");
//     if (randomArray[])
//   })
// };
              
function logThis(logData){
    console.log(logData);
    fs.appendFile('log.txt', logData + '\n', function(error){
      if(error){return logThis("Error logging to file: " + error);
               
    });
  }
 
commandMenu();
                  
              