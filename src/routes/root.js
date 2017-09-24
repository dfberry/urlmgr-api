'use strict';

const express = require('express'),
router = express.Router(),
v1 = require('./v1/route.js'),
errors = require('./errors');

router.use(function(req, res, next) {
  console.log('method %s url %s path %s', req.method, req.url, req.path);
  next();
});

// ROOT
router.get("/", (req, res) => {
  req.app.locals.libraries.response.buildResponseSuccess(req, { route: 'root'}, {}, {}).then(response => {
      res.json(response);
  }).catch(err => {
      res.json({error: err});
  });
});

router.use('/v1', v1);

function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}
router.use(logErrors);

// catch 404 and forward to error handler
router.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    res.status(404).send(err);  
});


// catch all error handlers
router.use(errors);

router.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke! ' + JSON.stringify(err))
});

module.exports = router;