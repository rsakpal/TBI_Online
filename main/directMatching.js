/* Date: 7th Oct 2013
   Author: Raghavi Sakpal
   Description: Javascript file to implement the direct matching algorithm
*/

// Function to implement the direct matching algorithm
function directMatch(input)	{	
						
	// make a call to the regex function to remove all punctuations from the sentence
	var regexInput = regexPunct(input);
	
	// make a call to function to retrieve the question number
	phpQuesNo(regexInput);
}

// Function to implement a regular expression to remove punctuation from a given sentence
function regexPunct(input)	{
	var re = /[^\w\s]|_/g;											// variable to store the pattern which matches the punctuation mark
	// Remove the punctuations in the given string
	var regexInput = input.replace(re, " ");
	var newRegexInput = regexInput.replace(/\s+/g, " ");
	
	return newRegexInput;
}

// Function to make a POST call to php file and retrieve the questionNumber
function phpQuesNo(input)	{
	
	// Send the input to the php file to retrieve the question number based on the match found
	$.post("Info_retrieval/directQuestionMatch.php", {question:input}, function(data,status)	{
		// make a call to the function to retrieve answer based on the question number found
		retrieveAnswer(data, input);
	});	
}

// Function to retrieve an answer based on the question number found
function retrieveAnswer(quesNo, input)	{
	
	if (quesNo == -1)	{
			alert("Match not found for the input by Direct Match method.");
			// Make a call to search for question in follow-up table
			followUpDirectMatch(input);
	}
	else	{
			$.post("SQL/retrieveAnswer.php", {quesNo:quesNo}, function(data,status)	{				window.hint = quesNo;
				parseAnswer(data, quesNo);
			});
		}
}

// Function to check if the question is a follow-up question
function followUpDirectMatch(input)	{
	alert("This is the follow-up question section");
	
	// Send the input to see if question is a follow-up question
	$.post("SQL/followUpDirectMatch.php", {question:input}, function(data,status)	{
			retrieveAnswerFollowUp(data, input);
	});
	
}

// Function to retrieve an answer from follow-up table based on the question number found
function retrieveAnswerFollowUp(quesNo, input)	{
	if (quesNo == -1)	{
			alert("Match not found for the input in the follow-up table.");
			// Make a call for n-gram tagging method
			IR_nGram();
	}
	else	{
			$.post("SQL/retrieveAnswerFollowUp.php", {quesNo:quesNo}, function(data,status)	{	
				parseAnswerFollowUp(data, quesNo);
			});
		}
}

// Function to parse an answer if multiple answer are available for the same question
function parseAnswer(answer, quesNo)	{
	
	// Retrieve the emotion based on the question number
	$.post("SQL/retrieveEmotion.php", {quesNo:quesNo}, function(data,status)	{	
		window.hint = quesNo;
		agentEmotions(data);	
		
		// If multiple answers available split it up and select a random answer
		if (answer.match(/(Ans)[1-9]+(:)/) != null)	{
			var ansReplace = answer.replace(/(Ans)[1-9]+(:)/g,"ANSWER");
			var ansSplit = ansReplace.split(/ANSWER/);
			var length = ansSplit.length - 1;
			var ansNo = Math.floor((Math.random() * length) + 1);
			agentTalk(ansSplit[ansNo]);	
			document.getElementById("response").innerHTML = ansSplit[ansNo];
		}
		else	{	
		// Select the answer based on the quesNo
			agentTalk(answer);	
			document.getElementById("response").innerHTML = answer;
		}	
	});	
}

// Function to parse an answer from the follow-up table. If multiple answer are available for the same question
function parseAnswerFollowUp(answer, quesNo)	{
	
	// Retrieve the emotion based on the question number
	$.post("SQL/retrieveEmotionFollowUp.php", {quesNo:quesNo}, function(data,status)	{
		window.hint = quesNo;
		agentEmotions(data);	
		
		// If multiple answers available split it up and select a random answer
		if (answer.match(/(Ans)[1-9]+(:)/) != null)	{
			var ansReplace = answer.replace(/(Ans)[1-9]+(:)/g,"ANSWER");
			var ansSplit = ansReplace.split(/ANSWER/);
			var length = ansSplit.length - 1;
			var ansNo = Math.floor((Math.random() * length) + 1);
			agentTalk(ansSplit[ansNo]);	
			document.getElementById("response").innerHTML = ansSplit[ansNo];
		}
		else	{	
		// Select the answer based on the quesNo
			agentTalk(answer);	
			document.getElementById("response").innerHTML = answer;
		}	
	});	
}
