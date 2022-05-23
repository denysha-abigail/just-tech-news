// this file will contain all of the user-facing routes, such as the homepage and login page

const router = require('express').Router();

router.get('/', (req, res) => {
// in previous modules, we've used res.send() or res.sendFile() for the response; because we've hooked up a template engine, we can now use res.render() and specify which template we want to use
// in this case, we want to use the homepage.handlebars template (the .handlebars extension is implied)
// res.render() can accept a second argument, an object (which includes all of the data we want to pass to our template)
  res.render('homepage', {
      // each property on the object id, post_url, title, etc. become available in the template using the handlebars.js {{ }} syntax
      id: 1,
      post_url: 'https://handlebarsjs.com/guide/',
      title: 'Handlebars Docs',
      created_at: new Date(),
      vote_count: 10,
      comments: [{}, {}],
      user: {
          username: 'test_user'
      }
  });
});

module.exports = router;