
<?php
	$inData = getRequestInfo();
	
    $id = $inData["ID"];//The id of the contact to change
	$userId = $inData["userId"];

	$firstName = $inData["firstName"];
    $lastName = $inData["lastName"]
	$phone= $inData["phone"];
	$email = $inData["email"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ? AND UserID = ?");
        $stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $id, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
		$retValue = '{"error":"' . $err . '"
                     "fields": "ID, UserId, firstName, lastName, phone, email"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>