const { Router } = require('express');
const authRoutes = require('./auth');
const eventRoutes = require('./events');
const categoriesRoutes = require('./categories.js');
const tagsRoutes = require('./tags');

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/event-category', categoriesRoutes);
router.use('/event-tags', tagsRoutes);

module.exports = router;
