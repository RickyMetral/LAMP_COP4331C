
<?php

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lasName"];
    $login = $inData["login"];
    $password = $inData["password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	//host, user, password, database
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );    //Credentials are wrong, tells the user
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");    //"?" Represent the input
		$stmt->bind_param("ssss", $firstName, $lastName, $login, $password); //ss for string string, for the upcoming two parameters
		
        
        if($stmt->execute())   //Runs query against sql table
        {
    	    returnWithError("");
		}
		else
		{
			returnWithError("Registration Failed: User might already exist");
		}
        

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
