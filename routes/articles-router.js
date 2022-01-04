const express = require('express');

const {
	getArticleById,
    patchArticleById,
    getArticles,
	getCommentsByArticleId,
    postCommentByArticleId,
} = require('../controllers/articles-controller');

const articlesRouter = express.Router();

articlesRouter.route('/')
    .get(getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById);

articlesRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentByArticleId);

module.exports = articlesRouter;
