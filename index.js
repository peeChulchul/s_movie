// Dom
const $cardCarousels = document.querySelectorAll('.card_carousel');
const $cardNext = document.querySelectorAll('.card__next');
const $cardPrev = document.querySelectorAll('.card__prev');
const $backDrop = document.querySelector('#back_drop');
const $modal = document.querySelector('#modal');
const $input = document.querySelector('.header__form__input');
const $from = document.querySelector('.header__form');
// counter
const counter = {
    popular: 0,
    topRated: 0,
    nowPlaying: 0,
};

// API

export const options = {
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGM2MDMxNjBmN2IxY2NlMzk1YTE2NzUxMDY5MmZjZCIsInN1YiI6IjYzM2QzMDVlMjBlNmE1MDA4MTdhNWEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rl3cm1gDAR9xtqQUJWGKlyGq-TYFmyIlcm6gHn5eNZU',
    },
};

const Popular = fetch(`https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);
const TopRated = fetch(`https://api.themoviedb.org/3/movie/top_rated?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);
const NowPlaying = fetch(`https://api.themoviedb.org/3/movie/now_playing?language=ko-KR&page=1`, options).then((data) =>
    data.json()
);

// 모달 생성시 영화의 상세데이터를 id를 파람으로 줘서 가져옴..
// fetch('https://api.themoviedb.org/3/movie/575264?language=ko-KR', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

(async function fetchMovies() {
    // 선언과 동시에 실행되는함수
    // 함수내에서 사이트 동작시 필요한 이벤트리스너 장착
    $backDrop.addEventListener('click', exitModal);
    $from.addEventListener('submit', submitFrom);

    //await promis.all을 동기로 동작  내부에서는 api들을 비동기처리
    const [popular, topRated, nowPlaying] = await Promise.all([Popular, TopRated, NowPlaying]);
    const result = { popular, topRated, nowPlaying };

    // 가져온 api를 통해 영화카드를 만드는 함수에 카테고리와 카테고리에 맞는 영화데이터들을 전달
    const categorys = Object.keys(result);
    categorys.forEach((category) => makeCard(category, result[category]));
})();

function makeCard(category, movies) {
    // 클래스명을 통해 카테고리와 일치하는 클래스명을 가진 html요소를 찾는다.
    const container = Array.from($cardCarousels).find((cardCarousel) => cardCarousel.classList.contains(category));
    const { results } = movies;

    // create 및 add 및 append....
    const next = document.createElement('button');
    const nextArrow = document.createElement('i');
    const prevArrow = document.createElement('i');
    const prev = document.createElement('button');
    prevArrow.classList.add('fa-solid');
    prevArrow.classList.add('fa-backward');
    nextArrow.classList.add('fa-solid');
    nextArrow.classList.add('fa-forward');
    next.classList.add('card__next');
    prev.classList.add('card__prev');
    next.appendChild(nextArrow);
    prev.appendChild(prevArrow);

    container.parentNode.insertBefore(prev, container);
    container.parentNode.insertBefore(next, container);

    // next 및 prev에 이벤트리스너 장착

    next.addEventListener('click', (e) => onClickCardNav(e, container));
    prev.addEventListener('click', (e) => onClickCardNav(e, container));

    results.forEach((movie) => {
        // 영화의 수만큼 카드를 만들어서 어펜드 시켜준다 추가로 카드 클릭시 일어날 이벤트도 등록
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = movie.id;
        card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
        container.appendChild(card);
        card.addEventListener('click', (e) => makeModal(e, movie));
    });
}

// 캐러셀 클릭이벤트
function onClickCardNav(e, container) {
    // 타겟의 클래스명을 통해 이전버튼인지 다음버튼인지 식별
    // 인자로 받은 컨테이너의 클래스명에서 카드 캐러셀을 제외한 클래스명을 반환 (카드캐러셀을 제외하면 카테고리명이 남는다.)
    const next = e.currentTarget.classList.contains('card__next');
    const prev = e.currentTarget.classList.contains('card__prev');
    const category = Array.from(container.classList).find((name) => name !== 'card_carousel');

    // 전역 변수로 만들어둔 객체 counter는 키로 카테고리명을 벨류로 카운터를 가지고있다.
    // 변수로 만들어둔 카테고리명과 같은 키를 통해 카운터를 찾고 카운터의 수에따라 다른 조건의 동작을 하도록 만들었다.
    if (next && counter[category] < 3) {
        counter[category]++;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        return;
    }
    if (prev && counter[category] > 0) {
        counter[category]--;
        container.style.transform = `translateX(-${counter[category] * 100}%)`;
        return;
    }
}

export function makeModal(e, movie) {
    // 이전페이지 및 다음페이지 없을싯 버튼에 상태를 변경해주는거 추가해야함

    // 영화카드 클릭시 실행되는 함수로 백드롭과 모달을 엑티브 시켜주며 모달안에 인자로받은 영화에대한 정보를 담아준다.
    $backDrop.classList.add('active');
    $modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const modalHtml = `<h1 class="modal__title">
    ${movie.title}(${movie.release_date.split('-')[0]})
    <span
        style="
            text-align: center;
            display: inline-block;
            background-color: white;
            padding:2px 4px;
            color: black;
            font-weight: bold;
            font-size: 18px;
            border-radius: 4px;
        "
        >${movie.vote_average}</span
    >
</h1>
<p>
   ${movie.overview}
</p>
<div
    class="modal__bg"
    style="background-image: url('https://image.tmdb.org/t/p/original/${movie.backdrop_path}')"
></div>`;

    $modal.innerHTML = modalHtml;
}

export function exitModal() {
    // 모달과 백드롭을 사라지게해주는 함수이다.
    $backDrop.classList.remove('active');
    $modal.classList.remove('active');
    document.body.style.overflow = '';
}

export async function submitFrom(e) {
    // 서브밋시 자동 새로고침을 막기위한 이벤트 기본동작정지
    e.preventDefault();
    const value = $input.value;
    localStorage.setItem('q', value);
    return (location.href = 'search.html');

    // 필요기능 input의 벨류를 search.html에 전달해서 검색값을 보여줘야함...
}
