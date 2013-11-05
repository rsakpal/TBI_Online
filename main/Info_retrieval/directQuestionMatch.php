<?php
	$question = $_POST['question'];				// Variable to store the question passed from the directMatching javascript file
	$matchFound = false;						// Variable to store the status of the question match found
	
	// make a call to retrieve the question number
	// $quesNo = fileDirectMatch($question);	
	$quesNo = SQLDirectMatch($question);	
	
	// Return the Question No back to the javascript file
	echo $quesNo;	
	
	// function to match the incoming question to questions on file 
	function fileDirectMatch($question)	{
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
		
		return $quesNo;
	}
	
	// function to match the incoming question to questions within database
	function SQLDirectMatch($question)	{
		$quesNo = -1;

		// Connect to SQL database
		$conn = mysql_connect('localhost', 'rsakpal', 'patientTBI') or die("Could not connect to database");
		mysql_select_db('Patient_TBI', $conn) or die("Could not connect to the database");

		// Query to retrieve the questions from the follow-up question table 
		$query = "SELECT ID, Question FROM Question_TBL";
		$result = mysql_query($query) or die(mysql_error());

		while ($row = mysql_fetch_array($result, MYSQL_NUM)) {
			$regexInput = regexPunctuation($row[1]);			// Remove punctuations from the string
			// Compare the strings to see if a match exists 
			if (strcasecmp(trim($question), trim($regexInput)) == 0) {
				$quesNo = $row[0];
			}
		}

		// Return the question number back to the javascript file
		return $quesNo;
	}
	
	// Function to remove punctuation marks from the the question read from the SQL file
	function regexPunctuation($input)	{
		$pattern = '/[^\w\s]|_/i';
		return preg_replace($pattern, '', $input);
	}
?>