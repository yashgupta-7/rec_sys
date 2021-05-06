import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
import Carousel from '../components/Carousel.jsx';
import UserRating from '../components/UserRating.jsx';
import {Link} from 'react-router-dom';
import * as MovieActions from '../redux/actions/MovieActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class Movie extends React.Component {
  componentDidMount() {
    var {id} = this.props.match.params;
    this.props.getMovie(id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.clearMovie();

      var {id} = this.props.match.params;
      this.props.getMovie(id);
    }
  }

  componentWillUnmount() {
    this.props.clearMovie();
  }

  render() {
    var {isFetching, movie, rateMovie, deleteMovieRating, profile} = this.props;
    console.log("MOVIEEEEEEEEEEEEEEEE", movie, deleteMovieRating);
    return (
      <div className="nt-movie">
        {isFetching ? <Loading/> : null}
        {movie ?
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h2 className="nt-movie-title">{movie.title}</h2>
              </div>
            </div>
            <div className="row">
              </div>
              {/* <div className="small-12 medium-8 columns nt-movie-main"> */}
              <div className="small-12 medium-8 columns nt-movie-main">
                <div>
                  <div className="nt-box">
                  {/* <div className="nt-box-title">
                    Storyline
                  </div> */}
                  <p className="nt-box-row">
                  <strong>Tagline: </strong>
                   <span>{movie.tagline}</span> 
                  </p>
                
        
                    <p className="nt-box-row">
                      <strong>Year: </strong><span>{movie.released}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Duration: </strong><span>{`${movie.duration} mins`}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Genres:</strong>
                      <span>{this.renderGenre(movie.genres)}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Directed By: </strong>
                      <span>{this.renderPeople(movie.directors)}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Cast: </strong>
                      <span>{this.renderCast(movie.actors)}</span>
                    </p>
                    <p className="nt-box-row">
                      <strong>Related Movies: </strong>
                      <span>{this.renderRelatedMovies(movie.related)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="small-12 medium-4 columns nt-movie-aside">
                <img className="nt-movie-poster"
                     src={movie.posterImage}
                     alt="" />
                {profile ?
                    <div className="nt-box">
                      <p className="nt-box-row nt-movie-rating">
                        <strong>Your rating: {movie.myRating} </strong>
                        <UserRating movieId={movie.id}
                                    savedRating={movie.myRating}
                                    onSubmitRating={rateMovie}
                                    onDeleteRating={deleteMovieRating}/>
                      </p>
                    </div>
                    :
                    null
                  }
            </div>
          </div>
          :
          null
        }
      </div>
    );
  }

  getKeywordsText(movie) {
    _.filter(movie.keywords, k => {
      return !!k.name;
    })
      .join(', ');
  }

  

  renderCast(actors) {
    if (_.isEmpty(actors)) {
      return null;
    }

    return (
          actors.map((a,i) => {
            return (
              <span key={a.id}>
                <span className="nt-carousel-actor-name"><Link to={`/person/${a.id}`}>{a.name}</Link></span>
                <span> (</span> 
                <span className="nt-carousel-actor-role">{a.role}</span>
                <span>)</span>
                {i < actors.length - 1 ? <span>, </span> : null}
              </span>
            );
          })
       );
  }
  renderPeople(people) {
    // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", people);
    return people.map((p, i) => {
      return (
        <span key={p.id}>
        <Link to={`/person/${p.id}`}>{p.name}</Link>
          {i < people.length - 1 ? <span>, </span> : null}
      </span>);
    });
  }

  renderRelatedMovies(movies) {
    if (_.isEmpty(movies)) {
      return null;
    }
    return (
          movies.map((m,i) => {
            return (
              <span key={m.id}>
                 <Link to={`/movie/${m.id}`}>
                  <img src={m.posterImage} alt="*" />
                </Link>
                  <Link to={`/movie/${m.id}`}>{m.title}</Link>
                  {i < movies.length - 1 ? <span>, </span> : null}
              </span>
            );
          }));
  }

  

  renderGenre(genres) {
    // console.log("HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH", genres);
    return genres.map((g, i) => {
      return (<span key={g.id}>
        {g.name}
        {i < genres.length - 1 ? <span>, </span> : null}
      </span>);
    });
  }
}
Movie.displayName = 'Movie';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    isFetching: state.movies.isFetching,
    profile: _.get(state, 'profile.profile')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Movie);
