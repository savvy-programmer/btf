import {Slot} from './Slot.js';

let p2t1=document.getElementById('p2t1');
let p2t2=document.getElementById('p2t2');
let p2p1=document.getElementById('p2p1');
let p3t1=document.getElementById('p3t1');
let p3p1=document.getElementById('p3p1');
let p3p1p1=document.getElementById('p3p1p1');
let p4p1p1tf1=document.getElementById('p4p1p1tf1');
let p4p1p2tf1=document.getElementById('p4p1p2tf1');
let p4p1p3s1=document.getElementById('p4p1p3s1');
let p4p1p4s1=document.getElementById('p4p1p4s1');
let p4p1p5s1=document.getElementById('p4p1p5s1');
let p4p1p6s1=document.getElementById('p4p1p6s1');
let p4p1p7tf1=document.getElementById('p4p1p7tf1');
let p4p1p7tf2=document.getElementById('p4p1p7tf2');
let p4p1p8tf1=document.getElementById('p4p1p8tf1');
let p4p1p8tf2=document.getElementById('p4p1p8tf2');
let p4p1p9tf1=document.getElementById('p4p1p9tf1');
let p4p1p9tf2=document.getElementById('p4p1p9tf2');
let p4p1p10tf1=document.getElementById('p4p1p10tf1');
let p4p1p10tf2=document.getElementById('p4p1p10tf2');
let p4p1p11im1=document.getElementById('p4p1p11im1');
let p4p1p11im2=document.getElementById('p4p1p11im2');
let p5bt1=document.getElementById('p5bt1');
let p5bt2=document.getElementById('p5bt2');
let p5bt3=document.getElementById('p5bt3');
let p5bt4=document.getElementById('p5bt4');
let p5bt5=document.getElementById('p5bt5');
let imdd=document.getElementById('imdd');
let cd=document.getElementById('cd');
let cdim1=document.getElementById('cdim1');
let cdta1=document.getElementById('cdta1');
let cdbt1=document.getElementById('cdbt1');

let pool;
let poolSlots=[];
let nPoolMon=0;
let nPoolMag=0;
let nPoolTrap=0;

let deck=[];
let deckSlots=[];
let mapCardToFreq=new Map();
let mapPassToCard=new Map();
let nDeckMon=0;
let nDeckMag=0;
let nDeckTrap=0;
let deckTier=0;

let flagDragging=false;
let ux;
let uy;
let imddCard;

let types=['','monster','magic','trap'];
let monSubTypes=['','normal','effect','ritual'];
let magSubTypes=['','normal','continuous','equip','quick-play','field','ritual'];
let trapSubTypes=['','normal','continuous','counter'];
let races=['','aqua','beast','beast-warrior','dragon','dinosaur','fairy','fiend','fish','insect','machine','plant','pyro','reptile','rock','sea-serpent','spellcaster','thunder','warrior','winged-beast','zombie'];
let attribs=['','dark','earth','fire','light','water','wind'];

let flagSortPoolByTier=false;

init();

function init(){
	let req=new XMLHttpRequest();
	
	req.open('get','files/data/data.json',true);
	
	req.onload=function(){
		pool=JSON.parse(req.responseText);

		for(let c of pool){
			mapCardToFreq.set(c,0);
			mapPassToCard.set(c.passcode,c);
		}

		createDeckSlots();
		createPoolSlots();
		implementDragAndDrop();
		implementFilter();
		implementButtons();
		implementCardDisplay();

		sortPool();
		applyFilter();
	}

	req.send();
}

function createDeckSlots(){
	let wPerc=10;
	let hView=17.875;

	for(let i=0;i<40;i++){
		let indexRow=parseInt(i/10);
		let indexCol=parseInt(i%10);

		let slot=new Slot(wPerc,hView);
		slot.setX(indexCol*wPerc);
		slot.setY(indexRow*hView);

		p2p1.appendChild(slot.div);

		//slot.setCard(pool[randomInt(0,pool.length-1)]);

		deckSlots.push(slot);
	}
}

function createPoolSlots(){
	let nRow=parseInt(pool.length/3)+(parseInt(pool.length%3)==0?0:1);

	let wPerc=32.1;
	let hView=17.875;
	
	p3p1p1.style.height=(nRow*hView)+'vh';

	for(let i=0;i<pool.length;i++){
		let indexRow=parseInt(i/3);
		let indexCol=parseInt(i%3);

		let slot=new Slot(wPerc,hView);
		slot.setX(indexCol*wPerc);
		slot.setY(indexRow*hView);

		p3p1p1.appendChild(slot.div);

		//slot.setCard(pool[i]);

		poolSlots.push(slot);
	}

	p3p1.scrollTop=0;
}

