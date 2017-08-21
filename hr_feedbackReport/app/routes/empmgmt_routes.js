//routes/empfeedback_routes.js

const bcrypt = require('bcrypt');
const httpStatus = require('../../../lib/http_errorcodes');
const saltConfig = require('../../config/saltconfig');

module.exports = function() {

  var mongoHandler = (err, result, resolve, reject) => {
    if (err) {
      //log err
      reject(err);
    } else {
      // log result
      resolve(result);
    }
  }

  var postUser = (db, usr, hash) => {
    var postUserAsync = new Promise(function(resolve, reject){
      db.collection('users').insert(
        {
          user: usr,
          pwd: hash,
          roles: ["E"]
        },
        (err, result) => {
          mongoHandler(err, result, resolve, reject);
      });
    });
    return postUserAsync;
  };

  return function (app, db)  {

    app.post('/addemp', (req, res) => {

      if(!req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('user')) {
        res.send(httpStatus.e400);
      }
      //[TODO] check if user already present
      else {
        bcrypt.hash(req.body.password, saltConfig.SALTROUNDS, function(err, hash) {
          postUser(db, req.body.user, hash).then((result) => {
            res.send(httpStatus.e200);
          }, () => {
            res.send(httpStatus.e500);
          }); 
        });
      } 

    });

  };

}();
