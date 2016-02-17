<?php
$response = array('response' => "", 'code' => 0);

if(isset($_POST['data'])){
 $alumniArray = $_POST['data'];
 $alumniArray = unserialize(serialize($alumniArray));
//file_put_contents('new.txt', serialize($alumniArray));
}else{
	$alumniArray = file_get_contents('new.txt');
	$alumniArray = unserialize($alumniArray);
	print_r($alumniArray);

}



$servername = "localhost";
$username = "wpdeve";
$password = "qwerty123$";
$dbname = "linkedin";

$connection = new mysqli($servername, $username, $password,$dbname);
if ($connection->connect_error) {
	$response['response'] = "Connection failed: " . $conn->connect_error;
	$response['code'] = 2;
	echo json_encode($response);
    die("Connection failed: " . $conn->connect_error);
} 
//echo "Connected successfully";

for( $i = 0 ; $i < count($alumniArray) ; $i++ ){	

	$FirstName = $alumniArray[$i]['firstName'];
	$LastName = $alumniArray[$i]['lastName'];
	$LinkedinId = $alumniArray[$i]['id'];
	$LinkedinURL = substr($alumniArray[$i]['_key'],4,-1);
	$Industry = $alumniArray[$i]['industry'];
	$LocationName = $alumniArray[$i]['location']['name'];
	$LocationCode = $alumniArray[$i]['location']['country']['code'];
	$Positions = $alumniArray[0]['positions']['values'];
		
	

	$query = "INSERT INTO Alumni (FirstName,LastName,LocationCountryCode,LocationName,Industry,LinkedinId,LinkedinURL) 
             VALUES( '$FirstName','$LastName','$LocationCode', '$LocationName', '$Industry','$LinkedinId','$LinkedinURL')";

    if ($connection->query($query) === TRUE) {
    	$response['response'] = "New record created successfully";
    	for( $j = 0 ; $j < count($Positions) ; $j++ ){	
			$UserId = $LinkedinId;
			if ( $Positions[$j]['company']['id'] ){
				$CompanyId = $Positions[$j]['company']['id'];
			}
			if ( $Positions[$j]['company']['name'] ){
				$CompanyName = $Positions[$j]['company']['name'];
			}
			if ( $Positions[$j]['company']['industry'] ){
				$CompanyIndustry = $Positions[$j]['company']['industry'];
			}
			if ( $Positions[$j]['company']['type'] ){
				$CompanyType = $Positions[$j]['company']['type'];
			}
			if ( $Positions[$j]['location'] ){
				$CompanyLocation = $Positions[$j]['location']['name'];
			}
			if ( $Positions[$j]['title'] ){
				$Title = $Positions[$j]['title'];
			}
			if ( $Positions[$j]['summary'] ){
				$Summary = $Positions[$j]['summary'];
			}

			$isCurrent = $Positions[$j]['isCurrent']=="true" ? 1 : 0;
			
			if ( $Positions[$j]['startDate'] ){
				$StartDate = $Positions[$j]['startDate']['year']."-".$Positions[$j]['startDate']['month']."-"."00";
			}
			
			if ( $Positions[$j]['endDate'] ){
				$EndDate = $Positions[$j]['endDate']['year']."-".$Positions[$j]['endDate']['month']."-"."00";
			}
			$pquery = "INSERT INTO Positions (UserId,CompanyId,CompanyName,CompanyIndustry,CompanyType,CompanyLocation,isCurrent,Title,StartDate,EndDate,Summary) 
	             VALUES('$UserId','$CompanyId','$CompanyName','$CompanyIndustry','$CompanyType','$CompanyLocation','$isCurrent','$Title','$StartDate','$EndDate','$Summary')";

			if ($connection->query($pquery) === TRUE) {
	    		$response['position'.$j] = "created successfully";
			} else {
				$response['position'.$j] = "Error: " . $pquery . "<br>" . $connection->error;
			}
		}
    	$response['code'] = 1;
		echo json_encode($response);
   
	} else {
		$response['response'] = "Error: " . $query . "<br>" . $connection->error;
		$response['code'] = 3;
		echo json_encode($response);
	}
}

$connection->close();

?>