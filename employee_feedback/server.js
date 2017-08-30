const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const https          = require('https');
const fs             = require('fs');
const bcrypt         = require('bcrypt');
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const httpStatus     = require('../lib/httperrorcodes');
var   cs             = require('cansecurity');
var   initcs         = require('../lib/initcansecurity');
const app            = express();

const port = 3004;

var options = {
  key: fs.readFileSync('../../Vault/key.pem'),
  cert: fs.readFileSync('../../Vault/cert.pem')
};

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, 
  {
    // Maximum time to connect : 5s * 3 + 1s * 2
        connectTimeoutMS: 5000,
        reconnectTries: 3,
        reconnectInterval: 1000 
  },
  (err, database) => {
      if (err) return console.log(err.name + ':' + err.message);
      var cansec = initcs.init(cs, database, bcrypt);
      app.use(cansec.validate);
      app.use(cansec.authorizer("./config/cansecurity_auth.js"));
      require('./app/routes')(app, database);
      app.use('/app', express.static('./app/views'))
      app.use(express.static('../lib/views'))
      app.use((req, res) => {
        res.send(httpStatus.e404);
      });
      https.createServer(options, app).listen(port, () => {
      console.log('We are live on ' + port);
  });
})