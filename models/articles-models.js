const db = require('../db/connection');

exports.selectArticleById = async (article_id) => {
  const { rows } = await db.query(
    `
    SELECT articles.*, COUNT(comments.article_id)
    AS comment_count FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id = $1 GROUP BY articles.article_id
    `,
    [article_id]
  );
  const article = rows[0];
  if (!article) {
    return Promise.reject({
      status: 404,
      msg: `non existent ID`,
    });
  }
  return article;
};

exports.updateArticleById = async (article_id, inc_votes = 0) => {
  // check for article id
  const { rows: valid_id } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  const validArticleId = valid_id;
  let isValidArticleId = false;

  if (validArticleId[0]) {
    isValidArticleId = true;
  }

  if (!isValidArticleId) {
    return Promise.reject({
      status: 404,
      msg: 'non existent ID',
    });
  }

  const queryStr = `UPDATE articles 
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;

  const { rows } = await db.query(queryStr, [inc_votes, article_id]);
  return rows[0];
};

exports.selectArticles = async (
  sort_by = 'created_at',
  order = 'desc',
  topic = ''
) => {
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'invalid order query' });
  }
  if (
    ![
      'author',
      'title',
      'article_id',
      'topic',
      'created_at',
      'votes',
      'comment_count',
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: 'invalid sort_by query' });
  }

  // check for topics
  const { rows: listTopics } = await db.query(`SELECT * FROM topics`);
  const whiteListTopics = listTopics.map((topic) => {
    return topic.slug;
  });

  let queryStr = `
  SELECT articles.*, COUNT(comments.article_id)
  AS comment_count FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id `;

  const queryValues = [];

  if (topic) {
    if (!whiteListTopics.includes(topic)) {
      return Promise.reject({
        status: 404,
        msg: `non existent topic query`,
      });
    }
    const addTopicQuery = `WHERE articles.topic = $1 `;
    queryStr += addTopicQuery;
    queryValues.push(topic);
  }

  const endOfQueryStr = `GROUP BY articles.article_id ORDER BY ${sort_by} ${order.toUpperCase()}; `;
  const finalQuery = queryStr.concat(endOfQueryStr);

  const result = await db.query(finalQuery, queryValues);

  return result.rows;
};

exports.selectCommentsByArticleId = async (article_id) => {
  // check for article id
  const { rows: valid_id } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  const validArticleId = valid_id;
  let isValidArticleId = false;

  if (validArticleId[0]) {
    isValidArticleId = true;
  }

  if (!isValidArticleId) {
    return Promise.reject({
      status: 404,
      msg: 'non existent ID',
    });
  }

  const result = await db.query(
    'SELECT * FROM comments WHERE article_id = $1',
    [article_id]
  );

  return result.rows;
};

exports.insertcommentByArticleId = async (username, body, article_id) => {
  // check for article id
  const { rows: valid_id } = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  const validArticleId = valid_id;
  let isValidArticleId = false;

  if (validArticleId[0]) {
    isValidArticleId = true;
  }

  if (!isValidArticleId) {
    return Promise.reject({
      status: 404,
      msg: 'non existent ID',
    });
  }

  // Check for username
  const { rows: listUserName } = await db.query(`SELECT * FROM users`);
  const whiteListUserName = listUserName.map((user) => {
    return user.username;
  });

  if (username) {
    if (!whiteListUserName.includes(username)) {
      return Promise.reject({
        status: 404,
        msg: `non existent username`,
      });
    }
    const { rows } = await db.query(
      'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
      [username, body, article_id]
    );

    return rows[0];
  }
};
