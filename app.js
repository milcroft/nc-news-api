const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors());
app.options('*', cors());

const { handleCustomErrors } = require('./errors/handleCustomErrors.js');
const { handlePsqlErrors } = require('./errors/handlePsqlErrors.js');
const { handleServerErrors } = require('./errors/handleServerErrors.js');

const apiRouter = require('./routes/api-router');

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
