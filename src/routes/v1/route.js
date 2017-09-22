'use strict';

const express = require('express'),
  router = express.Router(),
  urls = require('./urls'),
  users = require('./users'),
  meta = require('./meta'),
  tags = require('./tags'),
  auth = require('./authentication'),
  cache = require('./cache');


router.use('/urls',urls);
router.use('/users',users);
router.use('/auth',auth);
router.use('/meta', meta);
router.use('/tags', tags);
router.use('/cache',cache);

module.exports = router