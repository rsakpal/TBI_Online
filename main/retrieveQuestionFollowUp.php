<?php

	$quesNo = $_POST['quesNo'];

	// Connect to SQL database
	$conn = mysql_connect('localhost', 'rsakpal', 'patientTBI') or die("Could not connect to database");
	mysql_select_db('Patient_TBI', $conn) or die("Could not connect to the database");

	// Query to retrieve the last row of the table 
	$query = "SELECT Question FROM FollowUpQuestion_TBL WHERE ID = '$quesNo'";
	$result = mysql_query($query) or die(mysql_error());

	// Return the array associated with the query 
	$row = mysql_fetch_assoc($result);

	echo $row["Question"];
?>