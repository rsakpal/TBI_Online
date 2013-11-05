<?php

$query = $_POST['inputQuery'];

// make a call to function to remove stopwords
echo removeStopWords($query);


function removeStopWords($query)	{
	// Open the stopwords file to read the contents
	$file = fopen("http://ccis004.uncc.edu/~rsakpal/Patient_TBI/main/data/Stopwords.txt","r") or exit("Unable to open the file");
	
	// Read the file line by line
	while(!feof($file))	{
		$textLine = fgets($file);
		
		// pattern to match the stopword
		$pattern = '/^'.trim($textLine).'\s|\s'.trim($textLine).'\s|\s'.trim($textLine).'$/i';
		
		// replace the pattern
		$query = preg_replace($pattern," ",$query);
	}

	// Close the file
	fclose($file);
	return $query;
}

?>