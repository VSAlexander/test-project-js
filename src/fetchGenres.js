import axios from 'axios';

export { API_KEY, fetchGenres, getGenresFromLocalStorage };

const API_KEY = '2954afe7c35181c36bf30aa4bc9ce527';

function fetchGenres() {
  if (localStorage.getItem('genres') !== null) {
    return;
  }
  try {
    const response = axios.get(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    setGenresInLocalStorage('genres', response.data.genres);
  } catch (error) {
    console.error(error);
  }
}

function setGenresInLocalStorage(key, value) {
  try {
    const stringifiedGenres = JSON.stringify(value);
    localStorage.setItem(key, stringifiedGenres);
  } catch (error) {
    console.error(error.message);
  }
}

function getGenresFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error('Get state error: ', error.message);
  }
}
