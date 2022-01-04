const {
  deleteCommentsById,
  updateCommentById,
} = require('../models/comments-models');

exports.removeCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentsById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};
