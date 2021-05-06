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

  // function constreturn(neo4jResult) {
  //   const result = {};
  //   result.c = neo4jResult.records.map(r => new User(r.get('user'))));
  //   return result;
  // }
// Get in the spotlight
const getFriendsById = function (session, id) {
    const query = 'MATCH (user2:User {username: $id})-[p : FOLLOWING]->(user : User), (user2)-[r:RATED]->(m:Movie) RETURN user, r, m LIMIT 5';
    console.log(query);
    return session.readTransaction(txc =>
        txc.run(query, {
          id : id
        })
      )
      .then(result => manyUsers(result))
  };

  const changeFriends = function (session, us1, us2, f) {
    var query=""
    if (f==1){
      // console.log("Hey22",query,us1,us2,f);
      //  query = 'MATCH (u1: User{username: $us1}), (u2: User{username: $us2}) where $us1<>$us2 ' + 
      //               'CREATE (u1)-[f:FOLLOWING]->(u2) CREATE (u2)-[f2:FOLLOWING]->(u1)';
      query = 'MATCH (u1: User{username: $us1}), (u2: User{username: $us2}) where $us1<>$us2 ' + 
      'CREATE (u1)-[f:FOLLOWING]->(u2)';
      console.log("Hey_if",query,us1,us2,f);
    }
    else{
      
      //  query = 'MATCH (u1: User)-[f:FOLLOWING]->(u2: User) ' + 
      //               'where (u1.username=$us1 and u2.username=$us2) or (u1.username=$us2 and u2.username=$us1) '+
      //                'DELETE f';
      query = 'MATCH (u1: User)-[f:FOLLOWING]->(u2: User) ' + 
      // 'where (u1.username=$us1 and u2.username=$us2) or (u1.username=$us2 and u2.username=$us1) '+
       'DELETE f';
      console.log("Hey_else",query,us1,us2,f);
    }
    // console.log(query,us1,us2,f);
    return session.writeTransaction(txc =>
        txc.run(query, {
          us1: us1,
          us2: us2
        })
      );
      // .then(result => manyUsers(result))
  };

  const findIfFriend = function (session, us1, us2) {
    const query= 'MATCH p=(u1: User{username : $us1})-[r:FOLLOWING]->(u2: User{username : $us2}) RETURN count(r) as c'
    console.log(query,us1,us2);
    return session.readTransaction(txc =>
        txc.run(query, {
          us1: us1,
          us2: us2
        })
      ).then(result => {
        return result.records.map(r => r.get('c'))
       });
  };

// export exposed functions
module.exports = {
  getFriendsById: getFriendsById,
  changeFriends: changeFriends,
  findIfFriend: findIfFriend
};

