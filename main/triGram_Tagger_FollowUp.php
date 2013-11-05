<?php
	$inputQuery = $_POST['query'];
	
	// make a call to create trigrams
	$inputTrigrams = createTrigrams($inputQuery);
	echo getMatchCount($inputTrigrams);
	
	// Function to create the trigrams list
	function createTrigrams($textArr)	{
		$trigramArr = Array();								// variable to hold the trigram list
		$index = 0;											// variable to hold the counter variable
	
		while ($index != sizeof($textArr) - 2)	{
			$trigramArr[$index] = Array($textArr[$index], $textArr[$index+1], $textArr[$index+2]);
			$index++;
		}		
		return $trigramArr;
	}
	
	// Function to create the trigrams for each question and get the match count
	function getMatchCount($inputTrigrams)	{
		$maxCount = 0;										// variable to store the maximum count of the number of matches found
		$quesID = 0;										// variable to store the questions numbers which 
		
		// Connect to SQL database
		$conn = mysql_connect('localhost', 'rsakpal', 'patientTBI') or die("Could not connect to database");
		mysql_select_db('Patient_TBI', $conn) or die("Could not connect to the database");
		
		// Query to retrieve the questions from the follow-up question table 
		$query = "SELECT ID, Question FROM FollowUpQuestion_TBL";
		$result = mysql_query($query) or die(mysql_error());
		//mysql_num_rows($result);
		
		// Go through each row in the table and get the results
		for($row = 0; $row < mysql_num_rows($result); $row++)	{
			mysql_data_seek($result,$row);
			$array[$row]=mysql_fetch_row($result);
			
			$regexInput = regexPunctuation($array[$row][1]);			// Remove punctuations from the string
			$trimmedQuesArr = explode(" ",trim($regexInput));			// Trim the string and split it into array tokens
			
			if (sizeof($trimmedQuesArr) >= 3)	{
				$trigramQuesArr = trigrams($trimmedQuesArr);			// function call to create trigrams
				echo $trigramQuesArr."||";
				
				// compare both these trigrams to create a list of match count
				$matchCount = compareTrigrams($inputTrigrams, $trigramQuesArr);
				echo $matchCount."\n";
			}
			
		}
			
		return "Test";
	}
	
	// Function to remove punctuation marks from the the question read from the SQL file
	function regexPunctuation($input)	{
		$pattern = '/[^\w\s]|_/i';
		return preg_replace($pattern, '', $input);
	}
	
	// Function to compare the input trigrams and the questions trigrams and return the match count
	function compareTrigrams($inputTrigramLst, $quesTrigramLst)	{
		$counter = 0;										// variable to count the number of matches found
		
		// Compare each element in inputTrigramList to quesTrigramList
		for($i = 0; $i < sizeof($inputTrigramLst); $i++)	{
			for($x = 0; $x < sizeof($quesTrigramLst); $x++)	{
				//echo $inputTrigramLst[$i][0]."/".$quesTrigramLst[$x][0]." ".$inputTrigramLst[$i][1]."/".$quesTrigramLst[$x][1]." ".$inputTrigramLst[$i][2]."/".$quesTrigramLst[$x][2]."\n";
				if((strcasecmp($inputTrigramLst[$i][0], $quesTrigramLst[$x][0]) == 0) && (strcasecmp($inputTrigramLst[$i][1], $quesTrigramLst[$x][1]) == 0) && (strcasecmp($inputTrigramLst[$i][2], $quesTrigramLst[$x][2]) == 0))	{
					$counter++;
					//echo $counter.".";
				}
			}
		}
		return $counter;
	}
	
	// Function to create trigrams 
	function trigrams($arrInput)	{

		for($i = 0; $i < sizeof($arrInput) - 2; $i++)	{
			$triArr[$i] = Array($arrInput[$i], $arrInput[$i+1], $arrInput[$i+2]); 
		}
		return $triArr;
	}
?>