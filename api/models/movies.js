const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const Movie = require('../models/neo4j/movie');
const Person = require('../models/neo4j/person');
const Genre = require('../models/neo4j/genre');

const _singleMovieWithDetails = function (record, recordid) {
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
    result.related_movie = _.map(record.get('related_movie'), record => {
      return new Movie(record);
    });
    result.related_book = _.map(record.get('related_book'), record => {
      return new Movie(record);
    });
    // result.id =  _.map(record.get('directors'), record => {
    //   return new Movie(id);
    // });
    result.type = "Movie";
    if (recordid > 10000) {
      result.type = "Book";
    }
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
  // console.log("RESSS", neo4jResult);
  return neo4jResult.records.map(r => new Movie(r.get('movie')))
}

function remove_duplicates_safe(arr) {
  var seen = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
      if ((!(arr[i]['title'] in seen) || !(arr[i]['name'] in seen)) && (arr[i]['title'] || arr[i]['name'])) {
          ret_arr.push(arr[i]);
          seen[arr[i]['title']] = true;
          seen[arr[i]['name']] = true;
          // console.log(arr[i]['title']);
      }
  }
  return ret_arr;

}

function manyMoviesCross(neo4jResult) {
  // console.log("RESSS", neo4jResult);
  const result = {};
  result.movies = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('movie')))).slice(1, 6);
  result.books = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('book')))).slice(1, 6);
  result.genres = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('genre')))).slice(1, 6);
  return result;
}

