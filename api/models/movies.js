const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const Movie = require('../models/neo4j/movie');
const Person = require('../models/neo4j/person');
const Genre = require('../models/neo4j/genre');

const _singleMovieWithDetails = function (record) {
  if (record.length) {
    const result = {};
    _.extend(result, new Movie(record.get('movie'), record.get('my_rating'))); //, record.get('my_rating')

    result.directors = _.map(record.get('directors'), record => {
      return new Person(record);
    });
    result.genres = _.map(record.get('genres'), record => {
      return new Genre(record);
    });
    result.producers = _.map(record.get('producers'), record => {
      return new Person(record);
    });
    result.writers = _.map(record.get('writers'), record => {
      return new Person(record);
    });
    result.actors = _.map(record.get('actors'), record => {
      return record;
    });
    result.related = _.map(record.get('related'), record => {
      return new Movie(record);
    });
    return result;
  } else {
    return null;
  }
};

/**
 *  Query Functions
 */

const _getByWriter = function (params, options, callback) {
  const cypher_params = {
    id: params.id
  };

  const query = [
    'MATCH (:Person {tmdbId: $id})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  callback(null, query, cypher_params);
};

function manyMovies(neo4jResult) {
  return neo4jResult.records.map(r => new Movie(r.get('movie')))
}

// get all movies
const getAll = function (session) {
  return session.readTransaction(txc => (
      txc.run('MATCH (movie:Movie) RETURN movie')
    ))
    .then(r => manyMovies(r));
};

// get a single movie by id
const getById = function (session, movieId, userId) {
  const query = //'MATCH (movie:Movie {id: $Id}) RETURN DISTINCT movie;' 
  [    'MATCH (movie:Movie {id: $movieId})',
    'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {username: $userId})',
    'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related:Movie)<--(a:Person) WHERE related <> movie',
    'OPTIONAL MATCH (movie)-[:IN_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie,',
    'my_rated,',
    'genre, d, p, w, a, r, related, count(related) AS countRelated',
    'ORDER BY countRelated DESC',
    'RETURN DISTINCT movie,',
    'my_rated.rating AS my_rating,',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster, role:r.role}) AS actors,',
    'collect(DISTINCT related) AS related,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');
  // console.log(query, movieId);
  //var x = 770;
  return session.readTransaction(txc =>
      txc.run(query, {
        movieId: parseInt(movieId),
        userId: userId
      })
    )
    .then(result => {
      console.log("rrrrrrrrrrrrrrrr",result.records[0]);
      if (!_.isEmpty(result.records)) {
        return _singleMovieWithDetails(result.records[0]);
      }
      else {
        throw {message: 'movie not found', status: 404}
      }
    });
};

// Get by date range
const getByDateRange = function (session, start, end) {
  const query = [
    'MATCH (movie:Movie)',
    'WHERE movie.released > $start AND movie.released < $end',
    'RETURN movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        start: parseInt(start || 0),
        end: parseInt(end || 0)
      })
    )
    .then(result => manyMovies(result))
};

// Get in the spotlight
const getInSpotlight = function (session) {
  const query = [
    // 'MATCH (movie:Movie) RETURN movie'
    'MATCH (m1:Movie), p=()-[r:RATED_MOVIE]->(m2:Movie) where m1.id = m2.id with avg(r.rating) as ar, m1 as movie RETURN movie order by ar desc LIMIT 5'
  ].join('\n');
  // console.log(query);
  return session.readTransaction(txc =>
      txc.run(query, {
      })
    )
    .then(result => manyMovies(result))
};

// Get by date range
const getByActor = function (session, id) {
  const query = [
    'MATCH (actor:Person {id: $id})-[:ACTED_IN]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        id: id
      })
    ).then(result => manyMovies(result))
};

// get a movie by genre
const getByGenre = function(session, genreId) {
  console.log("genreeeeeeeeeeeee");
  const query =
    'MATCH (movie:Movie)-[:HAS_GENRE_MOVIE ]->(genre:Genre) WHERE id(genre) = 1146 RETURN movie;';
//     MATCH (movie:Movie)-[:HAS_GENRE]->(genre:Genre)
// WHERE genre.name = 'Action'
// RETURN movie;
    // 'MATCH (movie:Movie)-[:IN_GENRE]->(genre)',
    // 'WHERE toLower(genre.name) = toLower($genreId) OR id(genre) = toInteger($genreId)', // while transitioning to the sandbox data             
    // 'RETURN movie'
  // console.log(query);
  return session.readTransaction(txc =>
      txc.run(query, {
        genreId: parseInt(genreId)
      })
    ).then(result => manyMovies(result));
};

