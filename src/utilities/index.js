"use strict";

const beforeEach = require('./test.beforeEach'),
  urls = require('./test.urls'),
  users = require('./test.users'),
  tokens = require('./test.tokens'),
  validator = require('./test.utils');
  
const Libraries = {
  beforeEach: beforeEach,
  urls: urls,
  users: users,
  tokens: tokens,
  validator: validator
};

module.exports = Libraries;