// Haptek Javascript Scripter Helper
// Needs to be in the same document as the HapPlayer.js
// erin pearce & orion elenzil 200203
//
//The HapToDoList.js is not a list of improvements for the Haptek crew to work on,
// rather it is a utility javascript file which you can use to create a Timing Script
// all within javascript.  The basic idea is that you can put an item into the ToDoList,
// and assign it some moment in the future to occur at.
// For example, HapToDo_Add_HT(4.5, "\\Rotate [y= 90]") will cause the \Rotate command to be
// sent to the player 4.5 seconds from the time the HapToDo_Add_HT command is issued.
//
//Setup:
//
//   * First, include HapToDoList.js in your HTML source like this:
//    <SCRIPT SRC="js/HapToDoList.js"></SCRIPT>
//   * Add HapToDo_Pulse() to the InitQueue.
//
//Functions to Call:
//
//   * HapToDo_Add_JS(dtime, cmd)
//     Call this to add an actual line of JavaScript code to be evaluated at some point in the future. This is the most flexible form of the command, because it can execute any javascript function, not just ones which control the Haptek Player.
//   * HapToDo_Add_HT(dtime, cmd)
//     Call this to send a command to the Player. A 'command' can be any HyperText command, or it can be text for the TTS engine.
//   * HapToDo_Add_Load(dtime, file)
//     This is a very simple but convenient form, it sends the \Load HyperText command to the player with the given file.
//   * HapToDo_Clear()
//     This empties the To-Do list.



var	HapToDo_CurTime	=	0;				// Seconds.
var 	HapToDo_PulseRate	=	0.2;			// how often the ToDo list gets checked. seconds.
var	HapToDo_List		=	new Array();	// Array of things to do, and when to do them.

// Removes the Nth item from the array.
function HapArrayRemove(array, n)
	{
	var i;

	for (i = n; i < array.length - 1; i++)
		array[i] = array[i + 1];

	array.length--;
	}


// Run thru the todo list,
// and do any commands that it's time to do!
function HapToDo_CheckList()
	{
	var i;
	var j;
	var	y;

	for (i = 0; i < HapToDo_List.length; i++)
		{
		y	=	HapToDo_List[i];
		if (y.time <= HapToDo_CurTime)
			{
			eval(y.cmd);
			HapArrayRemove(HapToDo_List, i);
			i--;
			}
		}
	}

// Incriment the time and call Checklist.
function HapToDo_Pulse()
	{
	HapToDo_CheckList();
	HapToDo_CurTime += HapToDo_PulseRate;

	// Sanity check on CurTime getting too huge.
	if (HapToDo_CurTime > 1000000)
		{
		for (i = 0; i < HapToDo_List.length; i++)
			{
			HapToDo_List[i].time -= 1000000;
			}
		HapToDo_CurTime	-=	1000000;
		}

	// See ya real soon!
	setTimeout("HapToDo_Pulse();", HapToDo_PulseRate * 1000);
	}


function	HapToDo_Backslashify(s)
	{
	// Regular Expression to globaly match '\'
	var re = /\\/gi;

	// Replace / with //
	rtn = s.replace(re, '\\\\');

	return rtn;
	}

// Add a javascript command to the todo list at dtime seconds from now.
function HapToDo_Add_JS(dtime, cmd)
	{
	var x	=	new Object();

	HapToDo_List[HapToDo_List.length] = x;

	x.time	= HapToDo_CurTime + dtime;
	x.cmd	= cmd;
	x.done	= false;
	}

// Add a HT command to the todo list.
function HapToDo_Add_HT(dtime, cmd)
	{
	HapToDo_Add_JS(dtime, "SendText('"+HapToDo_Backslashify(cmd)+"');");
	}

// Add a file load command to the ToDo List.
function HapToDo_Add_Load(dtime, cmd)
	{
	HapToDo_Add_HT(dtime, "\\load [file= ["+cmd+"]]");
	}

// Guess what this does
function HapToDo_Clear()
	{
	HapToDo_List.length = 0;
	}



