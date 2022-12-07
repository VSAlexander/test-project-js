import axios from 'axios';

const moviesList = document.querySelector('.movies-list');

const API_KEY = '2954afe7c35181c36bf30aa4bc9ce527';

/////////    GENRES     /////////

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

fetchGenres();

///////////////////////

///////    INFINITE SCROLL   ///////////

let nextPage = 2;

const infiniteObserver = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    // console.log(entry);
    getMovies(nextPage++);
  }
});

//////////////////////

///////////// FETCH TRENDING MOVIES  /////////////

async function getMovies(page = 1) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&page=${page}`
    );

    moviesList.innerHTML += renderMovieCards(response.data.results);

    const lastCard = document.querySelector('.movies-list__item:last-child');
    // console.log(lastCard);
    if (lastCard) {
      infiniteObserver.observe(lastCard);
    }
  } catch (error) {
    console.error(error);
  }
}

///////////////////////

/////////// RENDERING MOVIE CARDS ///////////

function renderMovieCards(data) {
  return data
    .map(
      movie => `<li class="movies-list__item">
      <div class="movies-list__item-thumb">
        <img loading="lazy"
          class="movies-list__item-card-img"
          src="https://image.tmdb.org/t/p/w342${movie.poster_path}"
          srcset="https://image.tmdb.org/t/p/w342${movie.poster_path} 1x,
          https://image.tmdb.org/t/p/w780${movie.poster_path} 2x"

          alt="${movie.title}">
      </div>
        
          
        <div class="movies-list__item-caption">
            <h2 class="movies-list__item-title">${movie.title}</h2>
            <p class="movies-list__item-info">${checkLengthOfGenres(
              movie.genre_ids
            )} | ${
        movie.release_date.slice(0, 4)
          ? movie.release_date.slice(0, 4)
          : 'No info'
      } <span class="rating">${movie.vote_average.toFixed(1)}</span></p>
        </div>
        </li>`
    )
    .join('');
}

function checkLengthOfGenres(array) {
  const allGenres = getGenresFromLocalStorage('genres')
    .filter(genre => array.includes(genre.id))
    .map(genre => genre.name);

  if (allGenres.includes('Science Fiction')) {
    allGenres.splice(allGenres.indexOf('Science Fiction'), 1, 'Sci-Fi');
  }

  if (allGenres.length > 3) {
    allGenres.splice(2, 1, 'Other');
    return allGenres.slice(0, 3).join(', ');
  } else {
    return allGenres.slice(0, 3).join(', ');
  }
}

//////////////////////////////////////

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
