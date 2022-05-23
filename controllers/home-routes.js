// this file will contain all of the user-facing routes, such as the homepage and login page

const router = require('express').Router();

router.get('/', (req, res) => {
// in previous modules, we've used res.send() or res.sendFile() for the response; because we've hooked up a template engine, we can now use res.render() and specify which template we want to use
// in this case, we want to use the homepage.handlebars template (the .handlebars extension is implied)
  res.render('homepage');
});

module.exports = router;