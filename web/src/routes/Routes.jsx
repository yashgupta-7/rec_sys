import React from 'react';
import {Route} from 'react-router';
import App from '../pages/App.jsx';
import Home from '../pages/Home.jsx';
import Movie from '../pages/Movie.jsx';
import Genre from '../pages/Genre.jsx';
import Person from '../pages/Person.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import SignupStatus from '../pages/SignupStatus.jsx';
import User from '../pages/User.jsx'
import Profile from '../pages/Profile.jsx';
import Friend from '../pages/Friend.jsx';
import {getProfile} from '../redux/actions/ProfileActions';
import UserSession from '../UserSession';
// import { bindActionCreators } from 'redux';

export default class Routes extends React.Component {
  render() {
    return (
      <App>
        <Route exact path="/" component={Home}/>
        <Route path="/movie/:id" component={Movie}/>
        <Route path="/genre/:id" component={Genre}/>
        <Route path="/person/:id" component={Person}/>
        <Route path="/login" component={Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signup-status" component={SignupStatus}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/user/:username/:myname" component={User}/>
      </App>
    );
  }
}

Routes.displayName = 'Routes';
