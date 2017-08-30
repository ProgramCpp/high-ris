// routes/index.js
const loginRoutes = require('../../../lib/routes/login_routes');
const empFeedbackRoutes = require('./empfeedback_routes');

module.exports = function(app, db) {
	loginRoutes(app, db);
 	empFeedbackRoutes(app, db);
  // Other route groups could go here, in the future
};
