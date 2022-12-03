import Notiflix from 'notiflix';
import axios from 'axios';

const input = document.querySelector('#search-form');
const {
  elements: { searchQuery },
} = input;
const gallery = document.querySelector('.images-list');
const button = document.querySelector('.load-more');
// button.styles.display = 'none';

input.addEventListener('submit', handleSubmit);
let counter = 1;
let previousValue = '';

function handleSubmit(event) {
  event.preventDefault();
  counter = 1;
  clearMarkup();
  fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: '16135792-2d496ba8b681987b91053eb75',
        q: `${searchQuery.value}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: `${counter}`,
        per_page: 40,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.status);
    } else {
      button.style.display = 'block';
    }

    const items = response.data.hits;

    if (response.data.totalHits === 0) {
      button.style.display = 'none';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = items
      .map(
        item => `
        <li class="item">
          <img src=${item.webformatURL} alt=${item.tags} loading="lazy"/>
          <ul class="statistics-list">
            <li><p>Likes</p><span class="numbers">${item.likes}</span></li>
            <li><p>Views</p><span class="numbers">${item.views}</span></li>
            <li><p>Comments</p><span class="numbers">${item.comments}</span></li>
            <li><p>Downloads</p><span class="numbers">${item.downloads}</span></li>
          </ul>
        </li>`
      )
      .join('');

    gallery.innerHTML += markup;
    counter += 1;
    previousValue = searchQuery.value;
  } catch (error) {
    button.style.display = 'none';
    console.log(error);
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

button.addEventListener('click', fetchImages);

function clearMarkup() {
  gallery.innerHTML = '';
}

// function handleClick() {
//   fetchImages();
// }
