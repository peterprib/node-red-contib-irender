function setMoveObject (ev) {
	try{
		if(ev.target.getAttribute("draggable")==="false") return;
	} catch(e) {}
	ev.stopPropagation();
	ev.preventDefault();
	this.moveObject=this.pane.element;
	this.moveX=ev.clientX;
	this.moveY=ev.clientY;
	window.addEventListener('mouseup', setMoveObject.prototype.reset.bind(this), false);
	window.addEventListener('mousemove', setMoveObject.prototype.move.bind(this), false);
}
setMoveObject.prototype.add2Attr = function (e,o) {
	for(var p in o) {
		if(e.hasAttribute(p))
			e.setAttribute(p,parseInt(e.getAttribute(p))+o[p]);
	}
};
setMoveObject.prototype.add2pairs = function (a,x,y) {
	a=a.replace(/,/g," ").trim();
	for(var r="", p=a.split(" "),i=0;i<p.length;i=i+2) {
		r+=(parseInt(p[i])+x)+","+(parseInt(p[i+1])+y)+" ";
	}
	return r.trim();
};

setMoveObject.prototype.doNothing = function (ev) {
		ev.stopPropagation();
	};
setMoveObject.prototype.move = function (ev) {
//		if(!this.moveObject) return;
		switch(this.moveObject.nodeName) {
			case "DIV":
			case "TABLE":
				this.moveObject.style.left=this.moveObject.offsetLeft+ev.movementX+"px";
				this.moveObject.style.top=this.moveObject.offsetTop+ev.movementY+"px";
				return;
			case "line":
				this.add2Attr(this.moveObject,{x1:ev.movementX,x2:ev.movementX,y1:ev.movementY,y2:ev.movementY});
				return;
			case "rect":
			case "use": 
			case "pattern":
			case "g":
			case "text":
				this.add2Attr(this.moveObject,{x:ev.movementX,y:ev.movementY});
				return;
			case "circle":  
			case "ellipse":  
				this.add2Attr(this.moveObject,{cx:ev.movementX,cy:ev.movementY});
				return;
			case "polygon":  
			case "polyline":  
				this.moveObject.setAttribute("points",this.add2pairs(this.moveObject.getAttribute("points"),ev.movementX,ev.movementY));
				return;
			default:
				if(this.error) return;
				console.error("setMoveObject unknown node "+this.moveObject.nodeName);
				this.error=true;
		}
	};
setMoveObject.prototype.reset = function (e) {
		window.removeEventListener('mousemove'	,setMoveObject.prototype.move.bind(this), false);
		window.removeEventListener('mouseup'	,setMoveObject.prototype.reset.bind(this), false);
		delete this;
	};
