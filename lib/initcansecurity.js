const sessionvault	= require('../../Vault/sso_session');
const httpStatus 	= require('../lib/http_errorcodes');

module.exports = function() {
	var database;
	var bcrypt; 

	var mongoHandler = (err, result, resolve, reject) => {
    	if (err) {
      	//log err
      	reject(err);
    	} else {
      	// log result
      	resolve(result);
    	}
  	}

  	var getUser = (usr) => {
    	var getUserAsync = new Promise(function(resolve, reject){
      		database.collection('users').findOne({ user: usr}, {'_id': 0}, 
        		(err, result) => {
          			mongoHandler(err, result, resolve, reject);
        		}
      		); 
    	});
    	return getUserAsync;
  	};

	return {
		init : function(cs, db, bc) {
			database = db;
			bcrypt = bc;

			var cansec = cs.init({
				validate: function(login,password,callback){
					getUser(login).then((result) => {
						if (null === result) {
							// no such user - ERROR
							callback(false,null,httpStatus.e403);
						}
          				else if (password === undefined) {
							// User could have a token, just send the user - GOOD
	    					callback(true,
	    							{
	    								id: login,
	    								roles: result.roles
	    							},
	    							login);
						} else if (!bcrypt.compareSync(password,result.pwd)) {
							// checked password, but it didn't match - ERROR
							callback(false,null,httpStatus.e403);
						} else {
							// user matches, password matches - GOOD
							callback(true,
									{
										id: login,
										roles: result.roles
									},
									login);
						}
        			}, (err) => {
        				console.log(err);
						callback(false,null,httpStatus.e500);
        			});				
				},

				sessionKey: sessionvault.SESSIONKEY
			});

			return cansec;
		}
	}
}();
