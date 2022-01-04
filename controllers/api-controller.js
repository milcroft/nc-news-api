exports.getApi = (req, res, next) => {
  res.status(200).send({
    'GET /api': {
      description:
        'serves up a json representation of all the available endpoints of the api',
    },
    'GET /api/topics': {
      description: 'serves an array of all topics',
      queries: [],
      exampleResponse: {
        topics: [{ slug: 'coding', description: 'Code is love, code is life' }],
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
};
