const express = require('express');

const {
  removeCommentById,
  patchCommentById,
} = require('../controllers/comments-controller');

const commentsRouter = express.Router();

commentsRouter.route('/');

commentsRouter
  .route('/:comment_id')
  .delete(removeCommentById)
  .patch(patchCommentById);

module.exports = commentsRouter;
