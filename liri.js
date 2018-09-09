require("dotenv").config();
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
!!${error}!!
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
function omdbCallback(error, response, body){;
    if (!error && response.statusCode === 200) {
    }
}
function bandCallback(data){

}
function shortenArg(){
    var str = "";
    for (i=1;i < arg.length; i++){
        str += arg[i] + " ";
    }
    return str;
}
function doWork(){
    if(arg.length > 2){
        var str = shortenArg();
    } else {
        var str = arg[1];
    }
    switch(arg[0]){
        case "spotify-this":
            spotify.search({type: "track", query: str, limit: 1}).then(spotifyCallback);
        break;

        case "concert-this":
            var bands = require("https://rest.bandsintown.com/artists/" + str + "/events?app_id=codingbootcamp")
            bandCallback(data);
        break;

        case "movie-this":
            require("http://www.omdbapi.com/?t="+ str +"&y=&plot=short&apikey=trilogy",omdbCallback);
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
}

doWork();