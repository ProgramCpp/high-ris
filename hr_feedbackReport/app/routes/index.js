// routes/index.js

const hrFeedbackReportRoutes = require('./hrfeedbackreport_routes');
const empMgmtRoutes = require('./empmgmt_routes');

module.exports = function(app, db) {
  hrFeedbackReportRoutes(app, db);
  empMgmtRoutes(app, db);
  // Other route groups could go here, in the future
};