// Get many movies directed by a person
const getByDirector = function(session, personId) {
  const query = [
    'MATCH (:Person {id: $personId})-[:DIRECTED]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: personId
      })
    ).then(result => manyMovies(result));
};

// Get many movies written by a person
const getByWriter = function(session, personId) {
  const query = [
    'MATCH (:Person {id: $personId})-[:WRITER_OF]->(movie:Movie)',
    'RETURN DISTINCT movie'
  ].join('\n');

  return session.readTransaction(txc =>
      txc.run(query, {
        personId: parseInt(personId)
      })
    ).then(result => manyMovies(result));
};

const rate = function (session, movieId, userId, rating) {
  console.log(movieId, userId, rating);
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {username: $userId}),(m:Movie {id: $movieId}) \
      MERGE (u)-[r:RATED]->(m) \
      SET r.rating = $rating \
      RETURN m',
      {
        userId: userId,
        movieId: parseInt(movieId),
        rating: parseInt(rating)
      }
    )
  );
};

const deleteRating = function (session, movieId, userId) {
  return session.writeTransaction(txc =>
    txc.run(
      'MATCH (u:User {id: $userId})-[r:RATED]->(m:Movie {id: $movieId}) DELETE r',
      {userId: parseInt(userId), movieId: parseInt(movieId)}
    )
  );
};

const getRatedByUser = function (session, userId) {
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (:User {username: $userId})-[rated:RATED]->(movie:Movie) \
       RETURN DISTINCT movie, rated.rating as my_rating',
      {userId: userId}
    )
  ).then(result => {
    return result.records.map(r => new Movie(r.get('movie'), r.get('my_rating')))
  });
};

const getRecommended = function (session, userId) {
  console.log("CALED", userId);
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (me:User)-[r1:LIKES_GENRE]->(g:Genre)<-[r2:LIKES_GENRE]-(u:User)-[r3:RATED_MOVIE]->(b2:Movie) \
      WHERE me.username = $userId AND  r3.rating > 3 AND NOT (me)-[:RATED_MOVIE]->(b2) \
      RETURN distinct b2 AS movie, count(*) AS count \
      ORDER BY count DESC \
      LIMIT 10',
      // 'MATCH (me:User {id: $userId})-[my:RATED]->(m:Movie) \
      // MATCH (other:User)-[their:RATED]->(m) \
      // WHERE me <> other \
      // AND abs(my.rating - their.rating) < 2 \
      // WITH other,m \
      // MATCH (other)-[otherRating:RATED]->(movie:Movie) \
      // WHERE movie <> m \
      // WITH avg(otherRating.rating) AS avgRating, movie \
      // RETURN movie \
      // ORDER BY avgRating desc \
      // LIMIT 25',
      {userId: userId}
    )
  ).then(result => manyMovies(result));
};

//
const getRecoByName = function (session, userId) {
  console.log("CALEDN", userId);
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (me:User)-[r1:LIKES_GENRE]->(g:Genre)<-[r2:LIKES_GENRE]-(u:User)-[r3:RATED_BOOK]->(b2:Book) \
      WHERE me.username = $userId AND  r3.rating > 3 AND NOT (me)-[:RATED_BOOK]->(b2) \
      RETURN distinct b2 AS book, count(*) AS count \
      ORDER BY count DESC \
      LIMIT 10',
      // 'MATCH (me:User {id: $userId})-[my:RATED]->(m:Movie) \
      // MATCH (other:User)-[their:RATED]->(m) \
      // WHERE me <> other \
      // AND abs(my.rating - their.rating) < 2 \
      // WITH other,m \
      // MATCH (other)-[otherRating:RATED]->(movie:Movie) \
      // WHERE movie <> m \
      // WITH avg(otherRating.rating) AS avgRating, movie \
      // RETURN movie \
      // ORDER BY avgRating desc \
      // LIMIT 25',
      {userId: userId}
    )
  ).then(result => manyMovies(result));
};

// export exposed functions
module.exports = {
  getAll: getAll,
  getInSpotlight: getInSpotlight,
  getById: getById,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre,
  getMoviesbyDirector: getByDirector,
  getMoviesByWriter: getByWriter,
  rate: rate,
  deleteRating: deleteRating,
  getRatedByUser: getRatedByUser,
  getRecommended: getRecommended,
  getRecoByName: getRecoByName
};
