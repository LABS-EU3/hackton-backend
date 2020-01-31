const userModel = require('../../models/userModel');
const requestHandler = require('../../utils/requestHandler');

async function handleGetUserList(req, res) {
  try {
    const users = await userModel.getUsers();
    return requestHandler.success(res, 200, 'Users fetched successfully', {
      users
    });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}
async function handleGetSingleUser(req, res) {
  const { id } = req.params;
  const { email, username } = req.body;
  let searchQuery;
  if (id) {
    searchQuery = { id };
  }
  if (email) {
    searchQuery = { email };
  }
  if (username) {
    searchQuery = { username };
  }
  try {
    const user = await userModel.getSingleUser(searchQuery);
    if (user) {
      return requestHandler.success(res, 200, 'User fetched successfully', {
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

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.decodedToken;
    const foundUser = userModel.getSingleUser({ id: userId });
    if (foundUser) {
      const updates = {
        email: req.body.email || foundUser.email,
        username: req.body.username || foundUser.username,
        fullname: req.body.fullname || foundUser.fullname,
        bio: req.body.bio || foundUser.bio,
        image_url: req.body.image_url || foundUser.image_url
      };
      const userUpdates = await userModel.updateUser(updates, userId);
      return requestHandler.success(res, 200, 'Profile updated successfully', {
        userUpdates
      });
    }
    return requestHandler.error(res, 400, `You are not authorized to do this`);
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
};

module.exports = {
  handleGetUserList,
  handleGetSingleUser,
  updateUserProfile
};
