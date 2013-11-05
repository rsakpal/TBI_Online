/* 
	Name: Raghavi Sakpal
	Date: October 15th, 2013
	Description: Javascript file to load agents functions like moods, gestures while talking, gestures while listening and gestures while emoting moods
*/ 
  
// -------------------------- ARRAY VARIABLES ---------------------- // 

// Array to hold the moods the agents go through
var moods = ["Hap_Angry.hap", "Hap_Broken_Hearted.hap", "Hap_Bully.hap", "Hap_Calm.hap", "Hap_Mellow.hap", "Hap_Neutral.hap", "Hap_Pondering_Mysteries.hap", "Hap_Sad.hap", "Hap_Shy.hap", "Hap_Skeptic.hap"];
var sad = ["Hap_Broken_Hearted.hap","Hap_Sad.hap"];
var calm = ["Hap_Calm.hap", "Hap_Mellow.hap", "Hap_Neutral.hap"];
var anxious = ["Hap_Skeptic.hap", "Hap_Fear.hap"];
var mixed = ["Hap_Sad.hap", "Hap_Calm.hap", "Hap_Mellow.hap", "Hap_Skeptic.hap"];
var relief = ["Hap_Calm.hap", "Hap_Happy.hap", "Hap_Mellow.hap"];
var confused = ["Hap_Skeptic.hap", "Hap_Pondering_Mysteries.hap"];
var irritated = ["Hap_Angry.hap", "Hap_Bully.hap"];

// Array to hold gestures when talking
var talkingGest = ["talkGestL1", "talkGestL2", "talkGestL3", "talkGestR1", "talkGestR2", "GestureMaster", "talkGestR3"];
var talkingGestState = ["start", "start", "start", "start", "start", "start", "start"];

// Array to hold gestures when listening
var listeningGest = ["headWander", "talkBob", "noddy", "smirkish", "headnod", "headshake", "headshakeLong", "yackLean", "hand_thru_hair", "arms_crossed", "considering"];
var listeningGestState = ["whenTalking", "on", "a", "a", "nodDown", "lookleft", "lookleft", "leanFor", "a1", "start", "start"];

// Angry, Bully
var aggression = ["grr", "shake_fist", "hands_on_hips", "pound_fist", "arms_crossed"];
var aggressionState = ["a", "a", "start", "a", "start"];

// Broken Hearted, Sad
var sadness = ["hand_thru_hair", "shrug_sad", "arms_cross_sad", "hide_face_sad", "big_sigh_sad", "weep_sad", "wipe_tear"];
var sadnessState = ["a1", "start", "start", "start", "start", "start", "start"];

// Calm, Mellow, Neutral
var neutral = ["yawn", "hands_on_hips", "inspect_nails"];
var neutralState = ["a", "start", "start"];

// Pondering Mysteries, Skeptic
var skeptic = ["smirkish", "hands_on_hips", "hand_thru_hair", "arms_crossed", "inspect_nail"];
var skepticState = ["a", "start", "a1", "start", "start"];

// ----------------------------- FUNCTIONS ------------------------------ //

// Function to do the introduction
function introAgent()	{
	// make the agent do the introduction
	agentTalk("Hello, my name is Kevin. And I am your patient today.");
	// make a random talking gesture
	agentTalkGesture();
}

// Function to make the agent talk
function agentTalk(msg)	{
	// Set the voice
	SendText('\\sapittsload[i0= 3]');
	// Set the message to be used
	var sentence = "\\q2[s0=["+msg+"]]";
	SendText(sentence);
}

// Function to animate agents to perform random gestures when they are talking
function agentTalkGesture()	{
	// Generate a random number based on number of gestures in the gesture array
	var rand = Math.floor((Math.random()*talkingGest.length));
	var randomGesture = "\\setswitch [switch="+talkingGest[rand]+" state="+talkingGestState[rand]+"]";
	SendText(randomGesture);
	//alert("New Gesture: " + randomGesture);
}

// Function to animate agents to perform random gestures when they are listening
function agentListenGesture()	{
	alert("I am listening");
	// Generate a random number based on number of gestures in the gesture array
	var rand = Math.floor((Math.random()*listeningGest.length));
	var randomGesture = "\\setswitch [switch="+listeningGest[rand]+" state="+listeningGestState[rand]+"]";
	SendText(randomGesture);
}

