// collecting the packaged group of API endpoints and prefixing them with the path /api 

const router = require('express').Router();
const apiRoutes = require('./api');
const homeRoutes = require('./home-routes');
const dashboardRoutes = require('./dashboard-routes.js');

router.use('/api', apiRoutes);
router.use('/', homeRoutes);
// now all dashboard views will be prefixed with /dashboard
router.use('/dashboard', dashboardRoutes);

// if we make a resuest to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;