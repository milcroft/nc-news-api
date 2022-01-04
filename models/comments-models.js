const db = require('../db/connection');

exports.deleteCommentsById = async (comment_id) => {
  // check for comment id
  const { rows: valid_id } = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );
  const validCommentId = valid_id;
  let isValidCommentId = false;

  if (validCommentId[0]) {
    isValidCommentId = true;
  }

  if (!isValidCommentId) {
    return Promise.reject({
      status: 404,
      msg: 'non existent ID',
    });
  }
  const { row } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1;`,
    [comment_id]
  );
  return row;
};

exports.updateCommentById = async (comment_id, inc_votes) => {
  const queryStr = `UPDATE comments
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;`;
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request, no input obj provided',
    });
  }
  const { rows } = await db.query(queryStr, [inc_votes, comment_id]);
  return rows[0];
};
