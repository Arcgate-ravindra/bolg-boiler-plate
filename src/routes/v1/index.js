const router = require('express').Router();
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const blogRoute = require("./blog.route");
const addressRoute = require('./address.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const fileRoute = require('./file.route');
const googleRoute = require('./google.route')
const githubRoute = require('./github.route');

 
const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/address',
    route: addressRoute,
  },
  {
    path: '/blog',
    route: blogRoute,
  },
  {
    path : '/upload',
    route : fileRoute
  },
  {
    path : '/authg',
    route : googleRoute
  },
  {
    path : '/authg',
    route : githubRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
