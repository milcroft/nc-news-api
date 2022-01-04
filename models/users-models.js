const db = require('../db/connection');

exports.selectUsers = async () => {
  const result = await db.query(`SELECT username FROM users;`);
  return result.rows;
};

exports.selectUserByUsername = async (username) => {
  const result = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);
  if (result.rows.length === 0)
    return Promise.reject({
      status: 400,
      msg: `no user found for this username`,
    });
  return result.rows;
};
