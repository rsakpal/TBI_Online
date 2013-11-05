// HapPlayer411.js - player version 4.11.10
// 200206 - dsd / oxe

///////////// CHANGE BROWSER MINIMUM //////////////////


// HAPTEK GLOBALS
var	G_HapDetection				=	new Object();
	G_HapDetection.browser			=	"unknown";
	G_HapDetection.browser_okay		=	false;
	G_HapDetection.platform_okay		=	false;
var	G_HapPluginData				=	new Object();
	G_HapPluginData.plugin			=	"";
	G_HapPluginData.Filename		=	"NPHAPPLUGIN411.DLL";
	G_HapPluginData.AXCTRL			=	"ACTIVEHAPTEKX.ActiveHaptekXCtrl.1";
	G_HapPluginData.CLSID			=	"C6DC0AE5-A7BE-11D2-BDF1-0090271F4931";
	G_HapPluginData.mimetype		=	"application/x-haptekobject";
	G_HapPluginData.plugin_okay		=	false;
	G_HapPluginData.plugin_version_okay	=	false;

var	G_HapErrorHandlerOrig			=	null;
var	G_HapStartupInterval			=	null;
var	G_HapStartupState			=	1;
var	G_HapStartupCounter			=	1;
var	G_HapStartupTemp			=	0;
var	G_HapInitQueue				=	new Array();
var	G_HapPluginCurrent			=	-1;
var	G_HapVFBoxes				=	new Array();

var	G_PageRoot				=	JustPath(document.location.toString());
var	G_GrpNum				=	1;
var	G_GrpMax				=	10000;

var	G_PluginMin				=	"4.11.10"
var	G_PluginMax				=	"4.13.00"

var	G_HapStandardScene			=	"data\\\\standard\\\\standardScene.hap";
var	G_HapStandardPose			=	"data\\\\standard\\\\standardPose.hap";

var	G_Hap_ProdName				=	"The Haptek Player";
var	G_Hap_Errored				=	false;
var	G_Hap_bad_browser			=	G_Hap_ProdName + " is only availible on Netscape 4.03+, Internet Explorer 5.0+ and Mozilla 1.0+";
var	G_Hap_bad_platform			=	G_Hap_ProdName + " is currently only supported on the Microsoft Windows platform.";
var	G_Hap_no_plugin				=	"You do not have " + G_Hap_ProdName + " installed, please download it by clicking the button.";
var	G_Hap_upgrade_message			=	"Your version of " + G_Hap_ProdName + "\nis not compatable with this page.\nIf you wish to upgrade, please click OK.\nOtherwise click on cancel.";
var	G_Hap_download_message			=	"You currently do not have a version of " + G_Hap_ProdName + " which\n   supports this page. Would you like to download one?";

var	G_HapNotPreQuery			=	false;
var	G_HapPluginToOld			=	null;

var	G_DocumentDone				=	false;
var	G_HapUdef;

var	G_HapPluginVersionToDownload		=	"latest";

var	G_HapDebugger				=	false;

////////////////////////////

// CONVENIENCE

function HapIsDefined(symbol)
{
	if (typeof(symbol) != "undefined")
		return true;
	else
		return false;
}

function GetGrp()
{
	G_GrpNum++;
	if (G_GrpNum > G_GrpMax)
		G_GrpNum        =       1;
	return G_GrpNum;
}

function JustPath(s)
{
	delimit = "/";
	sa      = s.split(delimit);
	var rtn     = "";
	for (i = 0; i < sa.length - 1; i++)
		rtn = rtn + sa[i] + delimit;
	return rtn;
}

function JustFile(s)
{
	var rtn;
	delimit = "/";
	sa      = s.split(delimit);
	if (sa.length > 0)
		rtn     = sa[sa.length - 1];
	else
		rtn     = s;
	return rtn;
}

function JustFileBS(s)
{
	var rtn;
	delimit = "\\";
	sa = s.split(delimit);
	if (sa.length > 0)
		rtn = sa[sa.length - 1];
	else
		rtn = s;
	return rtn;
}

function MakeDLURL(DLFN, code)
{
	if	(code == "A"	)
		DLURL	=	""		+ DLFN;
	else if	(code == "R"	)
		DLURL	=	G_PageRoot	+ DLFN;
	else if	(code == "DB1"	)
		DLURL	=	G_DB1		+ DLFN;
	else
		DLURL	=	G_PageRoot	+ DLFN;

	return DLURL;
}

