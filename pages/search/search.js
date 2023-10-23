// 임폴트
import { makeModal, exitModal, makeCards, toggleDisplay, initDisplay } from '../../components/global.js';
import { options, fetchApi } from '../../components/api.js';
import { submitFrom } from '../../components/submit.js';
// dom요소 및 이벤트 부착

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
const $fromContainer = document.querySelector('.from_container');
const $miniFrom = document.querySelector('.mini_from');
const $miniFromInput = document.querySelector('.mini_from__input');
const $loading = document.querySelectorAll('.loading');
const $footer = document.querySelector('#footer');

toggleDisplay($btnDay);
toggleDisplay($btnNight);
$miniFrom.addEventListener('submit', miniSubmit);
$backDrop.addEventListener('click', () => exitModal($backDrop, $modal));
$from.addEventListener('submit', (e) => submitFrom(e, $input));
$addMovieBtn.addEventListener('click', onClickAddMovie);
$scrollUp.addEventListener('click', () => {
    window.scrollTo(0, 0);
});
window.onload = () => initFn(searchMovies);

// q는 세션에 저장해둔 검색어이다. 페이지는 기본 1페이지로 저장해두었다.
const q = sessionStorage.getItem('q');
let page = 1;
$input.value = q;

// Dom요소인 $title에 택스트와 클래스를추가해주고 $main의 맨앞으로 배치해준다.
$title.textContent = `'${q}' 검색결과 `;
$title.classList.add('search__title');
$fromContainer.prepend($title);
//

// 인터센션옵저버
// 옵션
const ioOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 1,
};
// 콜백 옵저브한 대상이 화면에 들어오면 함수를 실행시킨다.
const callback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            onClickAddMovie();
        }
    });
};

// 새로운 인터섹션옵저버 생성
let io = new IntersectionObserver(callback, ioOptions);

// 데이터로 받아와야할 Promise다.
const searchMovies = fetch(
    `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
    options
).then((promise) => promise.json());

// 로딩의 상태이다.
let isLoading = true;

//
async function initFn(promise) {
    initDisplay();
    $loading.forEach((element) => element.classList.add('active'));

    // 모듈에서 가져온 fetchapi를 통해 데이터가 가져온다.
    const searchJson = await fetchApi([promise]);

    // 결과값이 없을수도없기때문에 결과값이 없을경우를 empty로 선언해주었다.
    const { results } = searchJson;
    const empty = results.length <= 0;

    // 결과값을 잘 가져온 경우에만 로딩에 active를 제거해준다.
    // 로딩중이 아닌경우에만 $footer를 옵저버에 추가해준다.
    isLoading = results.length > 1 ? false : true;
    !isLoading && $loading.forEach((element) => element.classList.remove('active'));
    // 성능을 위해 개선해야하는로직 (함수실행시 계속 옵저브함)
    !isLoading && io.observe($footer);

    // $addMovieBtn은 다음페이지의 데이터를 불러오는 버튼으로 현재페이지가 마지막페이지인경우 display:none으로 만들어줬다.
    if (page === searchJson.total_pages) {
        console.log(searchJson.total_pages);
        $addMovieBtn.style.display = 'none';
        io.disconnect($footer);
    } else {
        $addMovieBtn.style.display = 'block';
    }

    // 결과값이 없는 경우 '검색결과가 존재하지않습니다.'를 출력시켜주었다.
    // 결과가 있을경우 모듈에서 가져온 makeCards를 통해 결과수만큼의 카드를 만들어주었다.
    if (empty) {
        const emptyText = document.createElement('h1');
        emptyText.textContent = '검색결과가 존재하지않습니다.';
        emptyText.classList.add('search__empty');
        console.log(emptyText);
        $main.prepend(emptyText);
        $loading.forEach((element) => element.classList.remove('active'));
    } else {
        results.forEach((result) => {
            makeCards(result, $cardContainer, (e) => makeModal(e, result, $backDrop, $modal));
        });
    }
}

// 데이터를 더 가져오는 함수이다.
// 페이지를 증가시키며 위에선언된 fetchMovies에 가져와야할 페이지의 데이터가 담긴 promise를 전달하여 해당 값을 가지고 카드를 만들게된다.
function onClickAddMovie() {
    page++;
    const addMovieList = fetch(
        `https://api.themoviedb.org/3/search/movie?query=${q}&include_adult=false&language=ko-KR&page=${page}`,
        options
    ).then((promise) => promise.json());
    return initFn(addMovieList);
}

// 내부요소들을 검색하는 함수이다.
function miniSubmit(e) {
    e.preventDefault();
    // 현재 dom에있는 모든 .card클래스명을 가진 요소들을 html콜렉션으로 가져온다
    const cards = document.querySelectorAll('.card');
    // 인풋의 벨류를 가져온다(모두 대문자로바꿔서)
    const inputValue = $miniFromInput.value.toUpperCase();
    // html콜랙션리스트에 있는 모든 html에 있는 data.title을 확인한다.
    // 현재 검색한 값을 포함하고있다면 해당 html요소의 display를 블록으로 아니면 없앤다.
    // 추가로 포함하고있는요소들에게는 약간의 애니메이션을 주었다.
    cards.forEach((card) => {
        const data = card.dataset.title.toUpperCase();
        const viewCard = data.includes(inputValue);
        if (!viewCard) {
            card.style.display = 'none';
        } else {
            card.style.display = 'block';
            card.animate(
                [
                    { transform: 'translateX(20%)', opacity: 0.5 },
                    { transform: 'translateX(0%)', opacity: 1 },
                ],
                {
                    duration: 300,
                }
            );
        }
    });
}
