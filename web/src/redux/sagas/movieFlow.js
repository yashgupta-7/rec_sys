import {all, call, put, takeEvery} from 'redux-saga/effects';
import MoviesApi from '../../api/MoviesApi';
import * as Actions from '../actions/MovieActions';
import * as Types from '../actions/MovieActionTypes';

export default function* movieFlow() {
  yield all([
    takeEvery(Types.MOVIE_GENRES_GET_REQUEST, getGenres),
    takeEvery(Types.MOVIES_BY_GENRES_GET_REQUEST, getMoviesByGenre),
    takeEvery(Types.MOVIES_FEATURED_GET_REQUEST, getFeaturedMovies),
    takeEvery(Types.MOVIE_DETAIL_GET_REQUEST, getMovie),
    takeEvery(Types.GENRE_DETAIL_GET_REQUEST, getGenre),
    takeEvery(Types.FRIEND_DETAIL_GET_REQUEST, getFriends),
    takeEvery(Types.MOVIE_RATE, rateMovie),
    takeEvery(Types.MOVIE_DELETE_RATING, deleteRating),
    takeEvery(Types.FOLLOW_DETAIL_GET_REQUEST, getFollow),
    takeEvery(Types.FOLLOWCHECK_DETAIL_GET_REQUEST, getFollowCheck),
    takeEvery(Types.LIKEGENRE_DETAIL_GET_REQUEST, getLikeGenre),
    takeEvery(Types.LIKEGENRECHECK_DETAIL_GET_REQUEST, getLikeGenreCheck),
  ]);
}

function* getGenres() {
  try {
    const response = yield call(MoviesApi.getGenres);
    yield put(Actions.getGenresSuccess(response));
  }
  catch (error) {
    yield put(Actions.getGenresFailure(error));
  }
}

function* getMoviesByGenre(action) {
  var {names} = action;
  try {
    const response = yield call(MoviesApi.getMoviesByGenres, names);
    yield put(Actions.getMoviesByGenresSuccess(response));
  }
  catch (error) {
    yield put(Actions.getMoviesByGenresFailure(error));
  }
}

function* getFeaturedMovies() {
  try {
    const response = yield call(MoviesApi.getFeaturedMovies);
    yield put(Actions.getFeaturedMoviesSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFeaturedMoviesFailure(error));
  }
}

function* getMovie(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.getMovie, id);
    yield put(Actions.getMovieSuccess(response));
  }
  catch (error) {
    yield put(Actions.getMovieFailure(error));
  }
}

function* getGenre(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.getGenre, id);
    yield put(Actions.getGenreSuccess(response));
  }
  catch (error) {
    yield put(Actions.getGenreFailure(error));
  }
}

function* getFriends(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.getFriends, id);
    yield put(Actions.getFriendsSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFriendsFailure(error));
  }
}

function* getFollow(action) {
  var {u1,u2,f} = action;
  try {
    const response = yield call(MoviesApi.getFollow, u1,u2,f);
    yield put(Actions.getFollowSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFriendsFailure(error));
  }
}

function* getFollowCheck(action) {
  var {u1,u2} = action;
  try {
    const response = yield call(MoviesApi.getFollowCheck, u1,u2);
    yield put(Actions.getFollowCheckSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFriendsFailure(error));
  }
}


function* getLikeGenre(action) {
  var {id,f} = action;
  try {
    const response = yield call(MoviesApi.getLikeGenre,id,f);
    yield put(Actions.getLikeGenreSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFriendsFailure(error));
  }
}

function* getLikeGenreCheck(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.getLikeGenreCheck, id);
    yield put(Actions.getLikeGenreCheckSuccess(response));
  }
  catch (error) {
    yield put(Actions.getFriendsFailure(error));
  }
}


function* rateMovie(action) {
  var {id, rating} = action;
  try {
    const response = yield call(MoviesApi.rateMovie, id, rating);
    yield put(Actions.rateMovieSuccess(response));
    yield put(Actions.getMovie(id));
  }
  catch (error) {
    yield put(Actions.rateMovieFailure(error));
  }
}

function* deleteRating(action) {
  var {id} = action;
  try {
    const response = yield call(MoviesApi.deleteRating, id);
    yield put(Actions.deleteMovieRatingSuccess(response));
    yield put(Actions.getMovie(id));
  }
  catch (error) {
    yield put(Actions.deleteMovieRatingFailure(error));
  }
}
