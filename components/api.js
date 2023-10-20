// API관련된 요소들을 모듈화하였다.

const options = {
    headers: {
        accept: 'application/json',
        Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGM2MDMxNjBmN2IxY2NlMzk1YTE2NzUxMDY5MmZjZCIsInN1YiI6IjYzM2QzMDVlMjBlNmE1MDA4MTdhNWEzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.rl3cm1gDAR9xtqQUJWGKlyGq-TYFmyIlcm6gHn5eNZU',
    },
};

async function fetchApi(promise, categorys) {
    // promise는 배열안에든 promise다 , categorys는 객체이다.
    const json = await Promise.all(promise);
    // promise.all을 통해 여러개의 fetch를 비동기로 실행한다.

    // results가 undefind일경우 json의 첫번째 요소를 results가 객체인경우 json의값에 category라는 키와 값을 만들어준다.
    const results = categorys
        ? json.map((data, index) => {
              return { category: categorys[index], ...data };
          })
        : json[0];

    console.log(results);

    return results;
}

export { options, fetchApi };
