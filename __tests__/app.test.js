//  Require
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe(`Get/api/topics`, () => {
  it(`Status 200, returns object with all topics`, () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });

  it(`Status 404 will be returned with Object with msg: "path not found"`, () => {
    return request(app)
      .get('/api/topiks')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'path not found' });
      });
  });
});

describe(`Get/api/articles/:article_id`, () => {
  it(`Status 200, will return object with the selected article`, () => {
    const ARTICLE_ID = 1;
    return request(app)
      .get(`/api/articles/${ARTICLE_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: ARTICLE_ID,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: expect.any(String),
          votes: 100,
          comment_count: '11',
        });
      });
  });

  it(`Status 404 will be returned  Object with msg: "No article found for article_id 222"`, () => {
    return request(app)
      .get('/api/articles/222')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `non existent ID`,
        });
      });
  });

  it(`Status 400 will be returned with Object with a msg: "Invalid input"`, () => {
    return request(app)
      .get('/api/articles/abc')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: `Invalid input` });
      });
  });

  it(`Status 400 will be returned with Object msg: 'Internal Server Error' if inputted number is over 10 digits`, () => {
    return request(app)
      .get('/api/articles/1646456754756756765756756756754672/')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Is out of range for type Integer' });
      });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  it('status:200, responds with the updated article', () => {
    const ARTICLE_UPDATE = {
      inc_votes: 2,
    };
    return request(app)
      .patch('/api/articles/1')
      .send(ARTICLE_UPDATE)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: expect.any(String),
          votes: 102,
        });
      });
  });

  it(`Status 404 will be returned  Object with msg: "No article found for article_id 222"`, () => {
    return request(app)
      .patch('/api/articles/222')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: `non existent ID`,
        });
      });
  });

  it(`Status 400 will be returned with Object with a msg: "Invalid input"`, () => {
    return request(app)
      .patch('/api/articles/abc')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: `Invalid input` });
      });
  });
});

describe(`Get/api/articles`, () => {
  it(`Status 200, returns object with all articles`, () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  it('Should return articles in descending order and sort_by created_at', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = 0;
        const lastArticle = articles.length - 1;
        expect(articles[firstArticle].title).toEqual(
          'Eight pug gifs that remind me of mitch'
        );
        expect(articles[lastArticle].title).toEqual('Z');
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });

  it(`Status 404 will be returned for input of article without the (s) with an Object with the msg: "path not found"`, () => {
    return request(app)
      .get('/api/article')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'path not found' });
      });
  });

  it(`Status 200, returns object with all articles in ascending order and sort_by created_at`, () => {
    return request(app)
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = 0;
        const lastArticle = articles.length - 1;
        expect(articles[firstArticle].title).toEqual('Z');
        expect(articles[lastArticle].title).toEqual(
          'Eight pug gifs that remind me of mitch'
        );
        expect(articles).toBeSortedBy('created_at', { descending: false });
      });
  });

  it('Should return articles in descending order and sort_by created_at', () => {
    return request(app)
      .get('/api/articles?order=desc')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = 0;
        const lastArticle = articles.length - 1;
        expect(articles[firstArticle].title).toEqual(
          'Eight pug gifs that remind me of mitch'
        );
        expect(articles[lastArticle].title).toEqual('Z');
        expect(articles).toBeSortedBy('created_at', { descending: true });
      });
  });

  it(`Status 400 will be returned with Object msg: "invalid order query" for wrong values`, () => {
    return request(app)
      .get('/api/articles?order=dooh')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'invalid order query' });
      });
  });

  it(`Status 200, returns object with all articles in descending order and sort_by title`, () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = 0;
        const lastArticle = articles.length - 1;
        expect(articles[firstArticle].title).toEqual('Z');
        expect(articles[lastArticle].title).toEqual('A');
      });
  });

  it(`Status 400 will be returned with Object msg: "invalid sort_by query" for incorrect values`, () => {
    return request(app)
      .get('/api/articles?sort_by=dooh')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'invalid sort_by query' });
      });
  });

  it(`Status 200, returns object with all articles in ascending order and sort_by title using both order and sort values`, () => {
    return request(app)
      .get('/api/articles?order=asc&sort_by=title')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        const firstArticle = 0;
        const lastArticle = articles.length - 1;
        expect(articles[firstArticle].title).toEqual('A');
        expect(articles[lastArticle].title).toEqual('Z');
      });
  });

  it(`Status 400 will be returned with Object msg: "invalid sort_by query" for wrong values input in sort_by in a multiple query`, () => {
    return request(app)
      .get('/api/articles?order=asc&sort_by=dooh')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'invalid sort_by query' });
      });
  });

  it(`Status 200 will be returned with Object with all articles which have the topic cats`, () => {
    const topic = 'cats';
    const firstArticle = 0;
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(1);
        expect(articles).toBeSortedBy('created_at', { descending: true });
        expect(articles[firstArticle].votes).toEqual(0);
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: `${topic}`,
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  it(`Status 200 will be returned with Object with all articles which have the topic mitch`, () => {
    const topic = 'mitch';
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy('created_at', { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: `${topic}`,
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  it(`Status 200 will be returned with Object with all articles which have the topic mitch and orderd asc and sorted by votes`, () => {
    const topic = 'mitch';
    return request(app)
      .get(`/api/articles?topic=${topic}&sort_by=votes&order=asc`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy('votes', { descending: false });
        expect(articles[0].votes).toEqual(0);
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: `${topic}`,
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  it(`Status 200 will be returned with Object with all articles which have the topic mitch and orderd desc and sorted by votes`, () => {
    const topic = 'mitch';
    return request(app)
      .get(`/api/articles?topic=${topic}&sort_by=votes&order=desc`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy('votes', { descending: true });
        expect(articles[0].votes).toEqual(100);
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: `${topic}`,
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });

  it(`Status 400 will be returned with Object msg: "invalid sort_by query" for wrong values input in sort_by in a multiple query using topic, order and sort_by `, () => {
    const topic = 'mitch';
    return request(app)
      .get(`/api/articles?topic=${topic}&sort_by=vote&order=asc`)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'invalid sort_by query' });
      });
  });

  it(`Status 200 will be returned with Object with all articles which have the topic mitch and orderd ASC and sorted by votes`, () => {
    const topic = 'mitch';
    return request(app)
      .get(`/api/articles?topic=${topic}&sort_by=author&order=desc`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(11);
        expect(articles).toBeSortedBy('author', { descending: true });
        expect(articles[0].author).toEqual('rogersop');
        articles.forEach((article) => {
          expect(article).toEqual({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: `${topic}`,
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe(`Get/api/article_id/comments`, () => {
  it(`Status 200, returns object with all comments for article_id`, () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  it(`Status 200 will be returned with an emty array for articles without comments`, () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ comments: [] });
      });
  });

  it(`Status 400 will be returned with Object msg: "Invalid input" if inputted is not a number`, () => {
    return request(app)
      .get('/api/articles/abc/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Invalid input' });
      });
  });

  it(`Status 500 will be returned with Object msg: 'Internal Server Error' if inputted number is over 10 digits`, () => {
    return request(app)
      .get('/api/articles/1646456754756756765756756756754672/COMMENTS')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Is out of range for type Integer' });
      });
  });
});

describe(`POST/api/article_id/comments`, () => {
  it('Status:201, responds with comment newly added to the database', () => {
    const newComment = {
      username: 'icellusedkars',
      body: '****** I Like This *****',
    };
    return request(app)
      .post('/api/articles/3/comments')
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: 3,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 0,
          author: 'icellusedkars',
          body: '****** I Like This *****',
        });
      });
  });

  it('Status 500 will be returned with Object msg: "Internal Server Error" when trying to add comment to non existent article', () => {
    const newComment = {
      author: 'icellusedkars',
      body: '****** This will be an error *****',
    };
    return request(app)
      .post('/api/articles/364/comments')
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'non existent ID' });
      });
  });

  it('Status 400 will be returned with Object msg: "Invalid input"', () => {
    const newComment = {
      author: 'icellusedkars',
      body: '****** This will be an error *****',
    };
    return request(app)
      .post('/api/articles/dsfgsd/comments')
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Invalid input' });
      });
  });
});

describe('DELETE api /comments/:comment_id', () => {
  it('status:204, responds with an empty response body', () => {
    return request(app).delete('/api/comments/2').expect(204);
  });

  it('Status 404 will for non existing ID', () => {
    return request(app)
      .delete('/api/comments/534534')
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'non existent ID' });
      });
  });

  it('Status 404 will for non existing ID', () => {
    return request(app)
      .delete('/api/comments/not-an-id')
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: 'Invalid input' });
      });
  });
});

describe(`Get/api/users`, () => {
  it(`Status 200, returns object with all users`, () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual({
            username: expect.any(String),
          });
        });
      });
  });
});

describe(`Get/api/users/:username`, () => {
  it(`Status 200, will return array with selected user`, () => {
    const username = 'butter_bridge';
    return request(app)
      .get(`/api/users/${username}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual([
          {
            username: 'butter_bridge',
            name: 'jonny',
            avatar_url:
              'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
          },
        ]);
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  it('status:200, responds with the updated comment with vote incremented by 1', () => {
    const COMMENT_UPDATE = {
      inc_votes: 1,
    };
    return request(app)
      .patch('/api/comments/1')
      .send(COMMENT_UPDATE)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: expect.any(String),
          votes: 17,
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it('status:200, responds with the updated comment with vote incremented by -1', () => {
    const COMMENT_UPDATE = {
      inc_votes: -1,
    };
    return request(app)
      .patch('/api/comments/1')
      .send(COMMENT_UPDATE)
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: expect.any(String),
          votes: 15,
          author: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
});

describe('GET api', () => {
  it('status:200, returns JSON describing all the available endpoints on your API,', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({
          'GET /api': {
            description:
              'serves up a json representation of all the available endpoints of the api',
          },
          'GET /api/topics': {
            description: 'serves an array of all topics',
            queries: [],
            exampleResponse: {
              topics: [
                { slug: 'coding', description: 'Code is love, code is life' },
              ],
            },
          },
          'GET /api/articles': {
            description: 'serves an array of all articles',
            queries: ['sort_by', 'order', 'topic'],
            exampleResponse: {
              articles: [
                {
                  article_id: 1,
                  title: 'Running a Node App',
                  body: 'This is part two of a series on how to get up and running with Systemd and Node.js',
                  votes: 0,
                  topic: 'coding',
                  author: 'jessjelly',
                  created_at: '2020-11-07T00:00:00.000Z',
                  comment_count: '8',
                },
              ],
            },
          },
          'GET /api/articles/:article_id': {
            description: 'Returns an article by article_id',
            queries: [],
            exampleResponse: {
              article: [
                {
                  article_id: 3,
                  title: '22 Amazing open source React projects',
                  body: 'his is a collection of open source apps built with React.JS library.',
                  votes: 0,
                  topic: 'coding',
                  author: 'happyamy2016',
                  created_at: '2020-02-29T00: 00: 00.000Z',
                  comment_count: '8',
                },
              ],
            },
          },
          'GET /api/articles/:article_id/comments': {
            description: 'Returns comments by article_id',
            queries: [],
            exampleResponse: {
              comments: [
                {
                  comments_id: 33,
                  author: 'cooljmessy',
                  article_id: 1,
                  votes: 4,
                  created_at: '2019-12-31T00:00:00.000Z',
                  body: 'Explicabo perspiciatis voluptatem sunt tenetur maxime aut.',
                },
              ],
            },
          },
          'GET /api/users': {
            description: 'Returns users',
            queries: [],
            exampleResponse: {
              users: [
                {
                  username: 'tickle122',
                },
                {
                  username: 'grumpy19',
                },
                {
                  username: 'happyamy2016',
                },
                {
                  username: 'cooljmessy',
                },
                {
                  username: 'weegembump',
                },
                {
                  username: 'jessjelly',
                },
              ],
            },
          },

          'GET /api/users/:username': {
            description: 'Returns user details',
            queries: [],
            exampleResponse: {
              user: [
                {
                  username: 'jessjelly',
                  avatar_url:
                    'https://vignette.wikia.nocookie.net/mrmen/images/4/4f/MR_JELLY_4A.jpg/revision/latest?cb=20180104121141',
                  name: 'Jess Jelly',
                },
              ],
            },
          },

          'POST /api/articles/:article_id/comments': {
            description: 'Posts comment to article by article_id',
            queries: [],
            exampleInput: {
              comments: [
                {
                  username: 'cooljmessy',
                  body: 'Explicabo perspiciatis voluptatem sunt tenetur maxime aut.',
                },
              ],
            },
          },

          'POST /api/articles/:article_id/comments': {
            description: 'Posts comment to article by article_id',
            queries: [],
            exampleInput: {
              comments: [
                {
                  username: 'cooljmessy',
                  body: 'Explicabo perspiciatis voluptatem sunt tenetur maxime aut.',
                },
              ],
            },
          },

          'PATCH /api/comment/:comment_id': {
            description: 'Update votes on comments',
            queries: [],
            exampleInput: {
              comments: [
                {
                  inc_votes: 1,
                },
              ],
            },
          },

          'PATCH /api/articles/:article_id': {
            description: 'Update votes on articles',
            queries: [],
            exampleInput: {
              comments: [
                {
                  inc_votes: -1,
                },
              ],
            },
          },

          'DELETE /api/comments/:comment_id': {
            description: 'Delete comment by comment_id',
          },
        });
      });
  });
});