function ErrorHandler1(msg, url, line)
{
	if (msg == "Automation server can't create object")
	{
		document.write("<script>if(G_HapDetection.browser=='ie')window.onerror=G_HapErrorHandlerOrig;<\/script>");
		return true;
	} else if (msg == "Object doesn't support this property or method") {
		window.onerror=G_HapErrorHandlerOrig;
		HapErrorDefault(false);
		return true;
	} else
		return false;
}

// THE BASICS
function SendText(text, box)
{
	SendTextNoEcho(text, box);

	if(G_HapDebugger)
		SendDebug(text);
}

function SendTextNoEcho(text, box)
{
	// check if optional parameter was passed
	if(!HapIsDefined(box))
		boxofchoice = G_HapPluginCurrent;
	else
		boxofchoice = box;

	if(!G_HapPluginData.plugin_okay)
		return;

	var currentBox = eval("document."+G_HapVFBoxes[boxofchoice - 1].name);
	currentBox.HyperText(text);
}

function HapQueryNoEcho(text, box)
{
	var rtn;

	// check if optional parameter was passed
	if (!HapIsDefined(box))
		boxofchoice = G_HapPluginCurrent;
	else 
		boxofchoice = box;

	rtn = "";

	
	if (!G_HapPluginData.plugin_okay)
		return rtn;

	if (!G_HapVFBoxes[boxofchoice - 1].name)
		return rtn;

	var shortText = text.substr(0, 1400);

	var currentBox = eval("document." + G_HapVFBoxes[boxofchoice - 1].name);
	
	G_HapErrorHandlerOrig	=	window.onerror;
	window.onerror		=	ErrorHandler1;
	
	currentBox.Query(shortText);
	
	rtn = currentBox.QueryReturn();

	return rtn;
}

function HapQuery(text, box)
{
	var rtn;

	rtn = HapQueryNoEcho(text, box);

	if(G_HapDebugger)
		SendDebug("A: " + rtn + "\nQ: " + text);

	return rtn;
}

function VFBoxSelect(box)
{
	G_HapPluginCurrent = box;
}

function VFBox(x, y, commandfile)
{
	var box;

	G_DocumentDone								= false;

	box			=	new	Object();
	box.name	= "vfbox" + (G_HapVFBoxes.length+1);
	box.path	= 'document';
	G_HapVFBoxes[G_HapVFBoxes.length]		= box;

	if (G_HapPluginData.plugin_okay)
	{
		if(G_HapDetection.browser == "ie")
		{
			document.write("<OBJECT NAME=\"" + box.name + "\"\
				type=\"application/x-oleobject\" width=\""+x+"\" height=\""+y+"\" classid=\"clsid:"+G_HapPluginData.CLSID+"\">\
				<param NAME=\"clsid\" value=\"{"+G_HapPluginData.CLSID+"}\">\
	     			</OBJECT>");
		} else {
			document.write("<OBJECT NAME=\""+box.name+"\"\
				type=\"application/x-haptekobject\" width=\""+x+"\" height=\""+y+"\" >\
				<param NAME=\"clsid\" value=\"{"+G_HapPluginData.CLSID+"}\">\
				</OBJECT>");
		}
	}

	VFBoxSelect(G_HapVFBoxes.length);

	if(commandfile != "none")
		{
		AddToInitQueue("VFBoxSelect(" + (G_HapVFBoxes.length) + ");");
		AddToInitQueue("SendText('\\\\load [file= "+G_HapStandardScene+"]');");
		AddToInitQueue("SendText('\\\\load [file= "+G_HapStandardPose+"]');");
		AddToInitQueue("WaitForFigures(1);");
		}

	AddToInitQueue("SendText('\\\\stop');");

	HapErrorDefault(true);
	G_DocumentDone	= true;
}

function AddToInitQueue(input)
{
	G_HapInitQueue[G_HapInitQueue.length] = input;
}

var G_HAPoldOnload = window.onload;	// Record old onload
window.onload = HAP_loadHandler;	// set new onload

function HAP_loadHandler()
{
	setTimeout("G_HapStartupInterval=setInterval('StartupStateMachinePulse();', 200);", 500);
	if(G_HAPoldOnload) G_HAPoldOnload();
}

