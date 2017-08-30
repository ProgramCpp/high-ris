//routes/empfeedback_routes.js

const httpStatus = require('../../../lib/httperrorcodes');

module.exports = function() {

  var mongoHandler = (err, result, resolve, reject) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      // log result
      resolve(result);
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
      console.log(req.body);
      if(req.body.hasOwnProperty('rating') && 
          req.body.rating >= 1 && 
          req.body.rating <= 10) {
          console.log(req.body.rating);
          postRatingAsync = postRating(db, req.body.rating);

        }

      if( req.body.hasOwnProperty('feedback')) {
        console.log(req.body.feedback);
        postFeedbackAsync = postFeedback(db, req.body.feedback);
      }

      // either only rating or only feedback could be recorded and the user is conveyed of any error.
      // There is no restriction on the number of feedbacks employees can give.
      // If needed, Implement transactions to commit all-or-none.
      //    record employee interaction to do away with multiple feedbacks.
      Promise.all([postRatingAsync, postFeedbackAsync]).then((result) => {
        res.status(httpStatus.e200.statuscode);
        res.send(httpStatus.e200);
      }, (err) => {
        res.status(httpStatus.e500.statuscode);
        res.send(httpStatus.e500);
      }); 

    });

  };

}();
