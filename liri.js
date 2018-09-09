require("dotenv").config();
var request = require("request");
var omdb = require("omdb");
var bands = require("bandsintown")("codingbootcamp");
var Spotify = require("node-spotify-api");
var keys = require("./keys.js")
//console.log(keys.spotify);
var arg = process.argv
arg.splice(0,2);

function logError(type,action,text){
    switch(type){
        case "error":
            console.log(`
-----------ERROR-----------
==ACTION: ${action}==
!!${text}!!
---------------------------`);
        break;
        case "log":
            console.log(`
++++++++++SUCCUSS++++++++++
==ACTION: ${action}==
+++++++++++++++++++++++++++`);
        break;
    }
}
try {
    var spotify = new Spotify(keys.spotify);
    logError("log","spotify-connect");
} catch (error) {
    logError("error","spotify-connect",error.message)
}
function spotifyCallback(data){
    try {
        console.log(`ARTIST: ${data.tracks.items[0].artists[0].name}
ALBUMN: ${data.tracks.items[0].album.name}
TRACK NAME: ${data.tracks.items[0].name}
LINK: ${data.tracks.items[0].external_urls.spotify}`);
    } catch (error) {
        logError("error","Spotify Search",error)
    }
}
function omdbCallback(data){
//         console.log(`MOVE TITLE: ${data.title}
// RELEASE: ${data.year}
// RATING: ${data.imdbrating}
// PRODUCED IN: ${data.country}
// LANGUAGE: ${data.language}
// PLOT: ${data.plot}
// ACTORS: ${data.actors}`);
        console.log(data);
}
function bandCallback(data){
    ///console.log(data);
    
    for(i=0;i < data.length; i++){
        console.log(`WHERE: ${data[i].venue[1]}
${data[i].formatted_location}
WHEN: ${data[i].formatted_datetime}`);
if(i + 1 != data.length){
    console.log("========")
}
    }
}
function shortenArg(){
    var str = "";
    for (i=1;i < arg.length; i++){
        str += arg[i] + " ";
    }
    return str;
}
function doWork(){
try {
    if(arg.length > 2){
        var str = shortenArg();
    } else {
        var str = arg[1];
    }
    console.log(str);
    switch(arg[0]){
        case "spotify-this":
            spotify.search({type: "track", query: str, limit: 1}).then(spotifyCallback);
        break;

        case "concert-this":
            bands.getArtistEventList(str).then(function(events){
                console.log("==========" + str + "==========")
                console.log("EVENT LISTINGS")
                console.log("==================================")
                bandCallback(events);
                console.log("==================================")
            });
        break;

        case "movie-this":
        if (str = ""){
            console.log(`If you haven't watched "Mr. Nobody", then you should: http://www.imdb.com/title/tt0485947/
It's on Netflix!`);
            return;
        }
            //var queryURL = "https://www.omdbapi.com/?t="+ str +"&plot=short&apikey=trilogy"
            omdb.get({title: "Saw"},function(err, events){
                if (!err){
                    console.error(err)
                    logError("error","OMDB SEARCH",err.message);
                } else {
                    omdbCallback(events);
                }

            });
        break;

        case "do-what-it-says":
        break;
        default:
            logError("error","user input","invalid user input");
            console.log(`Please use the following commands follow by your search:
'spotify-this'
'convert-this'
'movie-this'
'do-what-it-says'`)
        break;
    }
} catch (error) {
    logError("error","Initial read",error)       ;
}
}

doWork();