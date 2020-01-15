const { Router } = require('express');
const {
  handleTagsDelete,
  handleTagsEdit,
  handleTagsPost,
  handleTagsGet
} = require('../controllers/eventsTags/eventTagsControllers');
const authenticate = require('../api/auth/authenticate');

const router = Router();

router.post('/', authenticate, handleTagsPost);
router.get('/', authenticate, handleTagsGet);
router.put('/:id', authenticate, handleTagsEdit);
router.delete('/:id', authenticate, handleTagsDelete);

module.exports = router;