function manyGenres(neo4jResult) {
  console.log("RESSS", neo4jResult);
  const result = {};
  result.movies = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('movie'))));
  result.genres = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('genre'))));
  // console.log("RESULT", result);
  return result;
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
  var query = //'MATCH (movie:Movie {id: $Id}) RETURN DISTINCT movie;' 
  [    'MATCH (movie {id: $movieId})',
      // '(movie:Movie OR movie:Book)',
      'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related_movie:Movie)<--(a:Person) WHERE related_movie <> movie',
    'OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (related_movie2:Movie)-->(genre:Genre) WHERE related_movie2 <> movie',
    'OPTIONAL MATCH (related_book:Book)-->(genre:Genre) WHERE related_book <> movie',
    'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {username: $userId})',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie,',
    'my_rated,',
    'genre, d, p, w, a, r,',
    'related_movie, related_movie2,',
    'related_book,',
    'count(related_movie) AS countRelated_movie, count(related_book) AS countRelated_book',
    'ORDER BY countRelated_book DESC, countRelated_movie DESC',
    // 'countRelated_movie DESC LIMIT 5',
    'RETURN DISTINCT movie,',
    'my_rated.rating AS my_rating,',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster, role:r.role}) AS actors,',
    'collect(DISTINCT related_movie)[..3] + collect(DISTINCT related_movie2)[..3] AS related_movie,',
    'collect(DISTINCT related_book)[..3]  AS related_book,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');
  if(parseInt(movieId) > 10000){
    query = [    'MATCH (movie {id: $movieId})',
    // '(movie:Movie OR movie:Book)',
    'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
  'OPTIONAL MATCH (related_movie:Movie)<--(a:Person) WHERE related_movie <> movie',
  'OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)',
  'OPTIONAL MATCH (related_movie2:Movie)-->(genre:Genre) WHERE related_movie2 <> movie',
  'OPTIONAL MATCH (related_book:Book)-->(genre:Genre) WHERE related_book <> movie',
  'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {username: $userId})',
  'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
  'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
  'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
  'WITH DISTINCT movie,',
  'my_rated,',
  'genre, d, p, w, a, r,',
  'related_movie, related_movie2,',
  'related_book,',
  'count(related_movie) AS countRelated_movie, count(related_book) AS countRelated_book',
  'ORDER BY countRelated_book DESC, countRelated_movie DESC',
  // 'countRelated_movie DESC LIMIT 5',
  'RETURN DISTINCT movie,',
  'my_rated.rating AS my_rating,',
  'collect(DISTINCT d) AS directors,',
  'collect(DISTINCT p) AS producers,',
  'collect(DISTINCT w) AS writers,',
  'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster, role:r.role}) AS actors,',
  'collect(DISTINCT related_movie)[..3] + collect(DISTINCT related_movie2)[..3] AS related_movie,',
  'collect(DISTINCT related_book)[..3]  AS related_book,',
  'collect(DISTINCT genre) AS genres',
].join('\n');
  }
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
        return _singleMovieWithDetails(result.records[0], parseInt(movieId));
      }
      else {
        throw {message: 'movie not found', status: 404}
      }
    });
};
// get a single movie by id
const getByName = function (session, movieId, userId) {
  var query = //'MATCH (movie:Movie {id: $Id}) RETURN DISTINCT movie;' 
  [    'MATCH (movie {title: $movieId})',
      // '(movie:Movie OR movie:Book)',
      'OPTIONAL MATCH (movie)<-[r:ACTED_IN]-(a:Person)',
    'OPTIONAL MATCH (related_movie:Movie)<--(a:Person) WHERE related_movie <> movie',
    'OPTIONAL MATCH (movie)-[:HAS_GENRE]->(genre:Genre)',
    'OPTIONAL MATCH (related_movie2:Movie)-->(genre:Genre) WHERE related_movie2 <> movie',
    'OPTIONAL MATCH (related_book:Book)-->(genre:Genre) WHERE related_book <> movie',
    'OPTIONAL MATCH (movie)<-[my_rated:RATED]-(me:User {username: $userId})',
    'OPTIONAL MATCH (movie)<-[:DIRECTED]-(d:Person)',
    'OPTIONAL MATCH (movie)<-[:PRODUCED]-(p:Person)',
    'OPTIONAL MATCH (movie)<-[:WRITER_OF]-(w:Person)',
    'WITH DISTINCT movie,',
    'my_rated,',
    'genre, d, p, w, a, r,',
    'related_movie, related_movie2,',
    'related_book,',
    'count(related_movie) AS countRelated_movie, count(related_book) AS countRelated_book',
    'ORDER BY countRelated_book DESC, countRelated_movie DESC',
    // 'countRelated_movie DESC LIMIT 5',
    'RETURN DISTINCT movie,',
    'my_rated.rating AS my_rating,',
    'collect(DISTINCT d) AS directors,',
    'collect(DISTINCT p) AS producers,',
    'collect(DISTINCT w) AS writers,',
    'collect(DISTINCT{ name:a.name, id:a.id, poster_image:a.poster, role:r.role}) AS actors,',
    'collect(DISTINCT related_movie)[..3] + collect(DISTINCT related_movie2)[..3] AS related_movie,',
    'collect(DISTINCT related_book)[..3]  AS related_book,',
    'collect(DISTINCT genre) AS genres',
  ].join('\n');
  console.log(query, movieId);
  //var x = 770;
  return session.readTransaction(txc =>
      txc.run(query, {
        movieId: movieId,
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
    // 'MATCH (m1:Movie), p=()-[r:RATED_MOVIE]->(m2:Movie) where m1.id = m2.id with avg(r.rating) as ar, m1 as movie RETURN movie order by ar desc LIMIT 5'
    // 'MATCH (m1:Movie), p=()-[r:RATED]->(m2:Movie), \
    // (b1:Book), pb=()-[rb:RATED]->(b2:Book) \
    // where (m1.id = m2.id and b1.id = b2.id) with avg(r.rating) as ar, avg(rb.rating) as arb, m1 as movie, b1 as book RETURN movie, book order by ar desc, arb desc'
    'MATCH (m1:Movie), p=()-[r:RATED]->(m2:Movie), \
(b1:Book), pb=()-[rb:RATED]->(b2:Book), \
(g1:Genre), pg=()-[lg:LIKES_GENRE]->(g2:Genre) \
where (m1.id = m2.id and b1.id = b2.id and g1.id = g2.id) \
with avg(r.rating) as ar, avg(rb.rating) as arb, count(lg) as clg, m1 as movie, \
b1 as book, g1 as genre RETURN movie, book, genre order by ar desc, arb desc, clg desc'
  ].join('\n');
  // console.log(query);
  return session.readTransaction(txc =>
      txc.run(query, {
      })
    )
    .then(result => manyMoviesCross(result))
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
    'MATCH (movie:Movie)-[:HAS_GENRE]->(genre:Genre) WHERE genre.id = $genreId RETURN movie;';
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
    ).then(result => {
      console.log("rrrrrrrrrrrrrrrr",result.records[0]);
      return manyMovies(result)
    });
};

//
const getByGenreName = function(session, genreId) {
  console.log("genreeeeeeeeeeeee");
  const query =
    // 'MATCH (movie:Movie)-[:HAS_GENRE_MOVIE ]->(genre:Genre) WHERE genre.name = $genreId RETURN movie, genre;';
    'match (movie:Movie)-[:HAS_GENRE]->(genre:Genre), (genre:Genre)<-[r2:LIKES_GENRE]-(u1)-[r:LIKES_GENRE]->(g2: Genre)'+
    'where genre.name = $genreId  with count(u1) as c, movie, g2 as genre return movie, genre order by c desc;'
//     MATCH (movie:Movie)-[:HAS_GENRE]->(genre:Genre)
// WHERE genre.name = 'Action'
// RETURN movie;
    // 'MATCH (movie:Movie)-[:IN_GENRE]->(genre)',
    // 'WHERE toLower(genre.name) = toLower($genreId) OR id(genre) = toInteger($genreId)', // while transitioning to the sandbox data             
    // 'RETURN movie'
  // console.log(query);
  return session.readTransaction(txc =>
      txc.run(query, {
        genreId: genreId
      })
    ).then(result => {
      // console.log("rrrrrrrrrrrrrrrr",result.records);
      return manyGenres(result)
    });
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
  var query = 'MATCH (u:User {username: $userId}),(m:Movie {id: $movieId}) \
  MERGE (u)-[r:RATED]->(m) \
  SET r.rating = $rating \
  RETURN m';
  if(parseInt(movieId) > 10000){
    var query = 'MATCH (u:User {username: $userId}),(m:Book {id: $movieId}) \
                 MERGE (u)-[r:RATED]->(m) \
                  SET r.rating = $rating \
                  RETURN m';
  }
  return session.writeTransaction(txc =>
    txc.run(
      query,
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

function filterRated(neo4jResult) {
  // console.log("RESSS", neo4jResult);
  const result = {};
  result.movies= remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('movie'), r.get('movie_rating'))));
  result.books = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('book'), r.get('book_rating'))));
  console.log(result);
  return result;
}

