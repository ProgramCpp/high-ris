// routes/index.js
const empFeedbackRoutes = require('./empfeedback_routes');

module.exports = function(app, db) {
  empFeedbackRoutes(app, db);
  // Other route groups could go here, in the future
};
