const options = {
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGM2MDMxNjBmN2IxY2NlMzk1YTE2NzUxMDY5MmZjZCIsInN1YiI6IjYzM2QzMDVlMjBlNmE1MDA4MTdhNWEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rl3cm1gDAR9xtqQUJWGKlyGq-TYFmyIlcm6gHn5eNZU',
    },
};

async function fetchApi(promise, categorys) {
    const json = await Promise.all(promise);
    const results = categorys
        ? json.map((data, index) => {
              return { category: categorys[index], ...data };
          })
        : json[0];

    return results;
}

export { options, fetchApi };