function filterRated_recommended(neo4jResult) {
  // console.log("RESSS", neo4jResult);
  const result = {};
  var seen={}
  result.movies2 = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('movie_genre'), r.get('movie_rating'))));
  result.movies= remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('movie'), r.get('movie_rating'))));
  for (var i = 0; i < result.movies.length; i++) {
      seen[result.movies[i]['title']]=true;
  }
  console.log(seen);
  for (var i = 0; i < result.movies2.length; i++) {
    if(!seen[result.movies2[i]['title']])
      result.movies.push(result.movies2[i]);
  }
  // result.movies= result.movies1+result.movies2;
  result.books = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('book'), r.get('book_rating'))));
  console.log(result);
  return result;
}

const getRatedByUser = function (session, userId) {
  console.log("rated result", userId);
  return session.readTransaction(txc =>
    txc.run(
      // 'MATCH (:User {username: $userId})-[rated:RATED]->(movie:Movie) \
      //  RETURN DISTINCT movie, rated.rating as my_rating',
      'Optional MATCH (u:User {username: $userId})-[rated1:RATED]->(movie:Movie) \
      OPTIONAL MATCH (u2:User {username: $userId})-[rated2:RATED]->(book:Book) \
      RETURN DISTINCT movie, book, rated1.rating as movie_rating, rated2.rating as book_rating',
      {userId: userId}
    )
  ).then(result => {
    console.log("rated result", result);
    return filterRated(result); //result.records.map(r => new Movie(r.get('movie'), r.get('movie_rating')))
  });
};