function randomInt(a,b){
	return Math.floor(Math.random()*(b-a+1))+a;
}

function implementDragAndDrop(){
	for(let i=0;i<poolSlots.length;i++){
		poolSlots[i].setOnMouseDown(ev=>{
			ev.preventDefault();

			if(ev.button!==0){
				return;
			}

			let x=poolSlots[i].getBoundingClientRect().left;
			let y=poolSlots[i].getBoundingClientRect().top;
			let w=poolSlots[i].getBoundingClientRect().width;
			let h=poolSlots[i].getBoundingClientRect().height;

			ux=ev.offsetX;
			uy=ev.offsetY+h*.1;

			imdd.style.left=(x+.02*w)+'px';
			imdd.style.top=(y+h*.02-h*.1)+'px';

			imddCard=poolSlots[i].card;
			imdd.src='files/pics_mod/'+imddCard.passcode+'.jpg';
			imdd.hidden=false;

			flagDragging=true;
			document.body.style.cursor='grabbing';
		});
	}

	for(let i=0;i<deckSlots.length;i++){
		deckSlots[i].setOnMouseDown(ev=>{
			ev.preventDefault();

			if(ev.button!==0){
				return;
			}

			let x_=deckSlots[i].getBoundingClientRect().left;
			let y_=deckSlots[i].getBoundingClientRect().top;

			let w_=poolSlots[i].getBoundingClientRect().width;
			let h_=deckSlots[i].getBoundingClientRect().height;

			ux=ev.offsetX;
			uy=ev.offsetY+h_*.1;

			imdd.style.left=(x_+.02*w_)+'px';
			imdd.style.top=(y_+h_*.02-h_*.1)+'px';

			imddCard=deckSlots[i].card;
			imdd.src='files/pics_mod/'+imddCard.passcode+'.jpg';
			imdd.hidden=false;

			flagDragging=true;
			document.body.style.cursor='grabbing';

			let xc1=p2p1.getBoundingClientRect().left;
			let yc1=p2p1.getBoundingClientRect().top;
			
			let w=p2p1.getBoundingClientRect().width;
			let h=p2p1.getBoundingClientRect().height;

			let x=ev.clientX;
			let y=ev.clientY;

			let indexCol=parseInt((x-xc1)/(w/10));
			let indexRow=parseInt((y-yc1)/(h/4));

			let index=indexRow*10+indexCol;

			removeFromDeck(index);
		});
	}

	document.addEventListener('mousemove',ev=>{
		if(!flagDragging){
			return;
		}

		let x=ev.clientX-ux;
		let y=ev.clientY-uy;

		imdd.style.left=x+'px';
		imdd.style.top=y+'px';
	});

	document.addEventListener('mouseup',ev=>{
		if(ev.button!=0){
			return;
		}

		if(imdd.hidden){
			return;
		}

		let xc1=p2p1.getBoundingClientRect().left;
		let yc1=p2p1.getBoundingClientRect().top;
		
		let w=p2p1.getBoundingClientRect().width;
		let h=p2p1.getBoundingClientRect().height;

		let xc2=xc1+w;
		let yc2=yc1+h;

		let x=ev.clientX;
		let y=ev.clientY;

		if(x>xc1 && x<xc2 && y>yc1 && y<yc2){
			let indexCol=parseInt((x-xc1)/(w/10));
			let indexRow=parseInt((y-yc1)/(h/4));

			let index=indexRow*10+indexCol;

			if(index>deck.length){
				index=deck.length;
			}

			addToDeck(index,imddCard);
		}

		flagDragging=false;
		document.body.style.cursor='default';
		imdd.hidden=true;
	});
}

function addToDeck(index,c){
	if(deck.length==40){
		return;
	}

	if(mapCardToFreq.get(c)>0){
		return;
	}

	for(let i=deck.length-1;i>=index;i--){
		deckSlots[i+1].setCard(deckSlots[i].card);
		deck[i+1]=deck[i];
	}

	deckSlots[index].setCard(c);

	deck[index]=c;

	mapCardToFreq.set(c,1);

	if(c.type=='monster'){
		nDeckMon++;
	}else if(c.type=='magic'){
		nDeckMag++;
	}else if(c.type=='trap'){
		nDeckTrap++;
	}

	deckTier+=c.tier;

	p2t1.innerHTML='Deck: '+deck.length+' ('+nDeckMon+'/'+nDeckMag+'/'+nDeckTrap+')';
	p2t2.innerHTML='Tier: '+formatNumber(deckTier);
}

