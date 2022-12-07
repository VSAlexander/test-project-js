// import axios from 'axios';

// const API_KEY = '2954afe7c35181c36bf30aa4bc9ce527';

// const moviesList = document.querySelector('.movies-list');

// async function getGenres() {
//   if (localStorage.getItem('genres') !== null) {
//     return;
//   }
//   try {
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
//     );
//     // response.data.genres.map(genre => saveInLocalStorage(genre.id, genre.name));
//     saveGenresInLocalStorage('genres', response.data.genres);
//   } catch (error) {
//     console.error(error);
//   }
// }

// function saveGenresInLocalStorage(key, value) {
//   try {
//     // key = JSON.stringify(key);
//     const stringifiedGenres = JSON.stringify(value);
//     localStorage.setItem(key, stringifiedGenres);
//   } catch (error) {
//     console.error(error.message);
//   }
// }

// function getGenresFromLocalStorage(key) {
//   try {
//     //   const serializedState = localStorage.getItem(key);
//     return JSON.parse(localStorage.getItem(key));
//   } catch (error) {
//     console.error('Get state error: ', error.message);
//   }
// }
// // getFromLocalStorage('genres');

// getGenres();

// async function getMovies() {
//   try {
//     const response = await axios.get(
//       `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
//     );

//     moviesList.innerHTML += renderMovieCards(response.data.results);
//   } catch (error) {
//     console.error(error);
//   }
// }

// getMovies();

// function renderMovieCards(data) {
//   return data
//     .map(
//       movie => `<li class="movies-list__item">
//         <img loading="lazy"
//           class="movies-list__item-card-img"
//           src="https://image.tmdb.org/t/p/w342${movie.poster_path}"
//           srcset="https://image.tmdb.org/t/p/w342${movie.poster_path} 1x,
//           https://image.tmdb.org/t/p/w500${movie.poster_path} 2x"

//           alt="${movie.title}">

//         <div class="movies-list__item-caption">
//             <h2 class="movies-list__item-title">${movie.title}</h2>
//             <p class="movies-list__item-info">${getGenresFromLocalStorage(
//               'genres'
//             )
//               .filter(element => movie.genre_ids.includes(element.id))
//               .map(element => element.name)
//               .join(', ')} | ${
//         movie.release_date.slice(0, 4)
//           ? movie.release_date.slice(0, 4)
//           : 'No information about release date'
//       }</p>
//         </div>
//         </li>`
//     )
//     .join('');
// }

// const smthwithimg = `<picture class="movies-list__item-card-img">
//             <source
//               srcset="
//                 'https://image.tmdb.org/t/p/w342${movie.poster_path} 1x',
//                 'https://image.tmdb.org/t/p/w500${movie.poster_path} 2x'
//               "
//               media="(max-width: 767px)"
//             />
//             <source
//               srcset="
//                 'https://image.tmdb.org/t/p/w342${movie.poster_path} 1x',
//                 'https://image.tmdb.org/t/p/w780${movie.poster_path} 2x'
//               "
//               media="(min-width: 768px) and (max-width: 1279px)"
//             />
//             <source
//               srcset="
//                 'https://image.tmdb.org/t/p/w500${movie.poster_path} 1x',
//                 'https://image.tmdb.org/t/p/w780${movie.poster_path} 2x'
//               "
//               media="(min-width: 1280px)"
//             />
//             <img
//               src="https://image.tmdb.org/t/p/w342${movie.poster_path}"
//               alt="${movie.title}"
//             />
//           </picture>`;

// const workingImg = `<img loading="lazy"
//           class="movies-list__item-card-img"
//           src="https://image.tmdb.org/t/p/w342${movie.poster_path}"
//           srcset="https://image.tmdb.org/t/p/w342${movie.poster_path} 1x,
//           https://image.tmdb.org/t/p/w500${movie.poster_path} 2x"

//           alt="${movie.title}">`;

// const onmoviedb = `<img loading="lazy" class="poster"
// src="/t/p/w220_and_h330_face/h8kxyDP9Rhh7fIJoElev9Bm73Dl.jpg"
// srcset="/t/p/w220_and_h330_face/h8kxyDP9Rhh7fIJoElev9Bm73Dl.jpg 1x, /t/p/w440_and_h660_face/h8kxyDP9Rhh7fIJoElev9Bm73Dl.jpg 2x"
// alt="">`;

// const sizes = `sizes="(max-width: 767px) 280px, ((min-width: 768px) and (max-width: 1279px)) 336px, (min-width: 1280px) 395px"`;

import axios, { all } from 'axios';
// import List from 'list.js';
// import * as basicLightbox from 'basiclightbox';

// import { API_KEY, fetchGenres } from './fetchGenres';
import { renderMovieCards } from './renderMovieCards';

// const API_KEY = '2954afe7c35181c36bf30aa4bc9ce527';

const moviesList = document.querySelector('.movies-list');
const spinner = document.querySelector('.lds-spinner');
// const rating = document.querySelector('.rating');

const API_KEY = '2954afe7c35181c36bf30aa4bc9ce527';

function fetchGenres() {
  // if (localStorage.getItem('genres') !== null) {
  //   return;
  // }
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

fetchGenres();

let nextPage = 2;

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    console.log(entry);
    getMovies(nextPage++);
  }
});

async function getMovies(page = 1) {
  // displayLoading();
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=${page}`
    );

    moviesList.innerHTML += renderMovieCards(response.data.results);

    const lastCard = document.querySelector('.movies-list__item:last-child');
    console.log(lastCard);
    if (lastCard) {
      infiniteObserver.observe(lastCard);
    }
  } catch (error) {
    console.error(error);
  }
}

getMovies();

// function removeRating() {
//   const allRatings = document.querySelectorAll('.rating');
//   allRatings.style.display = 'none';
//   console.log(allRatings);
// }

// window.onload = function () {
//   spinner.style.display = 'none';
// };

// document.addEventListener('DOMContentLoaded', () => {
//   spinner.style.display = 'none';

//   const options = {
//     root: null,
//     rootMargins: '0px',
//     threshold: 0.7,
//   };

//   const observer = new IntersectionObserver(handleIntersect, options);

//   observer.observe(document.querySelector('footer'));

//   getMovies();
// });

// function handleIntersect(entries) {
//   if (entries[0].isIntersecting) {
//     console.log('Footer');
//     getMovies();
//   }
// }

// const cardsAndButtons = new List('wrapper', {
//   valueNames: ['movies-list__item name'],
//   outerWindow: 1,
//   page: totalPages,
//   pagination: true,
// });

// PAGINATION ///////////////////////////////////////////// OLD VERSION

// const paginationNumbers = document.getElementById('pagination-numbers');

// const nextButton = document.getElementById('next-button');
// const prevButton = document.getElementById('prev-button');

// const paginatedList = document.querySelector('.movies-list');
// const listItems = paginatedList.querySelectorAll('li');

// const appendPageNumber = index => {
//   const pageNumber = document.createElement('button');
//   pageNumber.className = 'pagination-number';
//   pageNumber.innerHTML = index;
//   pageNumber.setAttribute('page-index', index);
//   pageNumber.setAttribute('aria-label', 'Page ' + index);

//   paginationNumbers.appendChild(pageNumber);
// };

// const getPaginationNumbers = count => {
//   for (let i = 1; i <= count; i++) {
//     appendPageNumber(i);
//   }
// };

// let paginationLimit = 0;
// let pageCount = 0;
// let currentPage;
