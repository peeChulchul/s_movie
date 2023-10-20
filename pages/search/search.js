import { makeModal, exitModal, makeCards } from '../../components/global.js';
import { options, fetchApi } from '../../components/api.js';
import { submitFrom } from '../../components/submit.js';
// dom

const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
const $cardContainer = document.querySelector('.card_container');
const $addMovieBtn = document.querySelector('.addMovie_btn');
// event
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input));
$addMovieBtn.addEventListener('click', onClickAddMovie);
window.onload = () => fetchMovies(searchMovies);

const q = sessionStorage.getItem('q');
let page = 1;
$input.value = q;

const searchMovies = fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
    options
).then((promise) => promise.json());

async function fetchMovies(promise) {
    const searchJson = await fetchApi([promise]);

    const { results } = searchJson;
    if (page === searchJson.total_pages) {
        $addMovieBtn.style.display = 'none';
    }

    results.forEach((result) => {
        makeCards(result, $cardContainer, (e) => makeModal(e, result, $backDrop, $modal));
    });
}

function onClickAddMovie() {
    page++;
    console.log(page);
    const addMovieList = fetch(
        `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
        options
    ).then((promise) => promise.json());
    return fetchMovies(addMovieList);
}