// Downloader Object
function Downloader()
{
	this.cache_check	= true;

	this.filelist		= new Array();
	this.codelist		= new Array();

	this.finished		= "";

	this.SetCacheCheck	= Downloader_SetCacheCheck;
	this.AddFile		= Downloader_AddFile;
	this.FinishedString	= Downloader_FinishedString;
	this.DoIt		= Downloader_DoIt;
}

function Downloader_SetCacheCheck(boolean_var)
{
	// not cache check will most likely not work when duplicate files
	// are used in the same Downloader.
	this.cache_check = boolean_var;
}

function Downloader_AddFile(name, code)
{
	this.filelist[this.filelist.length] = name;
	this.codelist[this.codelist.length] = code;
}

function Downloader_FinishedString(vf3_hypertext)
{
	this.finished = vf3_hypertext;
}

function Downloader_DoIt()
{
	var total_size	= this.filelist.length;
	var group_id	= GetGrp();
	var tmp_here	= "";
	var i;

	SendText("\\setgrouphypertext [action= ["+this.finished+"] i0= "+group_id+"]");

	for(i=0; i<total_size; i++)
	{
		tmp_fn		= JustFile(this.filelist[i]);
		tmp_DLURL	= MakeDLURL(this.filelist[i], this.codelist[i]);

		if(this.cache_check)
			tmp_here = HapQuery("status file "+tmp_fn);

		if(tmp_here == "")
			SendText("\\setcachedownload[file= ["+tmp_DLURL+"] i0= "+group_id+"]");
	}

	SendText("\\startcachedownload[i0= "+group_id+"]");
}

function UseFile(DLFN, code, action)
{
	if(typeof(code) != "undefined")
	{
		if(code == "SA")
		{
			UseFile(DLFN);
		} else if (code == "SR") {
			UseFile(MakeDLURL(DLFN, "R"));
		} else {
			var dl = new Downloader();

			dl.AddFile(DLFN, code);

			if(typeof(action) != "undefined")
					dl.FinishedString (action);
			else
				dl.FinishedString ("\\load [file= ["+JustFile(DLFN)+"]]");
				
			dl.DoIt();
		}
        }
        else
        {
                SendText("\\load [file= ["+DLFN+"]]");
        }
}


////////////////////////////////////////////////////////////////////
// PLATFORM / BROWSER DETECTION

// BEG us.js
/*
ua.js revision 0.200 2001-12-03

Contributor(s): Bob Clary, Netscape Communications, Copyright 2001

Netscape grants you a royalty free license to use, modify and
distribute this software provided that this copyright notice
appears on all copies.  This software is provided "AS IS,"
without a warranty of any kind.
*/

function xbDetectBrowser()
{
  var oldOnError = window.onerror;
  var element = null;

  window.onerror = null;

  // work around bug in xpcdom Mozilla 0.9.1
  window.saveNavigator = window.navigator;

  navigator.OS    = '';
  navigator.version  = parseFloat(navigator.appVersion);
  navigator.org    = '';
  navigator.family  = '';

  var platform;
  if (typeof(window.navigator.platform) != 'undefined')
  {
    platform = window.navigator.platform.toLowerCase();
    if (platform.indexOf('win') != -1)
      navigator.OS = 'win';
    else if (platform.indexOf('mac') != -1)
      navigator.OS = 'mac';
    else if (platform.indexOf('unix') != -1 || platform.indexOf('linux') != -1 || platform.indexOf('sun') != -1)
      navigator.OS = 'nix';
  }

  var i = 0;
  var ua = window.navigator.userAgent.toLowerCase();

  if (ua.indexOf('opera') != -1)
  {
    i = ua.indexOf('opera');
    navigator.family  = 'opera';
    navigator.org    = 'opera';
    navigator.version  = parseFloat('0' + ua.substr(i+6), 10);
  }
  else if ((i = ua.indexOf('msie')) != -1)
  {
    navigator.org    = 'microsoft';
    navigator.version  = parseFloat('0' + ua.substr(i+5), 10);

    if (navigator.version < 4)
      navigator.family = 'ie3';
    else
      navigator.family = 'ie4'
  }
  else if (ua.indexOf('gecko') != -1)
  {
    navigator.family = 'gecko';
    var rvStart = navigator.userAgent.indexOf('rv:') + 3;
    var rvEnd = navigator.userAgent.indexOf(')', rvStart);
    var rv = navigator.userAgent.substring(rvStart, rvEnd);
    var decIndex = rv.indexOf('.');
    if (decIndex != -1)
    {
      rv = rv.replace(/\./g, '')
      rv = rv.substring(0, decIndex-1) + '.' + rv.substr(decIndex)
    }
    navigator.version = parseFloat(rv);

    if (ua.indexOf('netscape') != -1)
      navigator.org = 'netscape';
    else if (ua.indexOf('compuserve') != -1)
      navigator.org = 'compuserve';
    else
      navigator.org = 'mozilla';
  }
  else if ((ua.indexOf('mozilla') !=-1) && (ua.indexOf('spoofer')==-1) && (ua.indexOf('compatible') == -1) && (ua.indexOf('opera')==-1)&& (ua.indexOf('webtv')==-1) && (ua.indexOf('hotjava')==-1))
  {
    var is_major = parseFloat(navigator.appVersion);

    if (is_major < 4)
      navigator.version = is_major;
    else
    {
      i = ua.lastIndexOf('/')
      navigator.version = parseFloat('0' + ua.substr(i+1), 10);
    }
    navigator.org = 'netscape';
    navigator.family = 'nn' + parseInt(navigator.appVersion);
  }
  window.onerror = oldOnError;
}
xbDetectBrowser();
// END us.js

