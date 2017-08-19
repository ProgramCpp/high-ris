const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const https          = require('https');
const fs             = require('fs');
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const app            = express();

const port = 443;

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
  		require('./app/routes')(app, database);
  		https.createServer(options, app).listen(port, () => {
    	console.log('We are live on ' + port);
  });
})