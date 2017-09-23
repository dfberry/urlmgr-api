'use strict';

const express = require('express'),
  router = express.Router(),
  urls = require('./urls'),
  users = require('./users'),
  meta = require('./meta'),
  tags = require('./tags'),
  auth = require('./authentication'),
  claims = require('./claims'),
  cache = require('./cache'),
  errors = require('./errors');

router.use(claims);


router.use(function(req, res, next) {
  console.log('method %s url %s path %s', req.method, req.url, req.path);
  next();
});

// ROOT
router.get("/", (req, res) => {
    req.local.libraries.response.buildResponseSuccess(req, { route: 'root'}, {}, {}).then(response => {
        res.json(response);
    }).catch(err => {
        res.json({error: err});
    });
});

router.use('/urls',urls);
router.use('/users',users);
router.use('/auth',auth);
router.use('/meta', meta);
router.use('/tags', tags);
router.use('/cache',cache);

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

module.exports = router