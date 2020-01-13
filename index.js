const server = require('./api/server');

const port = process.env.PORT || 4000;

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('listening on port', port);
});
