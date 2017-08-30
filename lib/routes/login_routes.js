//routes/login_routes.js

//const fs = require('fs');
//const path = require('path');
const httpStatus = require('../httperrorcodes');

module.exports = function() {

  return function (app, db)  {

    app.post('/login', (req, res) => {
      res.status(httpStatus.e200.statuscode);
      res.send(httpStatus.e200);
    });
    /*
    app.get('/loginform', (req, res) => {

      var data = fs.readFileSync(path.join(__dirname,'../lib/views/login.html'), 
                  {encoding: 'utf-8'});      
       res.writeHead(httpStatus.e200.statuscode, {
         "Content-Type": "text/html"
      });
      res.write(data);
      res.end();
    });*/
  };

}();
