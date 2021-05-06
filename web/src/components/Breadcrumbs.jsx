import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Breadcrumbs extends React.Component {
  render() {
    var {movie, person} = this.props;

    return (
      <div>
      <ul className="breadcrumbs">
        <li><Link to="/" className={movie ? '' : 'current'}>Home</Link></li>
        {
          movie ?
            <li><Link to={`/movie/${movie.id}`} className="current">{movie.title}</Link></li>
            : null
        }
        {
          person ?
            <li><Link to={`/person/${person.id}`} className="current">{person.name}</Link></li>
            : null
        }
      </ul>
      </div>
      
    );
  }
}

Breadcrumbs.displayName = 'Breadcrumbs';
Breadcrumbs.propTypes = {
  movie: PropTypes.object,
  person: PropTypes.object
};
