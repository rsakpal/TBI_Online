<?php
	$question = $_POST['question'];				// Variable to store the question passed from the directMatching javascript file
	$matchFound = false;						// Variable to store the status of the question match found
	$quesNo = -1;								// Variable to store the question number of the match found
	
	// Open a file Question data file to read the contents
	$file = fopen("http://ccis004.uncc.edu/~rsakpal/Patient_TBI/main/data/QuestionLog.txt","r") or exit("Unable to open the file");
	
	// Read the file line by line
	while(!feof($file) && $matchFound == false)	{
		$textLine = fgets($file);
		
		// Split the line read
		$splitText = preg_split("/\s\s+/", $textLine);
		
		// Compare the string with the question to find the match
		if(strcasecmp(trim($question),trim($splitText[1])) == 0)	{
			// Change the variable matchFound to true
			$matchFound = true;
			// Store the question number related to the match
			$quesNo = $splitText[0];
		}
	}
	
	// Close the file
	fclose($file);
	
	// Return the Question No back to the javascript file
	echo $quesNo;	
?>