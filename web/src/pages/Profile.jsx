import React from 'react';
import AuthenticatedPage from './AuthenticatedPage.jsx';
import {Link} from 'react-router-dom';
import UserRating from '../components/UserRating.jsx';
import Carousel from '../components/Carousel.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import * as ProfileActions from '../redux/actions/ProfileActions';

class Profile extends React.Component {
  constructor() {
    super();
    
    this.handleChange_username = this.handleChange_username.bind(this);
    this.state = {
      username: '',
      // genre_name: '',
     
    };
  }
  componentDidMount() {
    this.props.getProfileRatings();
    this.props.getProfileRecommendations();
  }

  render() {
    var {profile, ratedMovies, recommendedMovies} = this.props.profile;
    var {profileRateMovie, profileDeleteMovieRating,username} = this.props;
    console.log("HEHEHEHE", recommendedMovies, ratedMovies);
    if (!profile) {
      return null;
    }

    return (
      <div className="nt-profile">
        {/*isFetching ? <Loading/> : null*/}
        <div className="row">
          <div className="small-12 columns">
            <div className="nt-box">
              <div className="nt-box-title">
                My Profile
              </div>
              <div className="nt-box-row">
                <div className="row">
                  <div className="small-12 medium-2 large-2 columns">
                    <div className="nt-profile-gravatar">
                      <img src={_.get(profile, 'avatar.fullSize')} alt="" />
                    </div>
                  </div>
                  <div className="small-12 medium-10 large-10 columns">
                    <div className="nt-profile-first-name">
                      User Name: {profile.username}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
        <div className="small-12 medium-8 columns nt-movie-main"> 

            <div>
              <div>
                <h3>My rated</h3>
              </div>
              {!_.isEmpty(ratedMovies) ?
                <div>
                  <br></br><h6> Movies</h6>
                  {ratedMovies['movies'].map((movie, i, array) => {
                    return (
                      <div key={movie.id}>
                        
                        <Link to={`/entity/${movie.id}`}>
                          
                        </Link>
                        <div className="nt-profile-movie-title">
                          <Link to={`/entity/${movie.id}`}>
                            {movie.title}
                          </Link>
                        </div>
                        <div>
                          <UserRating movieId={movie.id}
                                      savedRating={movie.myRating}
                                      onSubmitRating={profileRateMovie}
                                      onDeleteRating={profileDeleteMovieRating}/>
                        </div>
                        <br></br>
                      </div>
                    );
                  })}
                  <br></br><h6>Books</h6>
                  {ratedMovies['books'].map((movie, i, array) => {
                    if (!movie.id) return null;
                    return (
                      <div key={movie.id}>
                        <Link to={`/entity/${movie.id}`}>
                          
                        </Link>
                        <div className="nt-profile-movie-title">
                          <Link to={`/entity/${movie.id}`}>
                            {movie.title}
                          </Link>
                        </div>
                        <div>
                          <UserRating movieId={movie.id}
                                      savedRating={movie.myRating}
                                      onSubmitRating={profileRateMovie}
                                      onDeleteRating={profileDeleteMovieRating}/>
                        </div>
                        <br></br>
                      </div>
                    );
                  })}
                </div>
                
                :
                null
              }
            </div>
          {/* </div> */}
          </div>
        {/* </div> */}

        {/* <div className="row">
         */}
         <div className="small-12 medium-4 columns nt-movie-main"> 
          {/* <div className="small-12 columns"> */}
            <div>
              <div>
              <h3>Recommended for me </h3>
              </div>
              {
                !_.isEmpty(recommendedMovies) ?
                  // <Carousel>
                  <div>
                    <h6>Movies</h6>
                    {recommendedMovies['movies'].map(m => {
                      return (
                        <div key={m.id}>
                          <Link to={`/entity/${m.id}`}>
                            {/* <img src={m.posterImage} className="nt-movie-poster" float="left" alt="*" /> */}
                          </Link>
                          <div>
                            <Link to={`/entity/${m.id}`}>{m.title}</Link>
                          </div>
                        </div>
                      );
                    })}
                    <h6>Books</h6>
                    {recommendedMovies['books'].map(m => {
                      return (
                        <div key={m.id}>
                          <Link to={`/entity/${m.id}`}>
                            {/* <img src={m.posterImage} className="nt-movie-poster" float="left" alt="*" /> */}
                          </Link>
                          <div>
                            <Link to={`/entity/${m.id}`}>{m.title}</Link>
                          </div>
                        </div>
                      );
                    })}
                    <h6>Friends are Enjoying</h6>
                    {/* {recommendedMovies['m_follow'].length != 0 ? */}
                      {recommendedMovies['mFollow'].map(m => {
                        return (
                          <div key={m.id}>
                            <Link to={`/entity/${m.id}`}>
                              {/* <img src={m.posterImage} className="nt-movie-poster" float="left" alt="*" /> */}
                            </Link>
                            <div>
                              <Link to={`/entity/${m.id}`}>{m.title}</Link>
                            </div>
                          </div>
                        );
                      })} 
                    </div>
                  // </Carousel>
                  :
                  null
              }
              
            </div>
            
          {/* </div> */}
        </div>
        </div>

        <div className="row">      
        <div className="small-12 medium-8 columns nt-movie-main"> 
                <input name = "search_by_username"
                type="text"
                       placeholder="Search by username"
                       required
                       value={username}
                       onChange={this.handleChange_username}
                       />
                       </div>
                       <div className="small-12 medium-4 columns nt-movie-main"> 
                 <Link to={`/user/${this.state.username}/${profile.username}`} className="button ba-default-btn">Search by UserName</Link>
          </div>
          </div>
       
      </div>
    );
  }

handleChange_username(event) {
    this.setState({username: event.target.value});}
}


  function mapStateToProps(state) {
  return {
    profile: _.get(state, 'profile'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ProfileActions, dispatch);
}

Profile.displayName = 'Profile';

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedPage(Profile));
