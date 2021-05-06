
// friends.js
const Friends = require('../models/friends')
  , _ = require('lodash')
  , writeResponse = require('../helpers/response').writeResponse
  , writeError = require('../helpers/response').writeError
  , loginRequired = require('../middlewares/loginRequired')
  , dbUtils = require('../neo4j/dbUtils');

/**
 * @swagger
 * definition:
 *   Friend:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       username:
 *         type: string
 */



/**
 * @swagger
 * /api/v0/friends/spotlight:
 *   get:
 *     tags:
 *     - friends
 *     description: Find some users
 *     summary: Find some users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A list of users
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Friend'
 */
 exports.getFriendsInSpotlight = function (req, res, next) {
  Friends.getInSpotlight(dbUtils.getSession(req))
    .then(response => writeResponse(res, response))
    .catch(next);
};

