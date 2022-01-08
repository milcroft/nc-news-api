const app = require('./app');

const { PORT = 9090 } = process.env;
const cors = require('cors');
app.use(cors())

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});