// detect if we are on windows
if(navigator.OS == "win")
	G_HapDetection.platform_okay = true


switch(navigator.family)
{
	case 'gecko':
		G_HapDetection.browser			= "moz";
		G_HapDetection.browser_okay		= true;
		break;
	case 'ie4':
		if (!(navigator.version < 5))
		{
			G_HapDetection.browser		= "ie";
			G_HapDetection.browser_okay	= true;
		}
		break;
	case 'nn4':
		G_HapDetection.browser			= "nn4";
		G_HapDetection.browser_okay		= true;		
		break;
}

/////////////////////////////////////
// Functions below are generaly not
// of any use to a web designer

function StartupStateMachinePulse()
{
	switch(G_HapStartupState)
	{
		case 1:
			if(!G_HapVFBoxes)
				return;
			if(!HapIsDefined(G_HapVFBoxes[0]))
				return;

			G_HapStartupTemp++;


			if( (G_HapNotPreQuery == true) || (G_HapDetection.browser == "ie") || (G_HapDetection.browser == "moz") || (G_HapDetection.browser == "nn4"))
				var vers = HapQuery("release");
			else
				var vers = 0.1;

			if(vers == "")
				return;
			if(vers == "release")
				vers = 0.1;
			if(G_HapStartupTemp == 500)
				vers = 0.1;
			if(vers != "haptek api not ready" && vers != "" && vers != "NULL Scene")
				{
				if( (vers+" " >= G_PluginMin+" ") && (vers+" " <= G_PluginMax+" ") )
					{
					G_HapStartupState						=	2;
					G_HapPluginData.plugin_version			=	vers;
					G_HapPluginData.plugin_version_okay		=	true;
					}
				else
					{
					if(G_HapPluginData.plugin_version_okay != true)
						{
						G_HapStartupState					=	1000;
						G_HapPluginData.plugin_version		=	vers;
						G_HapPluginData.plugin_version_okay	=	false;
						}
					}
				HapErrorDefault(false);
				}
			break;
		case 2:
			if(G_HapInitQueue.length > 0)
				{
				eval(G_HapInitQueue[0]);
				G_HapInitQueue = G_HapInitQueue.slice(1);
				}
			else
				G_HapStartupState = 1000;
			break;
		case -1:
			if(HapQueryNoEcho('current numfigures')+" " > 0+" ")
				{
				G_HapStartupState = 2;
				}
			break;
		case 1000:
			if(G_HapPluginData.plugin_version_okay == false)
				{
				if(G_HapPluginToOld	!= null)
					G_HapPluginToOld();
				}
			clearInterval(G_HapStartupInterval);
			G_HapStartupState = 1001;
			break;
		case 1001:
			break;
		}
	}

function WaitForFigures(number)
	{
	if(G_HapStartupState == 2)
		G_HapStartupState = -1;
	else
		alert("ERROR: WaitForFigures Not Called in Init Queue");
	}

