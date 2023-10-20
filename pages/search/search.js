import { makeModal, exitModal, makeCards, toggleDisplay, initDisplay } from '../../components/global.js';
import { options, fetchApi } from '../../components/api.js';
import { submitFrom } from '../../components/submit.js';
// dom

const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
const $cardContainer = document.querySelector('.card_container');
const $addMovieBtn = document.querySelector('.addMovie_btn');
const $scrollUp = document.querySelector('.scroll_up');
const $main = document.querySelector('#main');
const $title = document.createElement('h1');
const $btnDay = document.querySelector('.header__mode_icon.sun');
const $btnNight = document.querySelector('.header__mode_icon.moon');
toggleDisplay($btnDay);
toggleDisplay($btnNight);
// event
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input));
$addMovieBtn.addEventListener('click', onClickAddMovie);
$scrollUp.addEventListener('click', () => {
    window.scrollTo(0, 0);
});
window.onload = () => fetchMovies(searchMovies);

const q = sessionStorage.getItem('q');
let page = 1;
$input.value = q;

const searchMovies = fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
    options
).then((promise) => promise.json());

async function fetchMovies(promise) {
    initDisplay();
    const searchJson = await fetchApi([promise]);
    //
    $title.textContent = `'${q}' 검색결과 `;
    $title.classList.add('search__title');
    $main.prepend($title);
    //
    const { results } = searchJson;
    const empty = results.length <= 0;

    if (page === searchJson.total_pages) {
        $addMovieBtn.style.display = 'none';
    } else {
        $addMovieBtn.style.display = 'block';
    }

    if (empty) {
        const emptyText = document.createElement('h1');
        emptyText.textContent = '검색결과가 존재하지않습니다.';
        emptyText.classList.add('search__empty');
        console.log(emptyText);
        $main.append(emptyText);
    } else {
        results.forEach((result) => {
            makeCards(result, $cardContainer, (e) => makeModal(e, result, $backDrop, $modal));
        });
    }
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
