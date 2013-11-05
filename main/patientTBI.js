/*
	Author: Raghavi Sakpal
	Date: 10/08/2013
	Description: Main javascript file
*/

var query; 								// Variable to store the current query user entered

// function to logout of the system
function logout()	{
	window.location.href = "logout.html";
}

// function for applying the Information Retrieval Algorithm
function informationRetrieval()	{
	query = document.getElementById("query").value;

	if(query == "" || $.trim(query) == "Type your query/questions here")	{
		alert("You can't keep it empty. You need to enter a new query. ");
	}
	else	{
		// Make a call to the direct matching algorithm
		directMatch(query);
	}
}

// function for making a call to the nGram Tagger algorithm
function IR_nGram()	{
	//alert("Let's try to find the question using n-Gram Tagging Algorithm");
	nGram_Tagger(query);
}

// function to show question hint to the user
function questionHint()	{	
	
	if(window.hint == -1)	{
		$.post("SQL/retrieveQuestionHint.php", {quesNo:window.hint}, function(data,status)	{
			alert("This is your first question: " + data);
		});
	}	
	else	{
		//alert("Hint: Current question is: " + window.hint);
		if(window.hint.match(/^[0-9]+(#)(FF)$/) != null)	{
			// split the questions 
			var quesArr = window.hint.split(/#/);
			// Retrieve the next question
			$.post("SQL/retrieveQuestionHint.php", {quesNo:quesArr[0]}, function(data,status)	{
				if (data == 0)	{
					alert("This was your last question. You can exit now.");
				}
				else	{
					alert("This is your next question: " + data);
				}
			});
		}
		else	{
			// Retrieve the next question
			$.post("SQL/retrieveQuestionHint.php", {quesNo:window.hint}, function(data,status)	{
				if (data == 0)	{
					alert("This was your last question. You can exit now.");
				}
				else	{
					alert("This is your next question: " + data);
				}
			});
		}
	}
}


