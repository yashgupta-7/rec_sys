import React from 'react';
import _ from 'lodash';
import Loading from '../components/Loading.jsx';
import Carousel from '../components/Carousel.jsx';
import UserRating from '../components/UserRating.jsx';
// import UserFollowing from '../components/UserFollowing.jsx';
import {Link} from 'react-router-dom';
import * as MovieActions from '../redux/actions/MovieActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getProfile} from '../redux/actions/ProfileActions';

class User extends React.Component {
  constructor() {
    super();
    
    this.change_Follow = this.change_Follow.bind(this);
    // this.call_getFollowCheck=this.call_getFollowCheck.bind(this);
    // this.getFollow = this.getFollow.bind(this);
    // this.getFollowCheck = this.getFollowCheck(this);
    this.state = {
      doesFollow : 0,
      reload : "sf",
      // myname: '',
      // genre_name: '',
     
    };
  }
  componentWillReceiveProps(nextProps) {
    // if (this.props.doesFollow != nextProps.cost) {
      this.setState({
        reload: "hey"
      }
      );
    // }
  }

  shouldComponentUpdate(nextProps, nextState){
    //  if(nextProps.cost !== this.props.cost){
         return true;
    //  }
    //  return false;
  }
  componentDidMount() {
    var {username,myname} = this.props.match.params;
    console.log("params",username,myname)
    this.props.getFriends(username);
    console.log("did mount",username,myname,this.props.profile);
    this.props.getFollowCheck(myname,username);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.username !== this.props.match.params.username) {
      this.props.clearFriends();

      var {username,myname} = this.props.match.params;
      this.props.getFriends(username);
      this.props.getFollowCheck(myname,username);
    }
  }

  componentWillUnmount() {
    this.props.clearMovie();
  }

  do_nthng(event) {
    ;}

  render() {
    setTimeout(() => {
      this.setState({reload: "This is part is synchronous. Inside the async function after this render will be called"});
      console.log("setTimeout setState");
      this.setState({reload: "This is part is aslso synchronous. Inside the async function after this render will be called"});
    }, 10)
    var {username,myname} = this.props.match.params;
    var {profile, ratedMovies, recommendedMovies} = this.props.profile;
    console.log("my sweet profile",profile);
    var {isFetching, movie, rateMovie, deleteMovieRating, userd,isFollow} = this.props;
    console.log("fdjkgh",userd['friends']);
    var f=false;
    for(var i in userd['friends']){
      console.log(userd['friends'][i]);

        if(userd['friends'][i]['username']==myname)
          f=true;
    }
    this.state.doesFollow=f ? 0 : 1 ;
    // console.log("valu")
    console.log("IsFollow value",isFollow,profile,f,this.state.doesFollow);
    // var text_disp = isFollow==="0" ? ""
    console.log("MOVIEEEEEEEEEEEEEEEE", this.props.match.params.username, userd, movie, deleteMovieRating);
    if (!profile) {
      return null;
    }
    
    return (
      <div className="nt-movie">
        {isFetching ? <Loading/> : null}
        {/* {this.call_getFollowCheck();} */}
        <div className="nt-box">
        <div className="row text-center">
              <button className="btn"
                      type="submit"
                      name="submit-login"
                      onClick={this.change_Follow}
                      // disabled={!canSubmit}
                      >
                {/* {f ? <h5>UnFollow ${isFollow} </h5> :<h5>Follow  ${isFollow}</h5>} */}
                {isFollow[0]=="0" ? <h5>Follow </h5> :<h5>UnFollow</h5>}
                {/* {isFollow[0]=="0" ? "heyaa" : "yoy"} */}
              </button>
        </div>


          <div>
            Friends
          </div>
          {/* <Carousel> */}
          <ul>
          { _.compact(userd['friends']).map(f => {
            return (
              // key={f.id}
              <li > 
                <div className="nt-box">
                <Link to={`/user/${f.username}/${myname}`}>
                  <img src={f.fullSize} alt="" />
                  <h5>
                    {f.username}
                    {/* {f.fullSize} */}
                  </h5>
                </Link>
                </div>
              </li>
            );
          })}
        </ul>
          {/* </Carousel> */}
        </div>

        <div className="nt-box">
          <div>
            Rated Movies
          </div>
          {/* <Carousel> */}
          <ul>
          { _.compact(userd['movies']).map(f => {
            return (
              // key={f.id}
              <li > 
                <div className="nt-box">
                <Link to={`/movie/${f.id}`}>
                  <img src={f.posterImage} alt="" />
                  <h5>{f.title}
                  {f.myRating.properties.rating}
                  </h5>
                  <UserRating movieId={f.id}
                                      savedRating={f.myRating.properties.rating}
                                      onSubmitRating={this.do_nthng}
                                      onDeleteRating={this.do_nthng}
                                      />
                </Link>
                </div>
              </li>
            );
          })}
        </ul>
          {/* </Carousel> */}
        </div>


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

  change_Follow(event) {
    var {isFetching, movie, rateMovie, deleteMovieRating, userd,isFollow} = this.props;
    console.log("fdjkgh",userd['friends']);
    var f=false;
    for(var i in userd['friends']){
      console.log(userd['friends'][i]);

        if(userd['friends'][i]['username']==myname)
          f=true;
    }

    var {profile, ratedMovies, recommendedMovies} = this.props.profile;
    console.log("Click function",profile);
    
    var {username} = this.props.match.params;
    // var {props} = this;
    var myname = profile.username;
    
    console.log("follow button paramssssss",this.props.isFollow,myname,username);
    // this.props.getFollowCheck(username,myname);
    // var flag= f ? 0 : 1 ;
    var flag= isFollow[0]=="0" ? 1 : 0;

    this.props.getFollow(myname,username,flag);
    console.log("follow button afterwards",this.props.isFollow[0],flag);
    setTimeout(() => {
      this.setState({reload: "This is part is synchronous. Inside the async function after this render will be called"});
      console.log("setTimeout setState");
      this.setState({reload: "This is part is aslso synchronous. Inside the async function after this render will be called"});
    }, 10)
    this.setState({reload : "rell"});

    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
    window.location.href = window.location.href;
  }
}
User.displayName = 'User';

function mapStateToProps(state) {
  return {
    movie: state.movies.detail,
    userd: state.movies.detailu,
    isFollow: state.movies.isFollow,
    isFetching: state.movies.isFetching,
    auth: state.auth,
    profile: _.get(state, 'profile'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MovieActions, dispatch);
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(User);
