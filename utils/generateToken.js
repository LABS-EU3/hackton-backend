const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email
  };
  const options = {
    expiresIn: '1 day'
  };
  const result = jwt.sign(
    payload,
    process.env.SECRET || 'testing test',
    options
  );
  return result;
}

module.exports = generateToken;
