<?php
	$inputQuery = $_POST['query'];
	// make a call to create bigrams
	$inputBigrams = createBigrams($inputQuery);
	echo getMatchCount($inputBigrams);
	
	
	// Function to create the bigrams list
	function createBigrams($textArr)	{
		$bigramArr = Array();								// variable to hold the bigram list
		$index = 0;											// variable to hold the counter variable
	
		while ($index != sizeof($textArr) - 1)	{
			$bigramArr[$index] = Array($textArr[$index], $textArr[$index+1]);
			$index++;
		}		
		return $bigramArr;
	}
	
	// Function to create the bigrams for each question and get the match count
	function getMatchCount($inputBigrams)	{
		$maxCount = 0;										// variable to store the maximum count of the number of matches found
		$quesID = 0;										// variable to store the questions numbers which 
		
		// Open a file Question data file to read the contents
		$file = fopen("http://ccis004.uncc.edu/~rsakpal/Patient_TBI/main/data/QuestionLog.txt","r") or exit("Unable to open the file");
	
		// Read the file line by line
		while(!feof($file))	{
			$textLine = fgets($file);
			
			// Split the line read
			$splitText = preg_split("/\s\s+/", $textLine);
			
			// function call to create bigrams for questions string
			$questionBigrams = createBigrams(explode(" ",trim($splitText[1])));
			
			// compare both these bigrams to create a list of match count
			$matchCount = compareBigrams($inputBigrams, $questionBigrams);
			
			// if the matchcount is greater than max count then store it
			if ($matchCount >= $maxCount)	{
				if ($matchCount == $maxCount )	{
					$quesID = $quesID."#".$splitText[0];
				}
				else	{
					$quesID = $splitText[0];
					$maxCount = $matchCount;
				}
			}
		}
		// Close the file
		fclose($file);
		
		// function call for bigram tagger for follow_up table
		$quesID = bigramTaggerFollowUp($maxCount, $inputBigrams, $quesID);											
		//echo $quesID."\n";
				
		//return $matchCount;
		return $quesID;
	}
	
	// Function to compare the input bigrams and the questions bigrams and return the match count
	function compareBigrams($inputBigramLst, $quesBigramLst)	{
		$counter = 0;										// variable to count the number of matches found
		
		// Compare each element in inputBigramList to quesBigramList
		for($i = 0; $i < sizeof($inputBigramLst); $i++)	{
			for($x = 0; $x < sizeof($quesBigramLst); $x++)	{
				if((strcasecmp($inputBigramLst[$i][0], $quesBigramLst[$x][0]) == 0) && (strcasecmp($inputBigramLst[$i][1], $quesBigramLst[$x][1]) == 0))	{
				//if($inputTrigramLst[$i][0] == $quesTrigramLst[$x][0] && $inputTrigramLst[$i][1] == $quesTrigramLst[$x][1] && $inputTrigramLst[$i][2] == $quesTrigramLst[$x][2])	{
					$counter++;
				}
			}
		}
		return $counter++;
	}
	
	// Function to search for bigrams within the followUp table
	function bigramTaggerFollowUp($maxCount, $inputBigrams, $quesID)	{
		$quesID = $quesID."#"."FF";
		
		// Connect to SQL database
		$conn = mysql_connect('localhost', 'rsakpal', 'patientTBI') or die("Could not connect to database");
		mysql_select_db('Patient_TBI', $conn) or die("Could not connect to the database");
		
		// Query to retrieve the questions from the follow-up question table 
		$query = "SELECT ID, Question FROM FollowUpQuestion_TBL";
		$result = mysql_query($query) or die(mysql_error());
		
		// Go through each row in the table and get the results
		for($row = 0; $row < mysql_num_rows($result); $row++)	{
			mysql_data_seek($result,$row);
			$array[$row]=mysql_fetch_row($result);
			
			$regexInput = regexPunctuation($array[$row][1]);			// Remove punctuations from the string
			$trimmedQuesArr = explode(" ",trim($regexInput));			// Trim the string and split it into array tokens
			
			if (sizeof($trimmedQuesArr) >= 3)	{
				$bigramQuesArr = bigrams($trimmedQuesArr);			// function call to create bigrams
				//echo $trigramQuesArr."||";
				
				// compare both these bigrams to create a list of match count
				$matchCount = compareBigrams($inputBigrams, $bigramQuesArr);
				//echo $matchCount."\n";
				
				// if the matchcount is greater than max count then store it
				if ($matchCount >= $maxCount)	{
					if ($matchCount == $maxCount )	{
						$quesID = $quesID."#".$array[$row][0];
					}
					else	{
						$quesID = $array[$row][0];
						$maxCount = $matchCount;
					}
				}
			}
			
		}
		
		// Check if maxCount is 0. If so it means no question found
		if ($maxCount == 0)	{
			$quesID = -1;
		}
		
		return $quesID;
	}
	
	// Function to remove punctuation marks from the the question read from the SQL file
	function regexPunctuation($input)	{
		$pattern = '/[^\w\s]|_/i';
		return preg_replace($pattern, '', $input);
	}
	
	// Function to create bigrams 
	function bigrams($arrInput)	{

		for($i = 0; $i < sizeof($arrInput) - 1; $i++)	{
			$biArr[$i] = Array($arrInput[$i], $arrInput[$i+1]); 
		}
		return $biArr;
	}
	
	
?>