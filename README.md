DEBUG with VSCODE
node --debug=5858 node_modules/mocha/bin/_mocha src-non-sails/**/*.spec.js

DEBUG with CHROME
node --inspect=5858 src-non-sails/index.js


netstat -tulpn