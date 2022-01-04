exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  } else if (err.code === '22003') {
    res.status(400).send({ msg: 'Is out of range for type Integer' });
  } else if (err.code === '23503') {
    res.status(400).send({ msg: 'Insert or update failed' });
  } else if (err.code === '23502') {
    res.status(400).send({ msg: 'Missing required feilds' });
  } else next(err);
};
