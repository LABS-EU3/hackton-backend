/* eslint-disable no-use-before-define */
const { Router } = require('express');
const authenticate = require('../api/auth/authenticate');
const {
  handleGetUserList
} = require('../controllers/eventTeam/eventTeamController');

const router = Router();

router.get('/', authenticate, handleGetUserList);

module.exports = router;
