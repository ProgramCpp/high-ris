

app = (function() {

	var lrating = 0;

	return {
		initialize: function() {
			$(".radiobtn").click(function() {
				lrating = parseInt($(this).attr('data-rating'));
  				$(".cornerimage").width(lrating * 20 + "%");
			});

			$("#submitfeedback").click( () => {
				if(lrating == 0) {
					$("#status").text("Rate your day!");
					return
				}
				$.ajax
            ({
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                url: "https://192.168.1.176:3004/feedback",
                dataType: 'json',
                async: false,
                headers: {
                	// send bearer token
                    "Authorization": "Basic " + btoa("jim" + ":" + "0|\\|")
                },
                data: {
                	rating: lrating,
                	feedback: $('textarea#feedbackText').val()
                },
                success: function (data, textStatus, jqXHR) {
                    if(jqXHR.status !== 200) {
                    	$("#status").text("Submission failed. Try again later");
                    }
                    else {
                    	$("#status").text("Your feedback is submitted sucessfully.");                    	
                    }

                },
                error: function (jqXHR, exception) {
                	//jqXHR.responseText
                    $("#status").text("Submission failed. Try again later");
                }
            });


			});
		}
	}
})();

app.initialize();