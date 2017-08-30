app = {
	initialize: function() {
		$("#submitlogin").click( () => {
            var username = $("input#username").val();
            var password = $("input#password").val();

            $.ajax
            ({
                type: "POST",
                url: "https://192.168.1.176:3004/login",
                dataType: 'text',
                async: false,
                headers: {
                    "Authorization": "Basic " + btoa(username + ":" + password) // "tom" + ":" + "T|/\\/\\"
                },
                success: function (data, textStatus, jqXHR) {
                    if(jqXHR.status !== 200) {
                    	$("#error").text("login failed");
                    }
                    else {
                    	document.cookie = "token=" + 
                    		jqXHR.getResponseHeader("X-CS-Auth") + 
                    		";path=/;domain=.192.168.1.176:3004";
                    	window.location.href = 'https://192.168.1.176:3004/app/application.html';
                    	
                    }

                },
                error: function (jqXHR, exception) {
                	//jqXHR.responseText
                    $("#error").text("login failed");
                }
            });

        }); 
	}
};

app.initialize();