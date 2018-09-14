let ctouchcheck;
let ctcrk;
let cbackground;
let cbg;
let cbutton;
let cbtn;

let bg;
let checks=new Array();
let checkBoxs=new Array();
let backs;
let volControl;

let lastMpos;

function touchEventHandler()
{
	let Mpos;
	const MouseMoveHandler=e=>
	{
		Mpos=new getMousePos(e);
		if(areaCheck(Mpos,backs,0))
		{
			 backs.draw2(cbtn,2);
			 if(backs.PlayOnce())
			 {
				backs.PlayOnce(false);
				voices[1].stop();
				voices[1].play();
			 }
		}
		else 
		{
			backs.draw1(cbtn,0);
			backs.PlayOnce(true);
		}
	};
	const MouseDownHandler=e=>
	{
		Mpos=new getMousePos(e);
		if(areaCheck(Mpos,backs,0))
		{
			ctouchcheck.off("mousemove",MouseMoveHandler);
			backs.draw2(cbtn,1);
			voices[2].stop();
			voices[2].play();
		}
		else backs.draw1(cbtn,0);
		if(areaCheck(Mpos,checkBoxs[0]))
		{
			if(checks[0].isClick())
			{
				checks[0].isClick(false);
				checks[0].clear(cbtn);
			}
			else 
			{
				checks[0].isClick(true);
				checks[0].draw1(cbtn,0);
				
			}
			bgm.muteswitch();
			voices[1].play();
		}
		if(areaCheck(Mpos,checkBoxs[1]))
		{
			if(checks[1].isClick())
			{
				checks[1].isClick(false);
				checks[1].clear(cbtn);
			}
			else 
			{
				checks[1].isClick(true);
				checks[1].draw1(cbtn,0);
			}
			voices.forEach(v=>{
				v.muteswitch();
			});
			voices[1].play();
		}
	};
	const MouseUpHandler=e=>
	{
		ctouchcheck.on("mousemove",MouseMoveHandler);
		if(areaCheck(Mpos,backs,0)) backs.draw1(cbtn,0);
	};
	const MouseClickHandler=e=>
	{
		Mpos=new getMousePos(e);
		if(areaCheck(Mpos,backs,0))document.location.replace("start_page.html");
	};
	const MouseOutHandler=MouseUpHandler;
	ctouchcheck.on("mousemove",MouseMoveHandler);
	ctouchcheck.on("mousedown",MouseDownHandler);
	ctouchcheck.on("mouseup",MouseUpHandler);
	ctouchcheck.on("click",MouseClickHandler);
	ctouchcheck.on("mouseout",MouseOutHandler);
}

function canvasContext()
{
	ctouchcheck=$("#touchfeel");
	ctcrk=ctouchcheck[0].getContext("2d");
	cbackground=$("#backgroundimg");
	cbg=cbackground[0].getContext("2d");
	cbutton=$("#buttonimg");
	cbtn=cbutton[0].getContext("2d");
	loading.setContext(ctcrk);
}
function getData()
{
	let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexed;
	let request;
	let db;
	let bg_img;
	let check_img=new Array();
	let checkBox_box=new Array();
	let back_img;
	let volControl_img;
	const dbget=()=>{
		loading.startloading();
		loading.message().start().next();
		return new Promise((res,rej)=>{			
			request=indexedDB.open("MonopolyLearnData",1);
			request.onsuccess=e=>{
				db=e.target.result;
				console.log(`indexedDB資料庫MonopolyLearnData打開成功`);
				res();
			}
			request.onerror=e=>{rej(e.target.errorCode);}
		});
	};
	const dataget=()=>{
		console.log(`開始取得資料`);
		loading.message().next();
		return new Promise((res,rej)=>{
			let transaction=db.transaction(["dataSet"],"readwrite");
			let objectStore=transaction.objectStore("dataSet");
			let req1=objectStore.get("bg");
			let req2=objectStore.get("button");
			let req3=objectStore.get("noimgbox");
			req1.onsuccess=e=>{
				bg_img=e.target.result.set;
			};
			req2.onsuccess=e=>{
				back_img=e.target.result.teamset[0];
				volControl_img=e.target.result.teamset[1];
				check_img=e.target.result.teamset.slice(2,4);
			};
			req3.onsuccess=e=>{
				checkBox_box=e.target.result.set;
			}
			transaction.oncomplete=e=>{
				res();
			};
			transaction.onerror=e=>{
				rej(e.target.errorCode);
			}
		});
	};
	const ObjConstruct=()=>{
		console.log('物件...')
		loading.message().next().next();
		bg=Object.freeze(new BG(bg_img));
		backs=Object.freeze(new BUTTON(back_img));
		volControl=Object.freeze(new BUTTON(volControl_img));
		check_img.forEach(v=>{
			checks.push(Object.freeze(new BUTTON(v)));
		});
		
		checkBox_box.forEach(v=>{
			checkBoxs.push(Object.freeze(new NOIMGBOX(v)));
		});

		voiceConstruct();
		SourceLoadCheck(SourceOnload);
	};
	const Error=e=>{console.log(e);};
	dbget().then(dataget).then(ObjConstruct).catch(Error);
}

function SourceOnload()
{
	loading.overloading();
	bg.draw(cbg);
	if(bgm.muted()) checks[0].isClick(false);
	else checks[0].draw1(cbtn,0);
	if(voices[0].muted()) checks[1].isClick(false);
	else checks[1].draw1(cbtn,0);
	volControl.draw1(cbtn,0);
	backs.draw1(cbtn,0);
	
	touchEventHandler();
}

$(document).ready(()=>{
	canvasContext();
	getData();
});