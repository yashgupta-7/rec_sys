import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
// import Carousel from '../components/Carousel.jsx';
import UserRating from '../components/UserRating.jsx';
import {Link} from 'react-router-dom';
import * as MovieActions from '../redux/actions/MovieActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


class Genre extends React.Component {
  componentDidMount() {
    var {id} = this.props.match.params;
    this.props.getGenre(id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.clearGenre();

      var {id} = this.props.match.params;
      this.props.getGenre(id);
    }
  }

  componentWillUnmount() {
    this.props.clearGenre();
  }

  render() {
    var {isFetching, movie, rateMovie, deleteMovieRating, profile, genre} = this.props;
    console.log("MOVIEEEEEEEEEEEEEEEE", movie, genre, deleteMovieRating, genre['genres']);
    var page_link = window.location.href;
    var Genre = page_link.substr(page_link.lastIndexOf('/')+1); //genre['genres'][0]['name']; 
    console.log(Genre);
    return (
      <div className="nt-movie">
        {isFetching ? <Loading/> : null}
        {/* ////////////////////////////////////////////////////////// */}
        <div className="nt-home-by-genre">
        <h3 className="nt-home-header">{Genre} Movies</h3>
        <div className="nt-box">
          <div>
            {/* {name} */}
          </div>
          {/* <Carousel> */}
          <ul>
          { _.compact(genre['movies']).map(f => {
            return (
              // key={f.id}
              <li > 
                <div className="nt-box">
                <Link to={`/movie/${f.id}`}>
                  <img src={f.posterImage} alt="" />
                  <h5>
                    {f.title}
                  </h5>
                </Link>
                </div>
              </li>
            );
          })}
        </ul>
          {/* </Carousel> */}
        </div>

        <h3 className="nt-home-header">Related to {Genre}</h3>
        <div className="nt-box">
          <div>
            {/* {name} */}
          </div>
          {/* <Carousel> */}
          <ul>
          { _.compact(genre['genres']).map(f => {
            return (
              // key={f.id}
              <li > 
                <div className="nt-box">
                <Link to={`/genre/${f.name}`}>
                  <img src={f.posterImage} alt="" />
                  <h5>
                    {f.name}
                  </h5>
                </Link>
                </div>
              </li>
            );
          })}
        </ul>
          {/* </Carousel> */}
        </div>

      </div>);
      {/* /////////////////////////////////////////////////// */}
        {movie ?
          <div>
            <div className="row">
              <div className="large-12 columns">
                <h2 className="nt-movie-title">{movie.title}</h2>
              </div>
            </div>
            <div className="row">
              <div className="small-12 medium-4 columns nt-movie-aside">
                <img className="nt-movie-poster"
                     src={movie.posterImage}
                     alt="" />
                <div className="nt-box">
                  <div className="nt-box-title">
                    Storyline
                  </div>
                  <p className="nt-box-row">
                    <span>{movie.tagline}</span>
                  </p>
                </div>
              </div>
              <div className="small-12 medium-8 columns nt-movie-main">
                <div>
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
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Movie Details
                    </div>
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
                  </div>
                  <div className="nt-box">
                    <div className="nt-box-title">
                      Cast
                    </div>
                    <div>{this.renderCast(movie.actors)}</div>
                  </div>
                </div>
              </div>
              <div className="small-12 columns">
                <div className="nt-box">
                  <div className="nt-box-title">
                    Related
                  </div>
                  {this.renderRelatedMovies(movie.related)}
                </div>
              </div>
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
      <div>
        {
          actors.map(a => {
            return (
              <div key={a.id}>
                <Link to={`/person/${a.id}`}>
                  <img src={a.posterImage} alt="" />
                </Link>
                <div className="nt-carousel-actor-name"><Link to={`/person/${a.id}`}>{a.name}</Link></div>
                <div className="nt-carousel-actor-role">{a.role}</div>
              </div>
            );
          })
        }
      </div>);
  }

  renderRelatedMovies(movies) {
    if (_.isEmpty(movies)) {
      return null;
    }

    return (
      <div>
        {
          movies.map(m => {
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
          })
        }
      </div>);
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
Genre.displayName = 'Genre';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    genre: state.movies.detailg,
    isFetching: state.movies.isFetching,
    profile: _.get(state, 'profile.profile')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(Genre);
