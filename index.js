// Dom
const $cardCarousels = document.querySelectorAll('.card_carousel');
const $cardNext = document.querySelectorAll('.card__next');
const $cardPrev = document.querySelectorAll('.card__prev');

// counter
const counter = {
    popular: 0,
    topRated: 0,
    nowPlaying: 0,
};

// let popularCounter = 0;
// let topRatedCounter = 0;
// let nowPlayingCounter = 0;
// API

const options = {
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

(async function fetchMovies() {
    const [popular, topRated, nowPlaying] = await Promise.all([Popular, TopRated, NowPlaying]);

    const result = { popular, topRated, nowPlaying };

    const categorys = Object.keys(result);
    categorys.forEach((category) => makeCard(category, result[category]));
})();

function makeCard(category, movies) {
    const container = Array.from($cardCarousels).find((box) => box.classList.contains(category));
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
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
        container.appendChild(card);
    });
    console.log(container);
    console.log(movies);
}

function onClickCardNav(e, container) {
    const next = e.currentTarget.classList.contains('card__next');
    const prev = e.currentTarget.classList.contains('card__prev');
    const category = Array.from(container.classList).find((name) => name !== 'card_carousel');

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
