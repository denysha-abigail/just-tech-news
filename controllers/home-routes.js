// this file will contain all of the user-facing routes, such as the homepage and login page
// intended for all homepage-related views
const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// root route
router.get('/', (req, res) => {
  console.log(req.session)
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      // we need to serialize the entire array because we need the entire array of posts to be in the template; this will loop over and map each sequelize object into a serialized version of itself; saving the results in a new posts array
      const posts = dbPostData.map(post => post.get({ plain: true }));
      // pass a single post object into the homepage template
      // in previous modules, we've used res.send() or res.sendFile() for the response; because we've hooked up a template engine, we can now use res.render() and specify which template we want to use
      // in this case, we want to use the homepage.handlebars template (the .handlebars extension is implied)
      // res.render() can accept a second argument, an object (which includes all of the data we want to pass to our template)
      // dbPostData[0] is data that sequelize is returning as a sequelize object; to serialize the object down to only the properties that you need, you can use sequelize's get() method
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// renders login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  // what's different here is that our login page doesn't need any variables so no need to pass a second argument to the render() method
  res.render('login');
});

router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render('single-post', { post, loggedIn: req.session.loggedIn });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;