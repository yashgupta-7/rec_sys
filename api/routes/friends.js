
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
 * /api/v0/friends/{id}}:
 *   get:
 *     tags:
 *     - friends
 *     description: Find some users
 *     summary: Find some users
 *     parameters:
 *       - name: id
 *         description: user id
 *         in: path
 *         required: true
 *         type: string
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
 exports.getFriendsById = function (req, res, next) {
  const id = req.params.id;
  Friends.getFriendsById(dbUtils.getSession(req), id)
    .then(response => writeResponse(res, response))
    .catch(next);
};

