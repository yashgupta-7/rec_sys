const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const Movie = require('../models/neo4j/movie');
const Person = require('../models/neo4j/person');
const Genre = require('../models/neo4j/genre');
const User = require('../models/neo4j/user');

/**
 *  Query Functions
 */
 function remove_duplicates_safe(arr) {
  var seen = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
      if (!(arr[i]['title'] in seen) || !(arr[i]['username'] in seen)) {
          ret_arr.push(arr[i]);
          seen[arr[i]['title']] = true;
          seen[arr[i]['username']] = true;
          // console.log(arr[i]['title']);
      }
  }
  return ret_arr;

}
 function manyUsers(neo4jResult) {
    const result = {};
    result.friends = remove_duplicates_safe(neo4jResult.records.map(r => new User(r.get('user'))));
    // result.ratings = neo4jResult.records.map(r => new Movie(r.get('r'), r.get));
    result.movies = remove_duplicates_safe(neo4jResult.records.map(r => new Movie(r.get('m'), r.get('r'))));
    // for (var i = 0; i < arr.length; i++) {
    // result.friends = neo4jResult.records.map(r => new User(r.get('user')));
    // console.log(result['friends'][0]);
    return result;
  }
// Get in the spotlight
const getFriendsById = function (session, id) {
    const query = 'MATCH (user:User), (user)-[r:RATED_MOVIE]->(m:Movie) RETURN user, r, m LIMIT 5';
    // console.log(query);
    return session.readTransaction(txc =>
        txc.run(query, {
        })
      )
      .then(result => manyUsers(result))
  };

  const changeFriends = function (session, us1, us2, f) {
    if (f){
      const query = 'MATCH (u1: User{username: $us1}), (u2: User{username: $us2})' + 
                    'CREATE (u1)-[f:FOLLOWING]->(u2)';
    }
    else{
      const query = 'MATCH (u1: User{username: $us1})-[f:FOLLOWING]->(u2: User{username: $us2})' + 
                    'DELETE f';
    }
    // console.log(query);
    return session.readTransaction(txc =>
        txc.run(query, {
          us1: us1,
          us2: us2
        })
      );
      // .then(result => manyUsers(result))
  };

// export exposed functions
module.exports = {
  getFriendsById: getFriendsById,
  changeFriends: changeFriends
};

