const format = require('pg-format');
const { query } = require('../connection');
const db = require('../connection');
const seed = (data) => {
  const { articleData, commentData, topicData, userData } = data;
  // Drop tables if they already exist
  return (
    db
      .query(`DROP TABLE IF EXISTS comments;`)
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS articles;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS topics;`);
      })
      .then(() => {
        return db.query(`DROP TABLE IF EXISTS users;`);
      })
      .then(() => {
        // Create table users
        return db.query(`
      CREATE TABLE users (
        username VARCHAR(20) PRIMARY KEY,
        avatar_url VARCHAR(255) NOT NULL,
        name VARCHAR(30) NOT NULL
      );`);
      })
      .then(() => {
        // Create table topics
        return db.query(
          `CREATE TABLE topics (
				slug VARCHAR(50) PRIMARY KEY,
				description VARCHAR(250) NOT NULL
			  );`
        );
      })
      .then(() => {
        // Create table articles
        return db.query(
          `CREATE TABLE articles (
					article_id SERIAL PRIMARY KEY,
					title VARCHAR(250) NOT NULL,
					body VARCHAR NOT NULL,
					votes INT DEFAULT 0 NOT NULL,
					topic VARCHAR(50) REFERENCES topics(slug),
					author VARCHAR REFERENCES users(username),
					created_at DATE DEFAULT CURRENT_TIMESTAMP NOT NULL
			  );`
        );
      })
      .then(() => {
        // Crete table comments
        return db.query(
          `CREATE TABLE comments (
					comment_id SERIAL PRIMARY KEY,
					author VARCHAR REFERENCES users(username),
					article_id INT REFERENCES articles(article_id),
					votes INT DEFAULT 0 NOT NULL,
					created_at DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
					body TEXT NOT NULL
				
			  );`
        );
      })

      // 2. insert data
      .then(() => {
        const queryStr = format(
          `INSERT INTO users
			(username, avatar_url, name)
			VALUES
			%L;`,
          userData.map((item) => {
            return [item.username, item.avatar_url, item.name];
          })
        );
        return db.query(queryStr);
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO topics
			(slug, description)
			VALUES
			%L;`,
          topicData.map((item) => [item.slug, item.description])
        );
        return db.query(queryStr);
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO articles
			( title, body, votes, topic, author, created_at)
			VALUES
			%L;`,
          articleData.map((item) => [
            item.title,
            item.body,
            item.votes,
            item.topic,
            item.author,
            item.created_at,
          ])
        );
        return db.query(queryStr);
      })
      .then(() => {
        const queryStr = format(
          `INSERT INTO comments
			(author, article_id, votes, created_at, body)
			VALUES
			%L;`,
          commentData.map((item) => [
            item.author,
            item.article_id,
            item.votes,
            item.created_at,
            item.body,
          ])
        );

        return db.query(queryStr);
      })
  );
};
module.exports = seed;
