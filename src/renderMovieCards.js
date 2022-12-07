import { getGenresFromLocalStorage } from './fetchGenres';

export function renderMovieCards(data) {
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
