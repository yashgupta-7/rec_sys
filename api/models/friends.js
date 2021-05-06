const _ = require('lodash');
const dbUtils = require('../neo4j/dbUtils');
const Movie = require('../models/neo4j/movie');
const Person = require('../models/neo4j/person');
const Genre = require('../models/neo4j/genre');
const User = require('../models/neo4j/user');

/**
 *  Query Functions
 */
 function manyUsers(neo4jResult) {
    return neo4jResult.records.map(r => new User(r.get('user')))
  }
// Get in the spotlight
const getInSpotlight = function (session) {
    const query = 'MATCH (user:User) RETURN user LIMIT 5';
    // console.log(query);
    return session.readTransaction(txc =>
        txc.run(query, {
        })
      )
      .then(result => manyUsers(result))
  };

// export exposed functions
module.exports = {
  getInSpotlight: getInSpotlight
};
