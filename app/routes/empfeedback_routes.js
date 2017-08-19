//routes/empfeedback_routes.js

const httpStatus = require('../http_errorcodes');

module.exports = function() {

  var mongoHandler = (err, result, resolve, reject) => {
    if (err) {
      reject();
    } else {
      // log result
      resolve();
    }
  }

  var postRating = (db, rating) => {
    var postRatingAsync = new Promise(function(resolve, reject){
      db.collection('rating').update( 
        { what_rating : rating}, 
        { $inc : { rating : 1 } },
        (err, result) => {
          mongoHandler(err, result, resolve, reject);
        }
      ); 
    });
    return postRatingAsync;
  };

  var postFeedback = (db, feedbck) => {  
    var postFeedbackAsync = new Promise(function(resolve, reject){  
      const feedback = { feedback: feedbck};    

      db.collection('feedback').insert(feedback, (err, result) => {
        mongoHandler(err, result, resolve, reject);
      });
    });
    return postFeedbackAsync;
  }

  return function (app, db)  {

    app.post('/feedback', (req, res) => {
      var postRatingAsync, postFeedbackAsync;

      if(req.body.hasOwnProperty('rating') && 
          req.body.rating >= 1 && 
          req.body.rating <= 10) {
          postRatingAsync = postRating(db, req.body.rating);

        }

      if( req.body.hasOwnProperty('feedback')) {
        postFeedbackAsync = postFeedback(db, req.body.feedback);
      }

      // either only rating or only feedback could be recorded and the user is conveyed of any error.
      // There is no restriction on the number of feedbacks employees can give.
      // If needed, Implement transactions to commit all-or-none.
      //    record employee interaction to do away with multiple feedbacks.
      Promise.all([postRatingAsync, postFeedbackAsync]).then(() => {
        res.send(httpStatus.e200);
      }, () => {
        res.send(httpStatus.e500);
      }); 

    });

  };

}();
