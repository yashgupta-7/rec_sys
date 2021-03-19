// extracts just the data from the query results

const _ = require('lodash');

const Movie = module.exports = function (_node, myRating) {
  _.extend(this, _node.properties);

  this.id = this.id;
  this.poster_image = this.poster_image;
  this.tagline = this.tagline;

  if (this.duration) { 
    this.duration = this.duration; //.toNumber();
  } else if (this.runtime) {
    this.duration = this.runtime.low;
  }

  if(myRating || myRating === 0) {
    this['my_rating'] = myRating;
  }
};
