const { Router } = require('express');
const {
  handleCategoriesDelete,
  handleCategoriesEdit,
  handleCategoriesPost,
  handleCategoriesGet
} = require('../controllers/eventsCategories/categoryControllers');
const {
  validateID,
  ValidateCategory,
  validateDuplicateValues
} = require('../middlewares/categoryValidation');
const authenticate = require('../api/auth/authenticate');

const router = Router();

router.post('/', authenticate, validateDuplicateValues, handleCategoriesPost);
router.get('/', authenticate, handleCategoriesGet);
router.put(
  '/:id',
  authenticate,
  validateID,
  ValidateCategory,
  handleCategoriesEdit
);
router.delete(
  '/:id',
  authenticate,
  validateID,
  ValidateCategory,
  handleCategoriesDelete
);

module.exports = router;
