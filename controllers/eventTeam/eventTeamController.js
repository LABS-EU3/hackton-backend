const EventTeam = require('./eventTeamModel');
const requestHandler = require('../../utils/requestHandler');

async function handleAddTeamMember(req, res) {
  try {
    const newTeamMate = req.team;
    const member = await EventTeam.addTeamMember({
      user_id: newTeamMate.id,
      event_id: newTeamMate.event_id,
      role_type: newTeamMate.role_type
    });
    return requestHandler.success(res, 200, 'Added successfully!', { member });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}

async function handleGetTeamMembers(req, res) {
  const { id } = req.params;
  try {
    const members = await EventTeam.getTeam(id);
    return requestHandler.success(res, 200, 'Fetched successfully!', {
      members
    });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}

async function handleDeleteTeamMember(req, res) {
  const teamMate = req.team;
  try {
    const members = await EventTeam.removeTeamMember({
      user_id: teamMate.user_id,
      event_id: teamMate.event_id
    });
    const currentTeam = await EventTeam.getTeam(teamMate.event_id);
    return requestHandler.success(res, 200, 'User deleted successfully!', {
      currentTeam
    });
  } catch (error) {
    return requestHandler.error(res, 500, `server error ${error.message}`);
  }
}

module.exports = {
  handleAddTeamMember,
  handleGetTeamMembers,
  handleDeleteTeamMember
};
