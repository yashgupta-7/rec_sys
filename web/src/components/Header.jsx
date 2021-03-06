import React from 'react';
import {Link} from 'react-router-dom';
import {logout} from '../redux/actions/AuthActions';
import {connect} from 'react-redux';
import _ from 'lodash';
// import logoImg from '../assets/logo.png';

class Header extends React.Component {
  render() {
    var {props} = this;
    var profile = _.get(props, 'profile');
    var username = _.get(props, 'profile.username');
    var isLoggedIn = !!_.get(props, 'auth.token');
    // console.log("Header", profile);
    var isAdmin = username === "admin";

    return (
      <nav className="nt-app-header">
        {/* <div className="nt-app-header-logo"> */}
          <h3><center>Movie-Book Recommendations App</center></h3>
        <ul className="nt-app-header-links">
          <li>
            <a className="nt-app-header-link"
               href="http://localhost:7474/browser/"
               target="_blank"
               rel="noopener noreferrer">
              {isAdmin ? <h5>Go to Admin Page</h5> : null}
            </a>
          </li>
        </ul>
        <div className="nt-app-header-profile-links">
          <div className="right">
            {
              profile ?
              <div>
                <h10 style={{ height: 40 , fontWeight: 100}}> {profile.username} </h10>
                <div className="nt-app-header-avatar" style={this.getAvatarStyle(profile)}>
                  <Link to="/profile" title={`profile: ${profile.username}`}/>
                </div>
                </div>
                : null
            }
            <div className="log-container">
              {isLoggedIn ? <center><button className="btn" onClick={this.logout.bind(this)} className="buttonLink logout">Log out</button></center> : <Link to="/login" style={{ color: '#000000', fontStyle: 'italic', background: '#ba0000' }}> Log in </Link>}
            </div>
            <div>
              {isLoggedIn ? null : <Link style={{ color: '#000000', fontStyle: 'italic', background: '#ba0000' }} to="/signup">Sign up</Link>}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  getAvatarStyle(profile) {
    return {background: `url(${_.get(profile, 'avatar.fullSize')}) center`};
  }

  logout() {
    this.props.dispatch(logout());
    window.location.href = "http://localhost:3001/"
  }
}

Header.displayName = 'Header';

export default connect()(Header);
