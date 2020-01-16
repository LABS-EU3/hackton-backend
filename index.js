const server = require('./api/server');

const port = process.env.PORT || 6000;

server.listen(port, err => {
  if (err) return console.error(err.message);
  return console.log(`server is listening on http://localhost:${port}`);
});
