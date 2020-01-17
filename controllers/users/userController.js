const EventTeam = require('./userModel');
const requestHandler = require('../../utils/requestHandler');

async function handleGetUserList(req, res) {
  try {
    const users = await EventTeam.getUsers();
    return requestHandler.success(res, 200, 'Users Fetched successfully!', {
      users
    });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}
async function handleGetSingleUser(req, res) {
  const { id } = req.params;
  const { email, username } = req.body;
  const searchQuery = { email } || { username } || { id };
  try {
    const user = await EventTeam.getUsersById(searchQuery);
    if (user) {
      return requestHandler.success(res, 200, 'User Fetched successfully!', {
        user
      });
    }
    return requestHandler.error(
      res,
      400,
      `User with ${searchQuery} does not exist`
    );
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}

module.exports = {
  handleGetUserList,
  handleGetSingleUser
};
