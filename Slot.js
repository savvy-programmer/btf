/*
 *	slot
 */

class Slot{

	constructor(wPerc,hView){
		this.card=null;

		this.div=document.createElement('div');
		this.div.style.position='absolute';
		this.div.style.width=wPerc+'%';
		this.div.style.height=hView+'vh';
		this.div.style.border='1px dotted black';

		this.pic=document.createElement('img');
		this.pic.style.position='absolute';
		this.pic.style.left='2%';
		this.pic.style.top=.02*hView+'vh';
		this.pic.style.width='96%';
		this.pic.style.height=.96*hView+'vh';
		this.pic.hidden=true;

		this.tier=document.createElement('div');
		this.tier.style.position='absolute';
		this.tier.style.left='63%';
		this.tier.style.top=.73*hView+'vh';
		this.tier.style.width='35%';
		this.tier.style.height=.25*hView+'vh';
		this.tier.style.borderRadius='100%';
		this.tier.style.backgroundColor='rgba(0,0,0,.85)';
		this.tier.style.textAlign='center';
		this.tier.style.lineHeight=.25*hView+'vh';
		this.tier.style.fontSize='1vw';
		this.tier.style.fontWeight='bold';
		this.tier.style.color='white';
		this.tier.hidden=true;

		this.div.appendChild(this.pic);
		this.div.appendChild(this.tier);
	}

	setCard(c){
		this.card=c;

		this.div.style.cursor='grab';

		this.pic.src='files/pics_mod/'+c.passcode+'.jpg';
		this.pic.hidden=false;
		
		this.tier.innerHTML=c.tier;
		this.tier.hidden=false;
	}

	clear(){
		this.card=null;

		this.div.style.cursor='default';

		this.pic.src='';
		this.pic.hidden=true;
		
		this.tier.innerHTML='?';
		this.tier.hidden=true;
	}

	setX(x){
		this.div.style.left=x+'%';
	}

	getX(){
		return parseFloat(this.div.style.left);
	}

	setY(y){
		this.div.style.top=y+'vh';
	}

	getY(){
		return parseFloat(this.div.style.top);
	}

	getBoundingClientRect(){
		return this.div.getBoundingClientRect();
	}

	setOnMouseDown(eh){
		this.div.addEventListener('mousedown',eh);
	}

	setOnContextMenu(eh){
		this.div.addEventListener('contextmenu',eh);
	}

}

export {Slot};