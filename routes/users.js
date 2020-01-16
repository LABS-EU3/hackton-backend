/* eslint-disable no-use-before-define */
const { Router } = require('express');
const authenticate = require('../api/auth/authenticate');
const {
  handleGetUserList, handleGetSingleUser
} = require('../controllers/eventTeam/eventTeamController');

const router = Router();

router.get('/', authenticate, handleGetUserList);
router.get('/:id', authenticate, handleGetSingleUser);

module.exports = router;
