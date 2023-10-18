// Dom
const $cardCarousels = document.querySelectorAll('.card_carousel');

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
    results.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
        container.appendChild(card);
    });
    console.log(container);
    console.log(movies);
}
