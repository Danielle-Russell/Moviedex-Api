require('dotenv').config()
const express = require('express');
const morgan = require('morgan')
const MOVIES = require('./movie-data.json')

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
 app.use(morgan(morganSetting))

app.use(function validateBearerToken(req, res, next) {
     const apiToken = process.env.API_TOKEN
     const authToken = req.get('Authorization')
      if (!authToken || authToken.split(' ')[1] !== apiToken) {
            return res.status(401).json({ error: 'Unauthorized request' })
          }
      next()
     })
    

function getMovies (req, res) {
    let result = MOVIES;
const { genre, country, avg_vote } = req.query;
if(genre) {
result = result.filter(movie => 
    movie
    .genre
    .toLowerCase()
    .includes(genre.toLowerCase())
    )
}
if(country) {
    result = result.filter(movie =>
        movie
        .country
        .toLowerCase()
        .includes(country.toLowerCase()))
}
if(avg_vote) {
    result = result.filter(movie => {
        let vote = movie.avg_vote
        if(vote >= avg_vote) {
            return movie
        }
    }
    )
}
res.json(result)
    
}

app.get('/movie', getMovies)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' }}
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  

const PORT = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server listening on port ${PORT}`)
} )