function removeFromDeck(index){
	let c=deck[index];

	for(let i=index;i<=deck.length-2;i++){
		deckSlots[i].setCard(deckSlots[i+1].card);
		deck[i]=deck[i+1];
	}

	deckSlots[deck.length-1].clear();

	deck.splice(deck.length-1,1);

	mapCardToFreq.set(c,0);

	if(c.type=='monster'){
		nDeckMon--;
	}else if(c.type=='magic'){
		nDeckMag--;
	}else if(c.type=='trap'){
		nDeckTrap--;
	}

	deckTier-=c.tier;

	p2t1.innerHTML='Deck: '+deck.length+' ('+nDeckMon+'/'+nDeckMag+'/'+nDeckTrap+')';
	p2t2.innerHTML='Tier: '+formatNumber(deckTier);
}

function implementFilter(){
	for(let i=0;i<types.length;i++){
		let opt=document.createElement('option');
		opt.innerHTML=types[i];
		p4p1p3s1.appendChild(opt);
	}

	p4p1p3s1.addEventListener('change',ev=>{	
		p4p1p4s1.replaceChildren();

		p4p1p4s1.value='';
		p4p1p5s1.value='';
		p4p1p6s1.value='';
		p4p1p7tf1.value='';
		p4p1p7tf2.value='';
		p4p1p8tf1.value='';
		p4p1p8tf2.value='';
		p4p1p9tf1.value='';
		p4p1p9tf2.value='';

		if(p4p1p3s1.value=='monster'){
			for(let i=0;i<monSubTypes.length;i++){
				let opt=document.createElement('option');
				opt.innerHTML=monSubTypes[i];
				p4p1p4s1.appendChild(opt);
			}

			p4p1p5s1.disabled=false;
			p4p1p6s1.disabled=false;
			p4p1p7tf1.disabled=false;
			p4p1p7tf2.disabled=false;
			p4p1p8tf1.disabled=false;
			p4p1p8tf2.disabled=false;
			p4p1p9tf1.disabled=false;
			p4p1p9tf2.disabled=false;
		}else if(p4p1p3s1.value=='' || p4p1p3s1.value=='magic' || p4p1p3s1.value=='trap'){
			if(p4p1p3s1.value=='magic'){
				for(let i=0;i<magSubTypes.length;i++){
					let opt=document.createElement('option');
					opt.innerHTML=magSubTypes[i];
					p4p1p4s1.appendChild(opt);
				}
			}else if(p4p1p3s1.value=='trap'){
				for(let i=0;i<trapSubTypes.length;i++){
					let opt=document.createElement('option');
					opt.innerHTML=trapSubTypes[i];
					p4p1p4s1.appendChild(opt);
				}
			}

			p4p1p4s1.disabled=(p4p1p3s1.value=='');
			p4p1p5s1.disabled=true;
			p4p1p6s1.disabled=true;
			p4p1p7tf1.disabled=true;
			p4p1p7tf2.disabled=true;
			p4p1p8tf1.disabled=true;
			p4p1p8tf2.disabled=true;
			p4p1p9tf1.disabled=true;
			p4p1p9tf2.disabled=true;
		}

		applyFilter();
	});
	
	for(let i=0;i<races.length;i++){
		let opt=document.createElement('option');
		opt.innerHTML=races[i];
		p4p1p5s1.appendChild(opt);
	}

	for(let i=0;i<attribs.length;i++){
		let opt=document.createElement('option');
		opt.innerHTML=attribs[i];
		p4p1p6s1.appendChild(opt);
	}

	p4p1p1tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p2tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p3s1.addEventListener('change',ev=>{
		applyFilter();
	});

	p4p1p4s1.addEventListener('change',ev=>{
		applyFilter();
	});

	p4p1p5s1.addEventListener('change',ev=>{
		applyFilter();
	});

	p4p1p6s1.addEventListener('change',ev=>{
		applyFilter();
	});

	p4p1p7tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p7tf2.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p8tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p8tf2.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p9tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p9tf2.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p10tf1.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p10tf2.addEventListener('keyup',ev=>{
		applyFilter();
	});

	p4p1p11im1.addEventListener('click',ev=>{
		flagSortPoolByTier=!flagSortPoolByTier;
		sortPool();
		applyFilter();
	});

	p4p1p11im2.addEventListener('click',ev=>{
		clearFilterFields();
		applyFilter();
	});

	clearFilterFields();
}

