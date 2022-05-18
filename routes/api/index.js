// this file serves as a means to collect ALL of the API routes and package them up
// collects the endpoints and prefixes them
const router = require('express').Router();
const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');

// notice how in user-routes.js we didn't use the word users in any routes; in this file we take those routes and implement them to another router instance, prefixing them with the path /users
router.use('/users', userRoutes);
router.use('/posts', postRoutes);

module.exports = router;