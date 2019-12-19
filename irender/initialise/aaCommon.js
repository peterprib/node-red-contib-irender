if(!Array.prototype.move)
	Array.prototype.move = function(from, to) {
			if(from<to) to--;
			this.splice(to, 0, this.splice(from, 1)[0]);
		};
if(!Number.prototype.between)
	Number.prototype.between  = function (min, max) {
		    return !(this < min || this > max);
		};
if(!String.prototype.in)
    String.prototype.in = function (str) {
			for (var i = 0; i < arguments.length; i++)
				if(this==arguments[i]) return true;
			return false;
   		};

function addCloseIcon (o,n) {
	o.closeIcon=css.setClass(o.base.getImage("closeIcon"),"CloseIcon");
	n.appendChild(o.closeIcon);
	o.closeIcon.addEventListener('click', o.onclickClose.bind(o), false);
}
function coalesce() {
	for (var a,len=arguments.length, i=0; i<len; i++) {
		a=arguments[i];
		if(a===null || a===undefined) continue;
		return a;
	}
	return null;
}
function createElement(e,c,n){
	var en=c?css.setClass(document.createElement(e),c):document.createElement(e);
	n.appendChild(en);
	return en;
}
function createDiv (f) {
	return css.setClass(document.createElement("DIV"),f||"FullLeft");
}
function createNode(nodeDetails) {
	if(nodeDetails.constructor === String) return document.createTextNode(nodeDetails);
	return document.createTextNode(nodeDetails.toString());
};
function createTable(rows,cols) {
	var t=document.createElement("TABLE");
	while (t.rows.length<rows) {
		var r=createTableRow(t);
		while (r.cells.length<cols) {
			createTableCell(r);
		}
	}
	return t;
}
function createTableRow(t) {
	return createElement("TR",null,t);
}
function createTableCell(r) {
	return createElement("TD",null,r);
}
function eventDoNothing(ev) {
	ev.stopPropagation();
}
function getMousePositionRelative(ev) {
	var e=ev.currentTarget;
	return { x: ev.pageX - (e.offsetLeft + e.parentElement.offsetLeft)
		,y: ev.pageY - (e.offsetTop + e.parentElement.offsetTop)};
}
function rgb(r,g,b) {
	return "#"+("00000"+((r<<16)+(g<<8)+b).toString(16)).substr(-6);
}
if(String.prototype.inList)
	console.log("String.prototype.inList already defined");
else
	String.prototype.inList = function () {
			var thisString=this.toString(), argValue;
			for (var i=0; i<arguments.length; i++) {
				argValue=arguments[i];
				if(argValue===null) continue;
				if(argValue instanceof Array) {
					for (var j= 0; j<argValue.length;j++)
						if(thisString==argValue[j]) return true;
				} else if(argValue instanceof Object) {
						for (var j in argValue)
							if(thisString===j) return true;
				} else if(thisString===argValue) return true;
			}
			return false;
   		};

function dragAllowDrop(ev) {
	ev.preventDefault();
}
function dragStart(ev) {
	this.dragStartX=ev.pageX;
	this.dragStartY=ev.pageY;
	ev.target.style.opacity = "0.5";
	document.addEventListener('dragend',dragEnd.bind(this), {once:true});
	document.addEventListener("dragover",dragAllowDrop.bind(this), false);
}
function dragEnd(ev) {
    ev.target.style.opacity = "";
    document.removeEventListener('dragover',dragAllowDrop.bind(this), false);
//    document.removeEventListener('dragEnd',dragEnd.bind(this), false);
    this.movePane({x:ev.pageX-this.dragStartX,y:ev.pageY-this.dragStartY});
}