/* 
	Name: Raghavi Sakpal
	Date: October 21st, 2013
	Description: Javascript file to manage the speech recognition
*/ 

function recognized()	{
	alert("Speech Recognized");
	var pRecog=document.getElementById("listen");
	var pNode = pRecog.recoresult.selectSingleNode("//hex");
	alert("New result is: " + pNode.text);
	// make a call for agent to listen 
	agentListenGesture();
}
						
function notrecognized()	{
	alert("Speech Not-recognized");
}
						
function silence()	{
	alert("Why so silent");
}