const getRecommended = function (session, userId) {
  console.log("CALED", userId);
  return session.readTransaction(txc =>
    txc.run(
      // 'MATCH (me:User)-[r1:LIKES_GENRE]->(g:Genre)<-[r2:LIKES_GENRE]-(u:User)-[r3:RATED_MOVIE]->(b2:Movie) \
      // WHERE me.username = $userId AND  r3.rating > 3 AND NOT (me)-[:RATED_MOVIE]->(b2) \
      // RETURN distinct b2 AS movie, count(*) AS count \
      // ORDER BY count DESC \
      // LIMIT 10',
      // // 'MATCH (me:User {id: $userId})-[my:RATED]->(m:Movie) \
      // // MATCH (other:User)-[their:RATED]->(m) \
      // // WHERE me <> other \
      // // AND abs(my.rating - their.rating) < 2 \
      // // WITH other,m \
      // // MATCH (other)-[otherRating:RATED]->(movie:Movie) \
      // // WHERE movie <> m \
      // // WITH avg(otherRating.rating) AS avgRating, movie \
      // // RETURN movie \
      // // ORDER BY avgRating desc \
      // // LIMIT 25',
      // {userId: userId}
      // 'MATCH (:User {username: $userId})-[rated:RATED]->(movie:Movie) \
      //  RETURN DISTINCT movie, rated.rating as my_rating',
      // {userId: userId}
      // 'MATCH (me:User {username: $userId} )-[r1:RATED]->(m:Movie)<-[r2:RATED]-(u:User)-[r3:RATED]->(m2:Movie) \
      // OPTIONAL MATCH (u)-[r6:RATED]->(m4:Book) \
      // WHERE  r1.rating > 3 AND r2.rating > 3 AND r3.rating > 3 AND (r6.rating > 3 OR r6 is NULL) AND NOT (me)-[:RATED]->(m2) \
      // RETURN distinct m2 AS movie, m4 as book, count(*) AS count, count(*) AS movie_rating, count(*) AS book_rating \
      // ORDER BY count DESC \
      // LIMIT 10',
      'MATCH (me:User {username: $userId} )-[r1:RATED]->(m:Movie)<-[r2:RATED]-(u:User)-[r3:RATED]->(m2:Movie) \
      WHERE  r1.rating > 3 AND r2.rating > 3 AND r3.rating > 3  AND NOT (me)-[:RATED]->(m2) \
           OPTIONAL MATCH (u)-[r6:RATED]->(m4:Book) \
            where  (r6.rating > 3 OR r6 is NULL) and NOT (me)-[:RATED]->(m4) \
            optional match (me)-[: LIKES_GENRE]->(g)<-[: HAS_GENRE]-(m_genre : Movie)<-[r5 : RATED]-()\
            where r5.rating > 3 and m_genre <> m2 \
           RETURN distinct m2 AS movie, m4 as book, m_genre as movie_genre, count(*) AS count, count(*) AS movie_rating, count(*) AS book_rating \
           ORDER BY count DESC \
           LIMIT 10',
      {userId: userId}
    )
  ).then(result => filterRated_recommended(result));
};

//
const getRecoByName = function (session, userId) {
  console.log("CALEDN", userId);
  return session.readTransaction(txc =>
    txc.run(
      'MATCH (me:User)-[r1:LIKES_GENRE]->(g:Genre)<-[r2:LIKES_GENRE]-(u:User)-[r3:RATED]->(b2:Book) \
      WHERE me.username = $userId AND  r3.rating > 3 AND NOT (me)-[:RATED]->(b2) \
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


const likeGenre = function (session, id, userId, f) {
  var query=""
  if (f==1){
    query = 'MATCH (u1: User {username: $userId}), (g : Genre {name : $id})' + 
    'CREATE (u1)-[:LIKES_GENRE]->(g)';
    console.log("Hey_if genre",userId,id,f);
  }
  else{
    query = 'MATCH (u1: User {username: $userId})-[f:LIKES_GENRE]->(g : Genre {name : $id}) ' + 
     'DELETE f';
     console.log("Hey_else genre",userId,id,f);
  }
  // console.log(query,us1,us2,f);
  return session.writeTransaction(txc =>
      txc.run(query, {
        userId: userId,
        id: id,
        f: f
      })
    );
    // .then(result => manyUsers(result))
};

const likeGenreCheck = function (session, id, userId) {
  const query= 'MATCH p=(u1: User {username: $userId})-[f:LIKES_GENRE]->(g : Genre {name : $id}) RETURN count(f) as c'
  console.log("LIKES GENRE CHECK",query,userId,id);
  return session.readTransaction(txc =>
      txc.run(query, {
        userId: userId,
        id: id
      })
    ).then(result => {
      console.log("like genre check query ",result.records,result.records.map(r => r.get('c')));
      return result.records.map(r => r.get('c'))
     });
};




// export exposed functions
module.exports = {
  getAll: getAll,
  getInSpotlight: getInSpotlight,
  getById: getById,
  getByName: getByName,
  getByDateRange: getByDateRange,
  getByActor: getByActor,
  getByGenre: getByGenre,
  getByGenreName: getByGenreName,
  getMoviesbyDirector: getByDirector,
  getMoviesByWriter: getByWriter,
  rate: rate,
  deleteRating: deleteRating,
  getRatedByUser: getRatedByUser,
  getRecommended: getRecommended,
  getRecoByName: getRecoByName,
  likeGenre: likeGenre,
  likeGenreCheck: likeGenreCheck
};
