// middleware function that can authguard routes; to authguard a route means to restrict it to authenticated users only
// calling next() calls the next middleware function, passing along the same req and res values
// this function will act as a normal request callback function, checking for the existence of a session property and using res.redirect() if it's not there
const withAuth = (req, res, next) => {
    // if res.session.user_id does exist, it will call next(), which could potentially be another middleware function or the final function that will render the template
    if (!req.session.user_id) {
      res.redirect('/login');
    } else {
      next();
    }
  };
  
  module.exports = withAuth;