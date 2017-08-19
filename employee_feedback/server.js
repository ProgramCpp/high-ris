const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const db             = require('./config/db');

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(db.url, 
	{
		// Maximum time to connect : 5s * 3 + 1s * 2
        connectTimeoutMS: 5000,
        reconnectTries: 3,
        reconnectInterval: 1000 
    },
	(err, database) => {
  		if (err) return console.log(err.name + ':' + err.message)
  		require('./app/routes')(app, database);
  		app.listen(port, () => {
    	console.log('We are live on ' + port);
  });
})