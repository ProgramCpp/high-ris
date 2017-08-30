{
    "routes": [
		["POST","/emp",true,"user.roles.indexOf('HR') >= 0"],
		["GET","/feedback",true,"user.roles.indexOf('HR') >= 0"]
    ]	
}
 

