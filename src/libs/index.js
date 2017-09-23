"use strict";

const authentication = require('./authentication'),
  meta = require('./meta'),
  response = require('./response'),
  tag = require('./tags'),
  url = require('./urls'),
  claims = require('./claims'),
  token = require('./tokens'),
  git = require('./git'),
  html = require('./html'),
  user = require("./users");
  
const Libraries = {
  authentication: authentication,
  claims: claims,
  git: git,
  html: html,
  meta: meta,
  response:response,
  tag: tag,
  token: token,
  url: url,
  user: user
};

module.exports = Libraries;