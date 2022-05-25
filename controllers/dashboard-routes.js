// intended for dashboard views
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    // we'll hardcode the loggedIn property as true on this route, because a user won't even be able to get to the dashboard page unless they're logged in
    res.render('dashboard', { loggedIn: true });
  });

module.exports = router;