function clearFilterFields(){
	p4p1p1tf1.value='';
	p4p1p2tf1.value='';
	p4p1p3s1.value='';
	p4p1p4s1.value='';
	p4p1p5s1.value='';
	p4p1p6s1.value='';
	p4p1p7tf1.value='';
	p4p1p7tf2.value='';
	p4p1p8tf1.value='';
	p4p1p8tf2.value='';
	p4p1p9tf1.value='';
	p4p1p9tf2.value='';
	p4p1p10tf1.value='';
	p4p1p10tf2.value='';

	p4p1p5s1.disabled=true;
	p4p1p6s1.disabled=true;
	p4p1p7tf1.disabled=true;
	p4p1p7tf2.disabled=true;
	p4p1p8tf1.disabled=true;
	p4p1p8tf2.disabled=true;
	p4p1p9tf1.disabled=true;
	p4p1p9tf2.disabled=true;
}

function applyFilter(){
	let filterPool=[];

	for(let c of pool){
		/* name */
		if(p4p1p1tf1.value.trim()!='' && !c.name.toLowerCase().includes(p4p1p1tf1.value.trim().toLowerCase())){
			continue;
		}

		/* description */
		if(p4p1p2tf1.value.trim()!='' && !c.desc.toLowerCase().includes(p4p1p2tf1.value.trim().toLowerCase())){
			continue;
		}

		/* type */
		if(p4p1p3s1.value!='' && c.type!=p4p1p3s1.value){
			continue;
		}

		/* subtype */
		if(p4p1p4s1.value!='' && c.subType1!=p4p1p4s1.value){
			continue;
		}

		if(c.type=='monster'){
			/* race */
			if(p4p1p5s1.value!='' && c.race!=p4p1p5s1.value){
				continue;
			}

			/* attribute */
			if(p4p1p6s1.value!='' && c.attrib!=p4p1p6s1.value){
				continue;
			}

			/* lv */
			let lvMin=-100;
			let lvMax=100;

			if(p4p1p7tf1.value.trim()!=''){
				lvMin=parseInt(p4p1p7tf1.value.trim());
			}

			if(p4p1p7tf2.value.trim()!=''){
				lvMax=parseInt(p4p1p7tf2.value.trim());
			}

			if(c.lv<lvMin || c.lv>lvMax){
				continue;
			}

			/* atk */
			let atkMin=0;
			let atkMax=10000;

			if(p4p1p8tf1.value.trim()!=''){
				atkMin=parseInt(p4p1p8tf1.value.trim());
			}

			if(p4p1p8tf2.value.trim()!=''){
				atkMax=parseInt(p4p1p8tf2.value.trim());
			}

			if(c.atk<atkMin || c.atk>atkMax){
				continue;
			}

			/* def */
			let defMin=0;
			let defMax=10000;

			if(p4p1p9tf1.value.trim()!=''){
				defMin=parseInt(p4p1p9tf1.value.trim());
			}

			if(p4p1p9tf2.value.trim()!=''){
				defMax=parseInt(p4p1p9tf2.value.trim());
			}

			if(c.def<defMin || c.def>defMax){
				continue;
			}
		}

		/* tier */
		let tierMin=0;
		let tierMax=100;

		if(p4p1p10tf1.value.trim()!=''){
			tierMin=parseFloat(p4p1p10tf1.value.trim());
		}

		if(p4p1p10tf2.value.trim()!=''){
			tierMax=parseFloat(p4p1p10tf2.value.trim());
		}

		if(c.tier<tierMin || c.tier>tierMax){
			continue;
		}

		filterPool.push(c);
	}

	for(let i=0;i<filterPool.length;i++){
		poolSlots[i].setCard(filterPool[i]);
	}

	for(let i=filterPool.length;i<poolSlots.length;i++){
		poolSlots[i].clear();
	}

	nPoolMon=0;
	nPoolMag=0;
	nPoolTrap=0;

	for(let c of filterPool){
		if(c.type=='monster'){
			nPoolMon++;
		}else if(c.type=='magic'){
			nPoolMag++;
		}else if(c.type=='trap'){
			nPoolTrap++;
		}
	}

	p3t1.innerHTML='Pool: '+filterPool.length+' ('+nPoolMon+'/'+nPoolMag+'/'+nPoolTrap+')';
}

function implementButtons(){
	p5bt1.addEventListener('contextmenu',ev=>{
		ev.preventDefault();
		sortDeck(true);
	});

	p5bt1.addEventListener('click',ev=>{
		sortDeck(false);
	});

	p5bt2.addEventListener('click',ev=>{
		shuffleDeck();
	});

	p5bt3.addEventListener('click',ev=>{
		clearDeck();
	});

	p5bt4.addEventListener('click',ev=>{
		downloadDeck();
	});

	p5bt5.addEventListener('click',ev=>{
		fc.click();
	});

	fc.addEventListener('change',ev=>{
		let file=ev.target.files[0];

		if(file==null){
			return;
		}

		clearDeck();

		uploadDeck(file);
	});
}

