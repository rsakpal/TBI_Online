/* Date: 8th Oct 2013
   Author: Raghavi Sakpal
   Description: Javascript file to implement n-gram (Trigram, Bigram and Unigram) tagging method
*/

var inputArr;													// variable to store the input string split into tokens

// Function to implement the n-gram taggin method
function nGram_Tagger(input)	{

	// make a call to the regex function to remove all punctuations from the sentence
	var regexInput = regexPunct(input);
	var trimmedRegexInput = $.trim(regexInput);
	
	/*$.post("Info_retrieval/removeStopwords.php", {inputQuery:trimmedRegexInput}, function(data,status)	{
		// Trim the input received from removing stopwords
		var inputData = $.trim(data);
		// Split the input into tokens
		inputArr = inputData.split(" ");
		//alert("Input Array: " + inputArr);
		// Decide which tagging method to use
		if(inputArr.length >= 3)	{
			alert("Trigram Tagger");
			trigram_Tagger(inputArr);
		}
		else if(inputArr.length == 2)	{
			//alert("Bigram Tagger");
			bigram_Tagger(inputArr);
		}
		else	{
			//alert("Unigram Tagger");
			unigram_Tagger(inputArr);
		}
		
	});*/
	inputArr = trimmedRegexInput.split(" ");
	//alert("Input Array: " + inputArr);
	// Decide which tagging method to use
	if(inputArr.length >= 3)	{
		//alert("Trigram Tagger");
		trigram_Tagger(inputArr);
	}
	else if(inputArr.length == 2)	{
		//alert("Bigram Tagger");
		bigram_Tagger(inputArr);
	}
	else	{
		alert("Try rephrasing or asking a new question. You can also click on the hint button to get a hint.");
		//alert("Unigram Tagger");
		// unigram_Tagger(inputArr);
	}
	
}

// Function to implement a regular expression to remove punctuation from a given sentence
function regexPunct(input)	{
	var re = /[^\w\s]|_/g;											// variable to store the pattern which matches the punctuation mark
	// Remove the punctuations in the given string
	var regexInput = input.replace(re, " ");
	var newRegexInput = regexInput.replace(/\s+/g, " ");
	
	return newRegexInput;
}

// Function to implement the trigram tagging method
function trigram_Tagger(inputArr)	{
	// Create trigram list for the input array
	$.post("Info_retrieval/triGram_Tagger.php", {query:inputArr}, function(data,status)	{
		//alert("Trigram Tagger: " + data);
		retrieveAnswerNGram(data,3);
	});
}

// Function to parse multiple questions and display the answer 
function retrieveAnswerNGram(quesNo, nGramType)	{
	// check if question found or not
	if (quesNo == -1)	{
		if (nGramType == 3)	{
			//alert("Question not found by Trigram Tagger.");
			// make a call to bigram tagger method
			bigram_Tagger(inputArr);
		}
		if (nGramType == 2)	{
			alert("Question not found. Try using the hint button.");
			// make a call to unigram tagger method
			//unigram_Tagger(inputArr);
		}
		if (nGramType == 1)	{
			alert("Question not found by Unigram Tagger.");
		}
	}
	else	{
		if(quesNo.match(/^[0-9]+(#)(FF)$/) != null)	{
			// split the questions 
			var quesArr = quesNo.split(/#/);
			
			$.post("SQL/retrieveAnswer.php", {quesNo:quesArr[0]}, function(data,status)	{
				window.hint = quesNo;
				if(data == "" || data == null)	{
					//alert("We have to look in the follow-up now.");
					$.post("SQL/retrieveAnswerFollowUp.php", {quesNo:quesArr[0]}, function(data,status)	{
						parseAnswer(data,quesNo);
					});
				}
				else	{
					parseAnswer(data,quesNo);
				}
			});
		}
		// Check if multiple questions available
		else if(quesNo.match(/[0-9]+(#)/) != null)	{
			// split the questions 
			var quesArr = quesNo.split(/#/);
			// make a call to retrieve each question and display them on screen
			retrieveQuesNGram(quesArr);
		}
		else	{
			$.post("SQL/retrieveAnswer.php", {quesNo:quesNo}, function(data,status)	{
				window.hint = quesNo;
				if(data == "" || data == null)	{
					//alert("We have to look in the follow-up now.");
					$.post("SQL/retrieveAnswerFollowUp.php", {quesNo:quesNo}, function(data,status)	{
						parseAnswer(data,quesNo);
					});
				}
				else	{
					parseAnswer(data,quesNo);
				}
			});
		}
	}
}

// Function to retrieve multiple qestions from the database
function retrieveQuesNGram(quesArr)	{
	// Clear contents of the response box
	document.getElementById("response").innerHTML = " ";
	// flush through each question and print out the corresponding question
	for (var i = 0; i < quesArr.length; i++)	{
		if (quesArr[i] == "FF")	{
			var followUpIndex = i;
			i = quesArr.length;
		}
		else	{
			$.post("SQL/retrieveQuestion.php", {quesNo:quesArr[i]}, function(data,status)	{
				//alert(data);
				// display the questions in the response box
				var quesHTML = document.getElementById("response").innerHTML;
				document.getElementById("response").innerHTML = quesHTML + data + "<br /><br />";				
			});
		}
	}
	
	// Retrieve the follow-up questions
	for(var index = followUpIndex + 1; index < quesArr.length; index++)	{
		$.post("SQL/retrieveQuestionFollowUp.php", {quesNo:quesArr[index]}, function(data,status)	{
				//alert(data);
				// display the questions in the response box
				var quesHTML = document.getElementById("response").innerHTML;
				document.getElementById("response").innerHTML = quesHTML + data + "<br /><br />";				
		});
	}
	alert("Choose one of the following questions to ask.");
}

// Function to implement the bigram tagging method
function bigram_Tagger(inputArr)	{
	//alert("Bigram Tagger");
	// Create trigram list for the input array
	$.post("Info_retrieval/biGram_Tagger.php", {query:inputArr}, function(data,status)	{
		//alert("Bigram Tagger: " + data);
		retrieveAnswerNGram(data,2);
	});
}

// Function to implement the unigram tagging method
function unigram_Tagger(inputArr)	{
	alert("Unigram Tagger");
	// Create trigram list for the input array
	$.post("Info_retrieval/uniGram_Tagger.php", {query:inputArr}, function(data,status)	{
		retrieveAnswerNGram(data,1);
	});
}




