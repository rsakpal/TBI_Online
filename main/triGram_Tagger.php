<?php
	$inputQuery = $_POST['query'];
	
	// Include the removeStopwords.php file
	include 'removeStopwords.php';
	
	// function call to create trigrams for input string
	//fileOperation();
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
		
		// Open a file Question data file to read the contents
		$file = fopen("http://ccis004.uncc.edu/~rsakpal/Patient_TBI/main/data/QuestionLog.txt","r") or exit("Unable to open the file");
	
		// Read the file line by line
		while(!feof($file))	{
			$textLine = fgets($file);
			
			// Split the line read
			$splitText = preg_split("/\s\s+/", $textLine);
			
			// Remove stopwords
			//$questionQuery = removeStopWords($splitText[1]);
			
			// function call to create trigrams for questions string
			$questionTrigrams = createTrigrams(explode(" ",trim($splitText[1])));
			
			// compare both these trigrams to create a list of match count
			$matchCount = compareTrigrams($inputTrigrams, $questionTrigrams);
			
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
		
		// function call for trigram tagger for follow_up table
		$quesID = trigramTaggerFollowUp($maxCount, $inputTrigrams, $quesID);											
		//echo $quesID."\n";
		
		return $quesID;
	}
	
	// Function to compare the input trigrams and the questions trigrams and return the match count
	function compareTrigrams($inputTrigramLst, $quesTrigramLst)	{
		$counter = 0;										// variable to count the number of matches found
		
		// Compare each element in inputTrigramList to quesTrigramList
		for($i = 0; $i < sizeof($inputTrigramLst); $i++)	{
			for($x = 0; $x < sizeof($quesTrigramLst); $x++)	{
				if((strcasecmp($inputTrigramLst[$i][0], $quesTrigramLst[$x][0]) == 0) && (strcasecmp($inputTrigramLst[$i][1], $quesTrigramLst[$x][1]) == 0) && (strcasecmp($inputTrigramLst[$i][2], $quesTrigramLst[$x][2]) == 0))	{
				//if($inputTrigramLst[$i][0] == $quesTrigramLst[$x][0] && $inputTrigramLst[$i][1] == $quesTrigramLst[$x][1] && $inputTrigramLst[$i][2] == $quesTrigramLst[$x][2])	{
					$counter++;
				}
			}
		}
		return $counter++;
	}
	
	function fileOperation()	{
		echo "File Operation";
		
		$file = fopen("logFile.txt","a") or exit($php_errormsg);
		
		fwrite($file, "\n This is test data ");
		fclose($file);
	}
	
	// Function to search for trigrams within the followUp table
	function trigramTaggerFollowUp($maxCount, $inputTrigrams, $quesID)	{
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
				$trigramQuesArr = trigrams($trimmedQuesArr);			// function call to create trigrams
				//echo $trigramQuesArr."||";
				
				// compare both these trigrams to create a list of match count
				$matchCount = compareTrigrams($inputTrigrams, $trigramQuesArr);
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
	
	// Function to create trigrams 
	function trigrams($arrInput)	{

		for($i = 0; $i < sizeof($arrInput) - 2; $i++)	{
			$triArr[$i] = Array($arrInput[$i], $arrInput[$i+1], $arrInput[$i+2]); 
		}
		return $triArr;
	}
	
?>