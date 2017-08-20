//routes/empfeedback_routes.js

const httpStatus = require('../../../lib/http_errorcodes');

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

  var getRating = (db, rating) => {
    var getRatingAsync = new Promise(function(resolve, reject){
      db.collection('rating').find({}, {'_id': 0}  ).toArray(
        (err, result) => {
          mongoHandler(err, result, resolve, reject);
        }
      ); 
    });
    return getRatingAsync;
  };

  var getFeedback = (db, rating) => {
    var getFeedbackAsync = new Promise(function(resolve, reject){
      db.collection('feedback').find({}, {'_id': 0}  ).toArray(
        (err, result) => {
          mongoHandler(err, result, resolve, reject);
        }
      ); 
    });
    return getFeedbackAsync;
  };

  return function (app, db)  {

    app.get('/feedback', (req, res) => {
      var getRatingAsync, getFeedbackAsync;

      getRatingAsync = getRating(db, req.body.rating);
      getFeedbackAsync = getFeedback(db, req.body.feedback);

      Promise.all([getRatingAsync, getFeedbackAsync]).then((result) => {

        var ratingResponse = { rating : {}};
        result[0].forEach((item, index) => {
          ratingResponse.rating[item.what_rating] = item.rating;
        });

        var feedbackResponse = { feedback : []}; 
        result[1].forEach((item, index) => {
          feedbackResponse.feedback.push(item.feedback);
        });
        
        var response = Object.assign({}, httpStatus.e200, ratingResponse, feedbackResponse);
        res.send(response);
      }, () => {
        res.send(httpStatus.e500);
      }); 

    });

  };

}();