// Function to change the emotions of the agent
function agentEmotions(emotion)	{
	var moodSelected;						// Variable to store the selected mood *.hap file
	
	if($.trim(emotion) == "sad")	{
		// select a random sad mood to apply 
		var randomMood = Math.floor((Math.random()*sad.length));
		var sadMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+sad[randomMood]+"]]";
		moodSelected = sad[randomMood];
		SendText(sadMood);
		//alert("emotion is:" + emotion + "\n String is: " + sadMood);
	}
	else if($.trim(emotion) == "calm")	{
		// select a random calm mood mood to apply 
		var randomMood = Math.floor((Math.random()*calm.length));
		var calmMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+calm[randomMood]+"]]";
		moodSelected = calm[randomMood];
		SendText(calmMood);
		//alert("emotion is:" + emotion + "\n String is: " + calmMood);
	}
	else if($.trim(emotion) == "anxious")	{
		// select a random anxious mood to apply 
		var randomMood = Math.floor((Math.random()*anxious.length));
		var anxiousMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+anxious[randomMood]+"]]";
		moodSelected = anxious[randomMood];
		SendText(anxiousMood);
		//alert("emotion is:" + emotion + "\n String is: " + anxiousMood);
	}
	else if($.trim(emotion) == "mixed")	{
		// select a random mixed mood to apply 
		var randomMood = Math.floor((Math.random()*mixed.length));
		var mixedMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+mixed[randomMood]+"]]";
		moodSelected = mixed[randomMood];
		SendText(mixedMood);
		//alert("emotion is:" + emotion + "\n String is: " + mixedMood);
	}
	else if($.trim(emotion) == "curious")	{
		var curiousMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\Hap_Pondering_Mysteries.hap]]";
		moodSelected = "Hap_Pondering_Mysteries.hap";
		SendText(curiousMood);
		//alert("emotion is:" + emotion + "\n String is: " + curiousMood);
	}
	else if($.trim(emotion) == "some sense of relief" || $.trim(emotion) == "sense of relief")	{
		// select a random relief mood to apply 
		var randomMood = Math.floor((Math.random()*relief.length));
		var reliefMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+relief[randomMood]+"]]";
		moodSelected = relief[randomMood];
		SendText(reliefMood);
		//alert("emotion is:" + emotion + "\n String is: " + reliefMood);
	}
	else if($.trim(emotion) == "somewhat confused")	{
		// select a random confused mood to apply 
		var randomMood = Math.floor((Math.random()*confused.length));
		var confusedMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+confused[randomMood]+"]]";
		moodSelected = confused[randomMood];
		SendText(confusedMood);
		//alert("emotion is:" + emotion + "\n String is: " + confusedMood);
	}
	else if($.trim(emotion) == "some what irritated")	{
		// select a random irritated mood to apply 
		var randomMood = Math.floor((Math.random()*irritated.length));
		var irritatedMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\"+irritated[randomMood]+"]]";
		moodSelected = irritated[randomMood];
		SendText(irritatedMood);
		//alert("emotion is:" + emotion + "\n String is: " + irritatedMood);
	}
	else	{
		var neutralMood = "\\load [file= [http:\\\\ccis004.uncc.edu\\~rsakpal\\Patient_TBI\\main\\haptek\\Hap_Neutral.hap]]";
		moodSelected = "Hap_Neutral.hap";
		SendText(neutralMood);
		//alert("Emotion is: " + emotion + "\n String is: " + neutralMood);
	}
	
	// make a call to animate function to generate appropriate gestures based on the mood selected
	agentAnimateEmotions(moodSelected);
}

// Function to animate the agents based on their moods/emotions
function agentAnimateEmotions(moodSelected)	{
	var randGest = Math.floor((Math.random()*2));
	//alert("Random Gesture Number: " + randGest);
	if (randGest == 0)	{
		//alert("This is going to random talk gesture");
		// choose a random talk gesture to do
		agentTalkGesture();
	}
	else	{
		//alert("You are here to determine the correct mood:" + moodSelected);
		if (moodSelected == "Hap_Angry.hap" || moodSelected == "Hap_Bully.hap")	{
			// Generate a random number based on number of gestures in the gesture array
			var rand = Math.floor((Math.random()*aggression.length));
			var randomGesture = "\\setswitch [switch=" & aggression[rand] & " state=" & aggressionState[rand] & "]";
			SendText(randomGesture);
		}
		else if (moodSelected == "Hap_Broken_Hearted.hap" || moodSelected == "Hap_Sad.hap")	{
			// Generate a random number based on number of gestures in the gesture array
			var rand = Math.floor((Math.random()*sadness.length));
			var randomGesture = "\\setswitch [switch=" & sadness[rand] & " state=" & sadnessState[rand] & "]";
			SendText(randomGesture);
		}
		else if (moodSelected == "Hap_Calm.hap" || moodSelected == "Hap_Mellow.hap" || moodSelected == "Hap_Neutral.hap")	{
			// Generate a random number based on number of gestures in the gesture array
			var rand = Math.floor((Math.random()*neutral.length));
			var randomGesture = "\\setswitch [switch=" & neutral[rand] & " state=" & neutralState[rand] & "]";
			SendText(randomGesture);
		}
		else if (moodSelected == "Hap_Pondering_Mysteries.hap" || moodSelected == "Hap_Skeptic.hap")	{
			// Generate a random number based on number of gestures in the gesture array
			var rand = Math.floor((Math.random()*skeptic.length));
			var randomGesture = "\\setswitch [switch=" & skeptic[rand] & " state=" & skepticState[rand] & "]";
			SendText(randomGesture);
		}
		else	{
			// Select random talking gesture 
			agentTalkGesture();
		}
	}

}