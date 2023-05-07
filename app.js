require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
//MORGAN AÑADIDO
const morgan = require("morgan")
app.use(morgan("dev"))
//FAVICON AÑADIDO
const favicon = require('serve-favicon')
const path = require('path')
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get("/", (req, res, next)=>{

    res.render("index.hbs")
})


app.get("/artist-search", (req, res, next)=>{
console.log(req.query)
spotifyApi
  .searchArtists(req.query)
  .then(data => {
    console.log('The received data from the API: ', data.body);
     res.render("artist-search-results.hbs", {
        artistas: data.body
     });
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch((err)=>{
    next(err)
  });
 
})
app.get('/albums/:artistId', async (req, res, next) => {
    try{
        const response = await spotifyApi.getArtistAlbums(req.params.artistId) 
        console.log(response)
        res.render("albums.hbs", {
            album: response
        })
    }catch(err){
        next(err)
    }
    
  });

  app.use((req, res)=>{
    res.status(404).render("not-found.hbs")
  })
  app.use((err, req,res,next)=>{
    res.status(500).render("error.hbs")

  })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
