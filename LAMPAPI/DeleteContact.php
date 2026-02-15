
<?php
	$inData = getRequestInfo();

	$id = $inData["ID"];//The id of the contact to change
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ? "); 
        $stmt->bind_param("ii", $id, $userId);
		if($stmt->execute()) {
			$stmt->close();
			$conn->close();
			returnWithError(""); 
		} else {
			$stmt->close();
			$conn->close();
			returnWithError("Could Not Delete Contact");
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo json_encode($obj);
	}
	
	function returnWithError( $err )
	{
		$retValue = array(
        "error" => $err,
        "fields" => "Id, userId"
		);
		sendResultInfoAsJson($retValue);
	}

	function returnWithInfo($info = "Success")
	{
		$retValue = array("error" => "");
		sendResultInfoAsJson($retValue);
	}
	
?>