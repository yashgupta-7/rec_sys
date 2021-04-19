import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import Carousel from '../components/Carousel.jsx';
import _ from 'lodash';

import * as MovieActions from '../redux/actions/MovieActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ProfileActions from '../redux/actions/ProfileActions';

// import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

class Home extends React.Component {
  constructor() {
    super();

    this.renderFeatured = this.renderFeatured.bind(this);
    this.renderByGenre = this.renderByGenre.bind(this);
  }

  componentWillMount() {
    this.props.getFeaturedMovies(); // in the spotlight
    this.props.getMoviesByGenres(['Adventure', 'Drama']);
    // this.props.getRecos();
    // this.props.getProfileRatings();
  }

  render() {
    var {movies, auth, profile} = this.props;
    var {props} = this;
    var profile = _.get(props, 'profile');
    var name = _.get(props, 'profile.username');
    var isLoggedIn = !!_.get(props, 'auth.token');
    var isAdmin = name === "admin";
    console.log("Home", isLoggedIn, name, isAdmin);

    return (
        <div className="nt-home">
        <div className="row">
        {isLoggedIn ? null :  <h3 className="nt-home-header">Welcome! Please Log in</h3> }
          <div className="large-12 columns">
            {movies.isFetching ? <Loading/> : null}
            {this.renderFeatured()}
          </div>
          {/* {isLoggedIn ? */}
          <div className="large-12 columns">
            {/* <h2>Hello</h2> */}
            {this.renderByGenre('Adventure')}
            {/* {this.renderByGenre('Drama')} */}
          </div>
           {/* : null } */}
        </div>
        </div>
    );
  }

  renderFeatured() {
    // var {movies} = this.props;
    var {movies, auth, profile} = this.props;
    var {props} = this;
    var profile = _.get(props, 'profile');
    var name = _.get(props, 'profile.username');
    var isLoggedIn = !!_.get(props, 'auth.token');
    var isAdmin = name === "admin";

    return (
      <div className="nt-home-featured">
      {isLoggedIn ?
      <div>
      <div class="input-group">
        <input type="search" class="form-control rounded" placeholder="Search by Name" aria-label="Search" aria-describedby="search-addon" />
        <button type="button" class="btn btn-outline-primary">Search by Name</button>
      </div>

      <div class="input-group">
      <input type="search" class="form-control rounded" placeholder="Search by Genre" aria-label="Search" aria-describedby="search-addon" />
      <button type="button" class="btn btn-outline-primary">Search by Genre</button>
      </div>
      </div>
      : null }

        <h3 className="nt-home-header">In the Spotlight</h3>
        <ul>
          { _.compact(movies.featured).map(f => {
            return (
              // key={f.id}
              <li > 
                <Link to={`/movie/${f.id}`}>
                  <img src={f.posterImage} alt="" />
                  <h5>
                    {f.title}
                  </h5>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  renderByGenre(name) {
    var {movies} = this.props;
    console.log("GGGG",movies,name);
    var moviesByGenre = movies.byGenre; //['Drama'];
    console.log("GGGG",moviesByGenre);

    if (_.isEmpty(moviesByGenre)) {
      return null;
    }

    return (
      <div className="nt-home-by-genre">
        <h3 className="nt-home-header">My Recommended Movies</h3>
        <div className="nt-box">
          <div className="nt-box-title">
            {name}
          </div>
          {/* <Carousel> */}
          <div>
            { moviesByGenre.map(m => {
              return (
                <div key={m.id}>
                  <Link to={`/movie/${m.id}`}>
                    <img src={m.posterImage} alt="" />
                  </Link>
                  <div className="nt-carousel-movie-title">
                    <Link to={`/movie/${m.id}`}>{m.title}</Link>
                  </div>
                </div>
              );
            })}
            </div>
          {/* </Carousel> */}
        </div>
      </div>);
  }
}
Home.displayName = 'Home';

function mapStateToProps(state) {
  return {
    genres: state.genres.items,
    movies: state.movies,
    auth: state.auth,
    profile: _.get(state.profile, 'profile', null)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Home);
