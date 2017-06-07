"use strict";

const userLib = require('../libs/users'),
  authLib = require('../libs/authentication'),
  testUtils = require('./test.utils');

let TestUsers = {

  createUser: function(user){

     if(!user) {
        user = { 
          lastName: "berry",
          firstName: "dina",
          email: "user." + testUtils.uniqueString() + "@test.com",
          password: "1234"
        };
      }

      return userLib.create(user);
  },
  createAdmin: function (testAdmin){
      return userLib.create(testAdmin);
  }, 
  authenticateUser: function (email, password) {

    return authLib.authenticate(email, password);
  },
  createAuthenticatedUser(user, admin=false, modifyName=false){

     if(!user) {
        user = { 
          lastName: "berry",
          firstName: "dina",
          email: "user." + testUtils.uniqueString() + "@test.com",
          password: "1234"
        };
      }

    if(modifyName) user.email = "abc"+ user.email;

    if(admin) user.roles = ['admin','user'];

    return this.createAdmin(user).then(returnedUser => {

      // keep track of user id
      user.id = returnedUser.id;

      return authLib.authenticate(user.email, user.password);
    }).then( userWithToken => {
      return Promise.resolve(userWithToken);
    }).catch(err => {
      console.log("test.users.js, err = " + JSON.stringify(err));
      throw err;
    })
  },
  deleteAllUsers(){
    userLib.deleteAllUsersRaw();
  }
}
module.exports = TestUsers;