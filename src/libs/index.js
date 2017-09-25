"use strict";

// this library used in routes via
// req.app.locals.libraries...

const authentication = require('./authentication'),
  meta = require('./meta'),
  response = require('./response'),
  tag = require('./tags'),
  url = require('./urls'),
  token = require('./tokens'),
  git = require('./git'),
  html = require('./html'),
  user = require("./users");
  
const Libraries = {
  authentication: authentication,
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