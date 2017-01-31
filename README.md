# Url mgr api via sailsjs

## Configuration
Configuration for remote mongo db is in ./config.json

## To run on local development server or stage server with defaults
```
cd blogmgrapi && npm install
cd .. & npm start
```
## To run on stage server or stage server without defaults
```
cd blogmgrapi && npm install
cd .. & PORT=8080 NODE_ENV=development npm start
```
## To run on production server
```
cd blogmgrapi && npm install
cd .. & PORT=80 NODE_ENV=production npm start
```
### Routes
./blogmgrapi/config/routes

### REST Controller for Url
./blogmgrapi/api/controllers

### Model for Url
./blogmgrapi/api/models

### Processing for Url
./blogmgrapi/shared/

### 3rd Party Libraries
./blogmgrapi/config/bootstrap

### stage server watching
/app
/config