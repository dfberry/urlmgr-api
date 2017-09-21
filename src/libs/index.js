'use strict';

const args = require("./args")
/*,
  authentication = require('./authentication'),
  authorization = require('./authorization'),
  cache = require('./cache'),
  claims = require('./claims'),
  git = require('./git'),
  html = require('./html'),
  meta = require('./meta'),
  response = require('./response'),
  tags = require('./tags'),
  tokens = require('./tokens'),
  urls = require('./urls'),
  users = require('./users')*/;


module.exports = function (config) {
  var module = {};

  module.args= args(config); 
  /*
  module.authentication = authentication;
  module.authorization = authorization;
  module.cache = cache;
  module.claims = claims;
  module.git = git;
  module.html = html;
  module.meta = meta;
  module.response = response;
  module.tags = tags;
  module.tokens = tokens;
  module.urls = urls;
  module.users = users;
*/
  return module;
};