# Api for Url/Knowledge Management
- Source code is in /src
- Source built with gulp and put in /dist
- Tests run against /dist - 'npm run test' or via chrome with 'npm run test:chrome'
- Start: runs against /dist without build - so last build if it exists
- Start:dev builds & runs against /dist with chrome debug - 'npm run start:dev' 

# Open ports in Docker
-netstat -tulpn

# Ignore Typescript info
In process of converting js to typescript on different branch

# Lint 
Lint is currently out of date/unused

# Install dependencies
Currently via Yarn only

# Clean
Clean removes /dist and typescript generated type files

# Config.json
The config.json file is expected to be one directory above the /dist folder - NOT in the folder. When the /dist is run, the root config.json is the file used. 

# Production
Copy /dist to production repo: cp -R /usr/src/app/urlmgr/urlmgr-compose/urlmgr-api/dist/ .

Remove spec files from production repo: find -type f -name '*.spec.js' -delete

Install production only: npm install --production 

# Test:Chrome

chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:3004/