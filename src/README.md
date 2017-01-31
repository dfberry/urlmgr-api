# url-api

# /config/env/developmment.js

```
module.exports = {
   connections: {
     mongoServer: {
        adapter: "sails-mongo",
        host: "localhost",
        port: 27017,
        database: "urlmgr"
    }
  },
  models: {
     connection: 'mongoServer'
  },
  port: 80 // http://localhost:80/ for sails app
};
```
