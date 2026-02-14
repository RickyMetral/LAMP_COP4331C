<?php
    $inData = getRequestInfo();
    
    $searchResults = []; // Use an array instead of a string
    $searchCount = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        // Change "Users" to "Contacts" if that's where your data is stored!
        $stmt = $conn->prepare("SELECT FirstName, LastName, Phone, Email, UserID FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ?) AND UserID=?");
		$searchName = "%" . $inData["search"] . "%";
        $stmt->bind_param("ssi", $searchName, $searchName, $inData["userId"]);
        $stmt->execute();
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc())
        {
            $searchResults[] = [
				"FirstName" => $row["FirstName"],
				"LastName"  => $row["LastName"],
				"Phone"     => $row["Phone"],
				"Email"     => $row["Email"],
				"UserId" => $row["UserID"]
    		];
            $searchCount++;
        }

        $stmt->close();
        $conn->close();

        if( $searchCount == 0 )
        {
            returnWithError( "No Records Found" );
        }
        else
        {
            returnWithInfo( $searchResults );
        }
        

    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo json_encode($obj); // Use json_encode for safety
    }
    
    function returnWithError( $err )
    {
        $retValue = array("results" => [], "error" => $err);
        sendResultInfoAsJson( $retValue );
    }
    
    function returnWithInfo( $searchResults )
    {
        $retValue = array("results" => $searchResults, "error" => "");
        sendResultInfoAsJson( $retValue );
    }
?>