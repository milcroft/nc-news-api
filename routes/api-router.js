const express = require('express');

const { getApi } = require('../controllers/api-controller');

const articlesRouter = require('./articles-router');
const topicsRouter = require('./topics-router');
const commentsRouter = require('./comments-router');
const usersRouter = require('./users-router');

const apiRouter = express.Router();

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.route('/').get(getApi);


module.exports = apiRouter;
