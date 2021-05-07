import settings from '../config/settings';
import axios from './axios';
import _ from 'lodash';

const {apiBaseURL} = settings;

export default class MoviesApi {
  static getGenres() {
    return axios.get(`${apiBaseURL}/genres`);
  }

  static getMoviesByGenres(genreNames) {
    return axios.get(`${apiBaseURL}/movies/recommended`);
    // return MoviesApi.getGenres()
    //   .then(genres => {
    //     var movieGenres = _.filter(genres, g => {
    //       return genreNames.indexOf(g.name) > -1;
    //     });

    //     return Promise.all(
    //       movieGenres.map(genre => {
    //           return axios.get(`${apiBaseURL}/movies/genre/${genre.id}/`);
    //         }
    //       ))
    //       .then(genreResults => {
    //         var result = {};
    //         genreResults.forEach((movies, i) => {
    //           result[movieGenres[i].name] = movies;
    //         });

    //         return result;
    //       });
    //   });
  }

  // convert this to top 3 most rated movies
  static getFeaturedMovies() {
    return axios.get(`${apiBaseURL}/movies/spotlight`);
    // return Promise.all([
    //    axios.get(`${apiBaseURL}/movies/770`),
    //   // axios.get(`${apiBaseURL}/movies/15292`),
    //   // axios.get(`${apiBaseURL}/movies/11398`)
    // ]);
  }

  // convert this to top 3 most rated movies
  static getRecos() {
    return axios.get(`${apiBaseURL}/movies/recommended`);
    // return Promise.all([
    //    axios.get(`${apiBaseURL}/movies/770`),
    //   // axios.get(`${apiBaseURL}/movies/15292`),
    //   // axios.get(`${apiBaseURL}/movies/11398`)
    // ]);
  }

  static getMovie(id) {
      return axios.get(`${apiBaseURL}/movies/${id}`);
  }

  static getGenre(id) {
    // console.log("NEWW",id);
    return axios.get(`${apiBaseURL}/genres/${id}`);
}
  static getFriends(id) {
    return axios.get(`${apiBaseURL}/friends/${id}`);
  // return Promise.all([
  //    axios.get(`${apiBaseURL}/movies/770`),
  //   // axios.get(`${apiBaseURL}/movies/15292`),
  //   // axios.get(`${apiBaseURL}/movies/11398`)
  // ]);
  }

  static getFollowCheck(u1,u2) {
    return axios.get(`${apiBaseURL}/friends/${u1}/${u2}`);
  } 

  static getFollow(u1,u2,f) {
    return axios.get(`${apiBaseURL}/friends/${u1}/${u2}/${f}`);
  // return Promise.all([
  //    axios.get(`${apiBaseURL}/movies/770`),
  //   // axios.get(`${apiBaseURL}/movies/15292`),
  //   // axios.get(`${apiBaseURL}/movies/11398`)
  // ]);
  }

  static getLikeGenreCheck(id) {
    var res=axios.get(`${apiBaseURL}/movies/likegenrecheck/${id}`);
    console.log("IN axios " , res);
    return res;
    // return axios.get(`${apiBaseURL}/movies/likegenrecheck/${id}`);
  } 

  static getLikeGenre(id,f) {
    return axios.get(`${apiBaseURL}/movies/likegenre/${id}/${f}`);
  }


  static rateMovie(id, rating) {
    return axios.post(`${apiBaseURL}/movies/${id}/rate`, {rating});
  }

  static deleteRating(id) {
    return axios.delete(`${apiBaseURL}/movies/${id}/rate`);
  }
}


