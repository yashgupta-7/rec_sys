import * as Types from './MovieActionTypes';

export function clearMovie() {
  return {type: Types.MOVIE_DETAIL_CLEAR};
}

export function clearGenre() {
  return {type: Types.GENRE_DETAIL_CLEAR};
}

export function clearFriends() {
  return {type: Types.FRIEND_DETAIL_CLEAR};
}
export function clearFollow() {
  return {type: Types.FOLLOW_DETAIL_CLEAR};
}
export function clearFollowCheck() {
  return {type: Types.FOLLOWCHECK_DETAIL_CLEAR};
}


export function getGenres() {
  return {type: Types.MOVIE_GENRES_GET_REQUEST};
}

export function getGenresSuccess(genres) {
  return {type: Types.MOVIE_GENRES_GET_SUCCESS, genres};
}

export function getGenresFailure(error) {
  return {type: Types.MOVIE_GENRES_GET_FAILURE, error};
}

export function getMoviesByGenres(names) {
  return {type: Types.MOVIES_BY_GENRES_GET_REQUEST, names};
}

export function getMoviesByGenresSuccess(response) {
  return {type: Types.MOVIES_BY_GENRES_GET_SUCCESS, response};
}

export function getMoviesByGenresFailure(error) {
  return {type: Types.MOVIES_BY_GENRES_GET_FAILURE, error};
}

export function getFeaturedMovies() {
  return {type: Types.MOVIES_FEATURED_GET_REQUEST};
}

export function getRecos() {
  return {type: Types.MOVIES_FEATURED_GET_REQUEST};
}

export function getFeaturedMoviesSuccess(response) {
  return {type: Types.MOVIES_FEATURED_GET_SUCCESS, response};
}

export function getFeaturedMoviesFailure(error) {
  return {type: Types.MOVIES_FEATURED_GET_FAILURE, error};
}

export function getMovie(id) {
  return {type: Types.MOVIE_DETAIL_GET_REQUEST, id};
}

export function getGenre(id) {
  return {type: Types.GENRE_DETAIL_GET_REQUEST, id};
}

export function getFriends(id) {
  return {type: Types.FRIEND_DETAIL_GET_REQUEST, id};
}
export function getFollow(u1,u2,f) {
  return {type: Types.FOLLOW_DETAIL_GET_REQUEST, u1,u2,f};
}
export function getFollowCheck(u1,u2) {
  return {type: Types.FOLLOWCHECK_DETAIL_GET_REQUEST, u1,u2};
}

export function getLikeGenre(id,f) {
  return {type: Types.LIKEGENRE_DETAIL_GET_REQUEST, id,f};
}
export function getLikeGenreCheck(id) {
  return {type: Types.LIKEGENRECHECK_DETAIL_GET_REQUEST, id};
}

export function getMovieSuccess(response) {
  return {type: Types.MOVIE_DETAIL_GET_SUCCESS, response};
}

export function getGenreSuccess(response) {
  return {type: Types.GENRE_DETAIL_GET_SUCCESS, response};
}

export function getFriendsSuccess(response) {
  return {type: Types.FRIEND_DETAIL_GET_SUCCESS, response};
}
export function getFollowSuccess(response) {
  return {type: Types.FOLLOW_DETAIL_GET_SUCCESS, response};
}
export function getFollowCheckSuccess(response) {
  return {type: Types.FOLLOWCHECK_DETAIL_GET_SUCCESS, response};
}

export function getLikeGenreSuccess(response) {
  return {type: Types.LIKEGENRE_DETAIL_GET_SUCCESS, response};
}
export function getLikeGenreCheckSuccess(response) {
  return {type: Types.LIKEGENRECHECK_DETAIL_GET_SUCCESS, response};
}

export function getMovieFailure(error) {
  return {type: Types.MOVIE_DETAIL_GET_FAILURE, error};
}

export function getGenreFailure(error) {
  return {type: Types.GENRE_DETAIL_GET_FAILURE, error};
}

export function getFriendsFailure(error) {
  return {type: Types.FRIEND_DETAIL_GET_FAILURE, error};
}

export function rateMovie(id, rating) {
  return {type: Types.MOVIE_RATE, id, rating};
}

export function rateMovieSuccess() {
  return {type: Types.MOVIE_RATE_SUCCESS};
}

export function rateMovieFailure() {
  return {type: Types.MOVIE_RATE_FAILURE};
}

export function deleteMovieRating(id) {
  return {type: Types.MOVIE_DELETE_RATING, id};
}

export function deleteMovieRatingSuccess() {
  return {type: Types.MOVIE_DELETE_RATING_SUCCESS};
}

export function deleteMovieRatingFailure() {
  return {type: Types.MOVIE_DELETE_RATING_FAILURE};
}



