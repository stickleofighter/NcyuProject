let ctouchcheck;
let ctcrk;
let cbutton;
let cbtn;

let skips;
let startVideo;

function touchEventHandler()
{
	const MouseMoveHandler=e=>
	{
		Mpos.getMousePos(e);
		if(areaCheck(Mpos,skips,0))
		{
			 skips.draw1(cbtn,2);
			 if(skips.PlayOnce())
			 {
				skips.PlayOnce(false);
				voices[1].stop();
				voices[1].play();
			 }
		}
		else 
		{
			skips.draw1(cbtn,0);
			skips.PlayOnce(true);
		}
	};
	const MouseDownHandler=e=>
	{
		Mpos.getMousePos(e);
		if(areaCheck(Mpos,skips,0))
		{
			ctouchcheck.off("mousemove",MouseMoveHandler);
			skips.draw1(cbtn,1);
			voices[2].stop();
			voices[2].play();
		}
		else skips.draw1(cbtn,0);
	};
	const MouseUpHandler=e=>
	{
		ctouchcheck.on("mousemove",MouseMoveHandler);
		if(areaCheck(Mpos,skips,0)) skips.draw1(cbtn,0);
	};
	const MouseClickHandler=e=>
	{
		Mpos.getMousePos(e);
		if(areaCheck(Mpos,skips,0))document.location.replace("start_page.html");
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
	cbutton=$("#buttonimg");
	cbtn=cbutton[0].getContext("2d");
	loading.setContext(ctcrk);
}


function SourceOnload()
{
	loading.overloading();
	skips.draw1(cbtn,0);
	$("div").append(startVideo);
	startVideo.play();
	touchEventHandler();
}
function getData()
{
	let indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexed;
	let request;
	let db;
	let skip_btn;
	let vid_url;
	const dbget=()=>{
		loading.startloading();
		loading.message().start().next();
		return new Promise((res,rej)=>{			
			request=indexedDB.open("MonopolyLearnData",1);
			request.onsuccess=e=>{
				db=e.target.result;
				//console.log(`indexedDB資料庫MonopolyLearnData打開成功`);
				res();
			}
			request.onerror=e=>{rej(e.target.errorCode);}
		});
	};
	const dataget=()=>{
		//console.log(`開始取得資料`);
		loading.message().next();
		return new Promise((res,rej)=>{
			let transaction=db.transaction(["dataSet"],"readwrite");
			let objectStore=transaction.objectStore("dataSet");
			let req=objectStore.get("button");
			let req2=objectStore.get("video");
			req.onsuccess=e=>{
				skip_btn=e.target.result.skip;
			};
			req2.onsuccess=e=>{
				vid_url=e.target.result.url;
			};
			transaction.oncomplete=e=>{
				res();
			};
			transaction.onerror=e=>{
				rej(e.target.errorCode);
			}
		});
	};
	const videoMake=()=>{
		loading.message().next();
		//console.log(`影片載入`);
		return new Promise((res,rej)=>{
			const vid=$("<video/>")
				.attr("width","750")
				.attr("height","420")
				.attr("src",vid_url)
				.attr("id","VIDEO1")
				.addClass("cv")
				/*.on("progress",()=>{
					if(vid[0].buffered.length>0)
					{
						console.log(vid[0].buffered.end(0));
						if(Math.round(vid[0].buffered.end(0))>=11) {console.log(`緩衝達標`);res();}
						if(Math.round(vid[0].buffered.end(0)) / Math.round(vid[0].seekable.end(0)) === 1)console.log(`下載完畢`);
					}
				})*/
				.on("canplay",()=>{
					console.log(`緩衝達標`);res();
				})
				.on("ended",()=>{
					document.location.replace("start_page.html");
				});
				
				startVideo=vid[0];
		});
	};
	const ObjConstruct=()=>{
		//console.log(`物件建立...`);
		loading.message().next();
		skips=Object.freeze(new BUTTON(skip_btn[0]));
		voiceConstruct();
		SourceLoadCheck(SourceOnload);
	};
	const Error=e=>{console.log(e);};
	dbget().then(dataget).then(videoMake).then(ObjConstruct).catch(Error);
}
$(document).ready(()=>{
	canvasContext();
	getData();
});