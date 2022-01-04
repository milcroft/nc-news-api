const express = require('express');

const { handleCustomErrors } = require('./errors/handleCustomErrors.js');
const { handlePsqlErrors } = require('./errors/handlePsqlErrors.js');
const { handleServerErrors } = require('./errors/handleServerErrors.js');

const apiRouter = require('./routes/api-router');

const app = express();
app.use(express.json());

app.use('/api', apiRouter);

app.all('/*', (req, res) => {
  res.status(404).send({ msg: 'path not found' });
});

// error handling middleware
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
