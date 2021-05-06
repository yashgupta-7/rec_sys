import React from 'react';
import { Link } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
// import Carousel from '../components/Carousel.jsx';
import _ from 'lodash';
import InputValidator from '../components/validation/InputValidator.jsx';

import * as MovieActions from '../redux/actions/MovieActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import axios from '../api/axios';
import settings from '../config/settings';


const {apiBaseURL} = settings;
// import * as ProfileActions from '../redux/actions/ProfileActions';

// import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';

class Home extends React.Component {
  constructor() {
    super();
    
    this.renderFeatured = this.renderFeatured.bind(this);
    this.renderByGenre = this.renderByGenre.bind(this);
    this.search_movie = this.search_movie.bind(this);
    this.handleChange_movie = this.handleChange_movie.bind(this);
    this.handleChange_genre = this.handleChange_genre.bind(this);
    this.state = {
      movie_name: '',
      genre_name: '',
     
    };
  }

  search_movie(e) {
    e.preventDefault();
    console.log("search movie in home.jsx");
    // return axios.get(`${apiBaseURL}/movies/770`);
    // if (this.props.isComponentValid()) {
      this.props.search_movie(this.state.movie_name);
    // }
  }

  componentWillMount() {
    this.props.getFeaturedMovies(); // in the spotlight
    var {movies, auth, profile} = this.props;
    var {props} = this;
    var profile = _.get(props, 'profile');
    var name = _.get(props, 'profile.username');
    var isLoggedIn = !!_.get(props, 'auth.token');
    var isAdmin = name === "admin";
    if (isLoggedIn) {
      this.props.getMoviesByGenres(['Adventure', 'Drama']);
    }
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
          {isLoggedIn ?
          <div className="large-12 columns">
            {/* <h2>Hello</h2> */}
            {this.renderByGenre('Adventure')}
            {/* {this.renderByGenre('Drama')} */}
          </div>
            : null } 
        </div>
        </div>
    );
  }
 

  renderFeatured() {
    // var {movies} = this.props;
    var {movies, auth, profile, movie_name, genre_name} = this.props;
    var {props} = this;
    var profile = _.get(props, 'profile');
    var name = _.get(props, 'profile.username');
    var isLoggedIn = !!_.get(props, 'auth.token');
    var isAdmin = name === "admin";

    return (
      <div className="nt-home-featured">
      {isLoggedIn ?
      <div>
      <div className="row">      
                <input name = "search_by_name"
                type="text"
                       placeholder="Search by movie name*"
                       required
                       value={movie_name}
                       onChange={this.handleChange_movie}
                       />
              </div>
              <div>
                  <Link to={`/movie/${this.state.movie_name}`} className="button ba-default-btn">Search by Name</Link>
                </div>

                <div className="row">      
                <input name = "search_by_genre"
                type="text"
                       placeholder="Search by genre*"
                       required
                       value={genre_name}
                       onChange={this.handleChange_genre}
                       />
              </div>
              <div>
                  <Link to={`/genre/${this.state.genre_name}`} className="button ba-default-btn">Search by Genre</Link>
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
  handleChange_movie(event) {
    this.setState({movie_name: event.target.value});}

    handleChange_genre(event) {
      this.setState({genre_name: event.target.value});}

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
          <div>
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
                  <div>
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
    // movie_name : ''
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Home);
