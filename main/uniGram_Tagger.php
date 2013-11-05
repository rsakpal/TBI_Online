<?php
	$inputQuery = $_POST['query'];
	// make a call to create bigrams
	$inputUnigrams = createUnigrams($inputQuery);
	echo getMatchCount($inputUnigrams);
	
	
	// Function to create the unigrams list
	function createUnigrams($textArr)	{
		$unigramArr = Array();								// variable to hold the unigram list
		$index = 0;											// variable to hold the counter variable
	
		while ($index != sizeof($textArr))	{
			$unigramArr[$index] = Array($textArr[$index]);
			$index++;
		}		
		return $unigramArr;
	}
	
	// Function to create the unigrams for each question and get the match count
	function getMatchCount($inputUnigrams)	{
		$maxCount = 0;										// variable to store the maximum count of the number of matches found
		$quesID = 0;										// variable to store the questions numbers which 
		
		// Open a file Question data file to read the contents
		$file = fopen("http://ccis004.uncc.edu/~rsakpal/Patient_TBI/main/data/QuestionLog.txt","r") or exit("Unable to open the file");
	
		// Read the file line by line
		while(!feof($file))	{
			$textLine = fgets($file);
			
			// Split the line read
			$splitText = preg_split("/\s\s+/", $textLine);
			
			// function call to create unigrams for questions string
			$questionUnigrams = createUnigrams(explode(" ",trim($splitText[1])));
			
			// compare both these trigrams to create a list of match count
			$matchCount = compareUnigrams($inputUnigrams, $questionUnigrams);
			
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
		// Check if maxCount is 0. If so it means no question found
		if ($maxCount == 0)	{
			$quesID = -1;
		}
		
		// Close the file
		fclose($file);
				
		//return $matchCount;
		return $quesID;
	}
	
	// Function to compare the input unigrams and the questions unigrams and return the match count
	function compareUnigrams($inputUnigramLst, $quesUnigramLst)	{
		$counter = 0;										// variable to count the number of matches found
		
		// Compare each element in inputTrigramList to quesTrigramList
		for($i = 0; $i < sizeof($inputUnigramLst); $i++)	{
			for($x = 0; $x < sizeof($quesUnigramLst); $x++)	{
				if((strcasecmp($inputUnigramLst[$i][0], $quesUnigramLst[$x][0]) == 0))	{
				//if($inputTrigramLst[$i][0] == $quesTrigramLst[$x][0] && $inputTrigramLst[$i][1] == $quesTrigramLst[$x][1] && $inputTrigramLst[$i][2] == $quesTrigramLst[$x][2])	{
					$counter++;
				}
			}
		}
		return $counter++;
	}
	
	
?>