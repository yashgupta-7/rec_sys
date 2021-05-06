import settings from '../config/settings';
import axios from './axios';
import _ from 'lodash';

const {apiBaseURL} = settings;

export default class FriendsApi {
  static getGenres() {
    return axios.get(`${apiBaseURL}/genres`);
  }

 // convert this to top 3 most rated movies
  static getFeaturedFriends() {
    return axios.get(`${apiBaseURL}/friends/spotlight`);
    // return Promise.all([
    //    axios.get(`${apiBaseURL}/movies/770`),
    //   // axios.get(`${apiBaseURL}/movies/15292`),
    //   // axios.get(`${apiBaseURL}/movies/11398`)
    // ]);
  }

  
}