function HapErrorDefault(dw_okay)
{
	if(G_Hap_Errored)
		return;

	if(dw_okay)
	{
		if(!G_HapDetection.browser_okay)
		{
			document.write(G_Hap_bad_browser);
			G_Hap_Errored = true;
		}
		else if(!G_HapDetection.platform_okay)
		{
			document.write(G_Hap_bad_platform);
			G_Hap_Errored = true;
		}
		else if(!G_HapPluginData.plugin_okay)
		{
			//alert(G_HapPluginData.plugin_okay);
			G_Hap_Errored = true;
			document.write("<center>");
			HapDrawButton(G_HapPluginVersionToDownload);
			document.write("<br>"+G_Hap_no_plugin+"<br></center>");
			download = confirm(G_Hap_download_message);
			if(download)
				HapDownloadVF3('latest');
		}
	}
	else
	{
		if(!G_HapPluginData.plugin_version_okay)
		{
			G_Hap_Errored = true;
			upgrade = confirm(G_Hap_upgrade_message);
			if(upgrade)
				HapDownloadVF3('latest');
		}
	}
}


// AUTO DOWNLOAD TOOLS

var VF3AutoInstallDIRURL	= "http://vf3.haptek.com/autoinstall";
var HapDownloadWindow;

// set up alert

function HapDrawButton(type)
{
	document.write("<a href=\"javascript:HapDownloadVF3('"+type+"');\"><img src=\""+VF3AutoInstallDIRURL+"/images/logo.gif\" border=\"0\"></a>");
}

function HapDownloadVF3(type)
{
	if (!HapIsDefined(type))
		type = "latest";
	top.document.location = "http://www.haptek.com/products/player/autoinstall";
	//var HapDownloadWindow = window.open(VF3AutoInstallDIRURL+"/?version="+type, "vf3autoinstall", "height=320,width=500,scrollbars=no,toolbar=no,directories=no");
}


//////////////////
// extras


function UseBackground(DLFN, code)
{
        if(code)
        {
        	UseFile(DLFN, code, "\\loadbackgrnd [file= ["+JustFile(DLFN)+"]]");
        }
        else
        {
        	SendText("\\loadbackgrnd [file= ["+DLFN+"]]");
        }
}

function UseTexture(DLFN, code)
{
        if(code)
        {
        	UseFile(DLFN, code, "\\settexture [tex= ["+JustFile(DLFN)+"]]");
        }
        else
        {
        	SendText("\\settexture [tex= ["+DLFN+"]]");
        }
}

function UseMorph(morph, DLFN, code)
	{
	if(typeof(DLFN) != "undefined")
		{
		if(typeof(code) != "undefined")
			{
			UseFile(DLFN, code, "\\load [file= ["+JustFile(DLFN)+"] i0= 2] \\LoadMorph [name= "+morph+" switch= morphs i1= 1]");
			}
		else
			{
			SendText("\\load [file= ["+DLFN+"] i0= 2] \\LoadMorph [name= "+morph+" switch= morphs i1= 1]");
			}
		}
	else
		{
		SendText("\\setmorph [state= "+morph+"]");
		}
	}
	
function GrabFile(DLFN, code)
{
	UseFile(DLFN, code, " ");
}


////////////////////////////////////////////////////////////////////
// PLUGIN DETECTION

if(G_HapDetection.platform_okay && G_HapDetection.browser_okay)
{
	if(G_HapDetection.browser == "nn4" || G_HapDetection.browser == "moz")
	{	
		for(i=0; i<navigator.plugins.length; i++)
		{
			if(JustFileBS(navigator.plugins[i].filename).toUpperCase() == G_HapPluginData.Filename)
			{
				G_HapPluginData.plugin		=	JustFileBS(navigator.plugins[i].filename);
				G_HapPluginData.plugin_okay	=	true;
			}
		}
	}
	else if(G_HapDetection.browser == "ie")
	{
		G_HapErrorHandlerOrig	=	window.onerror;
		window.onerror		=	ErrorHandler1;

		var MyObject		=	new ActiveXObject(G_HapPluginData.AXCTRL);

		if (MyObject)
		{
			G_HapPluginData.plugin		=	G_HapPluginData.AXCTRL;
			G_HapPluginData.plugin_okay	=	true;
			delete MyObject;
		}
	}
} // ADD NO CODE BELOW THIS POINT! IT IS NOT GAUREUNTEED TO EXECUTE