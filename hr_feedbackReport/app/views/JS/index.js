

app = (function() {


	return {
		initialize: function() {
			var ctx = document.getElementById('myChart').getContext('2d');
			var myDoughnutChart = new Chart(ctx, {
    			type: 'doughnut',
    			data: {
    				labels: ["one", "two", "three", "four", "five"],
   					datasets: [{
            			label: "Rating dataset",
            			backgroundColor: ['rgb(242, 0, 34)', 'rgb(255,99,52)', 'rgb(254,223,69)', 'rgb(0,237,69)', 'rgb(0,200,58)'],
            			data: [10, 10, 5, 2, 20],
        			}]
    			},
    			options: {
    				maintainAspectRatio: false,
    			}
			});	
		}
	}
})();

app.initialize();