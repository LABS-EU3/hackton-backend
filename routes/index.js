const { Router } = require('express');
const authRoutes = require('./auth');
const eventRoutes = require('./events');
const categoriesRoutes = require('./categories.js');
<<<<<<< HEAD
const usersRoutes = require('./users');
=======
>>>>>>> 87fc3ef7ed97b0a108764a7f09d8f4975895ed1e

const router = Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/event-category', categoriesRoutes);
<<<<<<< HEAD
router.use('/users', usersRoutes);
=======
>>>>>>> 87fc3ef7ed97b0a108764a7f09d8f4975895ed1e

module.exports = router;
