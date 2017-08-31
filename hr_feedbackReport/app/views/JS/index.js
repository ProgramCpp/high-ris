
app = (function() {

	/*var rating = {
    1: 39,
    "2": 10,
    "3": 40,
    "4": 42,
    "5": 40,
    "6": 40,
    "7": 40,
    "8": 40,
    "9": 40,
    "10": 47
  };
	var feedback = ["hello","me"];*/

  var rating = {};
  var feedback = [];

	var getFeedback = function() {

		$.ajax
        ({
            type: "GET",
            url: "https://192.168.1.176:3004/feedback",
            dataType: 'json',
			      async: false,
            headers: {
               	// send bearer token
                "Authorization": "Basic " + btoa("tom" + ":" + "T|/\\/\\")
            },
			      success: function (data, textStatus, jqXHR) {
              if(jqXHR.status !== 200) {
              	   $("#status").text("Something went wrong. Try again later");
               	}
               	else {
               		$("#status").text(""); 
                  var response = JSON.parse(jqXHR.responseText);
                  rating = response.rating;
                  feedback = response.feedback;
               	}
            },
            error: function (jqXHR, exception) {
            	//jqXHR.responseText
              $("#status").text("Something went wrong. Try again later");
            }
        });
	}

	return {
		initialize: function() {

			getFeedback();

			var app = angular.module("mainApp", ['ngRoute']);

			app.config(/*['$routeProvider'],*/
          function($routeProvider) {
            $routeProvider
              .when('/home', {
                  //url: '',
                  templateUrl: 'home.html',
                  controller: 'homeCtrl'
              })
              .when('/addEmployees', {
                  templateUrl: 'addEmployees.html',
                  controller: 'addEmployeesCtrl'
              })
              .when('/viewFeedback', {
                  templateUrl: 'viewFeedback.html',
                  controller: 'viewFeedbackCtrl'
              })
              .otherwise({
                  redirectTo: '/home'
              });
        }
      );

			app.controller('homeCtrl', function($scope) {

        if(jQuery.isEmptyObject(rating))  {
          $("#status").text("Something went wrong. Try again later");
          $("#home").hide();
          return;
        }
        else {
          $("#home").show();
          $("#status").text("");   
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var myDoughnutChart = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ["one", "two", "three", "four", "five"],
            datasets: [{
                  label: "Rating dataset",
                  backgroundColor: ['rgb(242, 0, 34)', 'rgb(255,99,52)', 'rgb(254,223,69)', 'rgb(0,237,69)', 'rgb(0,200,58)'],
                  data: [rating[1],rating["2"],rating["3"],rating["4"],rating["5"]],
              }]
          },
          options: {
            maintainAspectRatio: false,
          }
        });

        
			});

			app.controller('addEmployeesCtrl', function($scope) {
        $scope.addEmployee = function () {
          $.ajax
            ({
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                url: "https://192.168.1.176:3004/emp",
                dataType: 'text',
                async: false,
                headers: {
                    "Authorization": "Basic " + btoa("tom" + ":" + "T|/\\/\\")
                },
                data: {
                    user: $scope.name,
                    password: $scope.password
                },
                success: function (data, textStatus, jqXHR) {
                    if(jqXHR.status !== 200) {
                      $("#status").text("Something went wrong. Try again later");
                    }
                    else {
                      $("#status").text("Employee added sucessfully");
                    }

                },
                error: function (jqXHR, exception) {
                  //jqXHR.responseText
                    $("#status").text("Something went wrong. Try again later");
                }
            });
        }
			});

			app.controller('viewFeedbackCtrl', function($scope) {
        $scope.feedback = feedback;
			});				
		}
	}
})();

app.initialize();