function sortDeck(flagSortDeckByTier){
	deck.sort(compareByName);
	deck.sort(compareByType);
	deck.sort(compareByLevel);
	deck.sort(compareBySubType);

	if(flagSortDeckByTier){
		deck.sort(compareByTier);
	}

	for(let i=0;i<deck.length;i++){
		deckSlots[i].setCard(deck[i]);
	}
}

function shuffleDeck(){
	for(let i=0;i<deck.length;i++){
		let index=randomInt(0,deck.length-1);

		let c=deck[i];
		deck[i]=deck[index];
		deck[index]=c;
	}

	for(let i=0;i<deck.length;i++){
		deckSlots[i].setCard(deck[i]);
	}
}

function clearDeck(){
	for(let i=deck.length-1;i>=0;i--){
		removeFromDeck(i);
	}
}

function downloadDeck(){
	let deckName=prompt('Type your deck name:');

	let text='#created by ...\n#main\n';

	for(let c of deck){
		text+=c.passcode+'\n';
	}

	text+='#extra\n!side';

	let blob=new Blob([text],{type: 'text/plain'});
	let a=document.createElement('a');
	a.href=URL.createObjectURL(blob);

	a.download=deckName+'.ydk';

	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function uploadDeck(file){
	let fr=new FileReader();
	
	fr.addEventListener('load',ev=>{
		let text=ev.target.result;

		let lines=text.split(/\r?\n/);

		let index=2; /* skip 1st and 2nd lines */

		let line=lines[index];

		while(line!='#extra'){
			let c=mapPassToCard.get(line);

			if(c!=null){
				addToDeck(deck.length,c);
			}else{
				console.log(line+' not is not on the pool!');
			}

			line=lines[++index];
		}
	});

	fr.readAsText(file);
}

function implementCardDisplay(){
	/* pool */
	for(let s of poolSlots){
		s.setOnContextMenu(ev=>{
			ev.preventDefault();
			displayCard(s.card);
		});
	}

	/* deck */
	for(let s of deckSlots){
		s.setOnContextMenu(ev=>{
			ev.preventDefault();
			displayCard(s.card);
		});
	}

	/* card display */
	cdbt1.addEventListener('click',ev=>{
		cd.hidden=true;
	});
}

function displayCard(c){
	if(!c){
		return;
	}

	cdim1.src='files/pics_mod/'+c.passcode+'.jpg';

	cdta1.value='';

	if(c.type=='monster'){
		cdta1.value+=c.race+' / '+c.subType1+'\n';
		cdta1.value+=c.attrib+' / '+c.lv+'\n';
		cdta1.value+='atk: '+c.atk+' / def: '+c.def+'\n\n';
	}else if(c.type=='magic' || c.type=='trap'){
		cdta1.value+=c.type+' / '+c.subType1+'\n\n';
	}

	cdta1.value+=c.desc;

	cdta1.scrollTop=0;

	cd.hidden=false;
}

function sortPool(){
	pool.sort(compareByName);
	pool.sort(compareByType);
	pool.sort(compareByLevel);
	pool.sort(compareBySubType);

	if(flagSortPoolByTier){
		pool.sort(compareByTier);
	}

	applyFilter();
}

function compareByName(a,b){
	return a.name.localeCompare(b.name);
}

function compareByType(a,b){
	return types.indexOf(a.type)-types.indexOf(b.type);
}

function compareByLevel(a,b){
	if(a.type=='monster' && b.type=='monster'){
		return b.lv-a.lv;
	}

	return 0;
}

function compareBySubType(a,b){
	if(a.type=='monster' && b.type=='monster'){
		return monSubTypes.indexOf(a.subType1)-monSubTypes.indexOf(b.subType1);
	}else if(a.type=='magic' && b.type=='magic'){
		return magSubTypes.indexOf(a.subType1)-magSubTypes.indexOf(b.subType1);
	}else if(a.type=='trap' && b.type=='trap'){
		return trapSubTypes.indexOf(a.subType1)-trapSubTypes.indexOf(b.subType1);
	}

	return 0;
}

function compareByTier(a,b){
	return b.tier-a.tier;
}

function formatNumber(n){
	return parseFloat(n.toFixed(10)).toString();
}