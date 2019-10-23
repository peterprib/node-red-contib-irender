//"use strict";
const nsSVG="http://www.w3.org/2000/svg",
	colors ={
	  "black": "#000000",
	  "silver": "#C0C0C0",
	  "gray": "#808080",
	  "grey": "#808080",
	  "white": "#FFFFFF",
	  "maroon": "#800000",
	  "red": "#FF0000",
	  "purple": "#800080",
	  "fuchsia": "#FF00FF",
	  "green": "#008000",
	  "lime": "#00FF00",
	  "limellow":"#667086",
	  "olive": "#808000",
	  "yellow": "#FFFF00",
	  "navy": "#000080",
	  "blue": "#0000FF",
	  "teal": "#008080",
	  "aqua": "#00FFFF",
	  "darkblue": "#00008B",
	  "mediumblue": "#0000CD",
	  "darkgreen": "#006400",
	  "darkcyan": "#008B8B",
	  "deepskyblue": "#00BFFF",
	  "darkturquoise": "#00CED1",
	  "mediumspringgreen": "#00FA9A",
	  "springgreen": "#00FF7F",
	  "cyan": "#00FFFF",
	  "midnightblue": "#191970",
	  "dodgerblue": "#1E90FF",
	  "lightseagreen": "#20B2AA",
	  "forestgreen": "#228B22",
	  "seagreen": "#2E8B57",
	  "darkslategray": "#2F4F4F",
	  "darkslategrey": "#2F4F4F",
	  "limegreen": "#32CD32",
	  "mediumseagreen": "#3CB371",
	  "turquoise": "#40E0D0",
	  "royalblue": "#4169E1",
	  "steelblue": "#4682B4",
	  "darkslateblue": "#483D8B",
	  "mediumturquoise": "#48D1CC",
	  "indigo": "#4B0082",
	  "darkolivegreen": "#556B2F",
	  "cadetblue": "#5F9EA0",
	  "cornflowerblue": "#6495ED",
	  "rebeccapurple": "#663399",
	  "mediumaquamarine": "#66CDAA",
	  "dimgray": "#696969",
	  "dimgrey": "#696969",
	  "slateblue": "#6A5ACD",
	  "olivedrab": "#6B8E23",
	  "slategray": "#708090",
	  "slategrey": "#708090",
	  "lightslategray": "#778899",
	  "lightslategrey": "#778899",
	  "mediumslateblue": "#7B68EE",
	  "lawngreen": "#7CFC00",
	  "chartreuse": "#7FFF00",
	  "aquamarine": "#7FFFD4",
	  "skyblue": "#87CEEB",
	  "lightskyblue": "#87CEFA",
	  "blueviolet": "#8A2BE2",
	  "darkred": "#8B0000",
	  "darkmagenta": "#8B008B",
	  "saddlebrown": "#8B4513",
	  "darkseagreen": "#8FBC8F",
	  "lightgreen": "#90EE90",
	  "mediumpurple": "#9370DB",
	  "darkviolet": "#9400D3",
	  "palegreen": "#98FB98",
	  "darkorchid": "#9932CC",
	  "yellowgreen": "#9ACD32",
	  "sienna": "#A0522D",
	  "brown": "#A52A2A",
	  "darkgray": "#A9A9A9",
	  "darkgrey": "#A9A9A9",
	  "lightblue": "#ADD8E6",
	  "greenyellow": "#ADFF2F",
	  "paleturquoise": "#AFEEEE",
	  "lightsteelblue": "#B0C4DE",
	  "powderblue": "#B0E0E6",
	  "firebrick": "#B22222",
	  "darkgoldenrod": "#B8860B",
	  "mediumorchid": "#BA55D3",
	  "rosybrown": "#BC8F8F",
	  "darkkhaki": "#BDB76B",
	  "mediumvioletred": "#C71585",
	  "indianred": "#CD5C5C",
	  "peru": "#CD853F",
	  "chocolate": "#D2691E",
	  "tan": "#D2B48C",
	  "lightgray": "#D3D3D3",
	  "lightgrey": "#D3D3D3",
	  "thistle": "#D8BFD8",
	  "orchid": "#DA70D6",
	  "goldenrod": "#DAA520",
	  "palevioletred": "#DB7093",
	  "crimson": "#DC143C",
	  "gainsboro": "#DCDCDC",
	  "plum": "#DDA0DD",
	  "burlywood": "#DEB887",
	  "lightcyan": "#E0FFFF",
	  "lavender": "#E6E6FA",
	  "darksalmon": "#E9967A",
	  "violet": "#EE82EE",
	  "palegoldenrod": "#EEE8AA",
	  "lightcoral": "#F08080",
	  "khaki": "#F0E68C",
	  "aliceblue": "#F0F8FF",
	  "honeydew": "#F0FFF0",
	  "azure": "#F0FFFF",
	  "sandybrown": "#F4A460",
	  "wheat": "#F5DEB3",
	  "beige": "#F5F5DC",
	  "whitesmoke": "#F5F5F5",
	  "mintcream": "#F5FFFA",
	  "ghostwhite": "#F8F8FF",
	  "salmon": "#FA8072",
	  "antiquewhite": "#FAEBD7",
	  "linen": "#FAF0E6",
	  "lightgoldenrodyellow": "#FAFAD2",
	  "oldlace": "#FDF5E6",
	  "magenta": "#FF00FF",
	  "deeppink": "#FF1493",
	  "orangered": "#FF4500",
	  "tomato": "#FF6347",
	  "hotpink": "#FF69B4",
	  "coral": "#FF7F50",
	  "darkorange": "#FF8C00",
	  "lightsalmon": "#FFA07A",
	  "orange": "#FFA500",
	  "lightpink": "#FFB6C1",
	  "pink": "#FFC0CB",
	  "gold": "#FFD700",
	  "peachpuff": "#FFDAB9",
	  "navajowhite": "#FFDEAD",
	  "moccasin": "#FFE4B5",
	  "bisque": "#FFE4C4",
	  "mistyrose": "#FFE4E1",
	  "blanchedalmond": "#FFEBCD",
	  "papayawhip": "#FFEFD5",
	  "lavenderblush": "#FFF0F5",
	  "seashell": "#FFF5EE",
	  "cornsilk": "#FFF8DC",
	  "lemonchiffon": "#FFFACD",
	  "floralwhite": "#FFFAF0",
	  "snow": "#FFFAFA",
	  "lightyellow": "#FFFFE0",
	  "ivory": "#FFFFF0"
	}
function MouseSvg(svgObject) {
	this.svgObject=svgObject;
	this.element=svgObject.drawObject(this.svgCursorDetails);
	this.svgObject.svg.addEventListener('mousemove', this.move.bind(this), false);
}
MouseSvg.prototype.svgCursorDetails={action:"g",id:"cursorDetails",draggable:false,"font-size":10,style:"z-index:99999;",children:
	[{action:"text",x:2,y:12,draggable:false,children:["x:"]}
	,{action:"text",x:14,y:12,draggable:false,children:["?"]}
	,{action:"text",x:2,y:24,draggable:false,children:["y:"]}
	,{action:"text",x:14,y:24,draggable:false,children:["?"]}
]};
MouseSvg.prototype.move=function(ev) {
	this.element.childNodes[1].firstChild.nodeValue=ev.offsetX;
	this.element.childNodes[3].firstChild.nodeValue=ev.offsetY;
};
var shapes={
	circle:{action:"circle",cx:"40",cy:"40",r:"40",stroke:"black","stroke-width":4,fill:"yellow"},
	square:{action:"rect",id:"rect",x:0,y:0,width:32,height:32,stroke:"black","stroke-width":4,fill:"yellow"},
	ellipse:{action:"ellipse",id:"ellipse",cx:"40",cy:"40",rx:"40",ry:"30",stroke:"yellow","stroke-width":4,fill:"yellow"},
	line:{action:"line",id:"line",x1:"0",y1:"0",x2:"40",y2:"30",stroke:"black","stroke-width":4},
	star:{action:"polygon",id:"polygon",points:"100,10 40,198 190,78 10,78 160,198",stroke:"purple","stroke-width":1,fill:"limellow","fill-rule":"nonzero"},
	text:{action:"text",id:"text",x:0,y:0,"font-size":100,children:["test text"]},
	arrowHead:{action:"polyline",points:"40 60 80 20 120 60"   ,stroke:"black","stroke-width":"20","stroke-linecap":"butt",fill:"none","stroke-linejoin":"miter"},
	arrowHeadRound:{action:"polyline",points:"40 140 80 100 120 140",stroke:"black","stroke-width":"20","stroke-linecap":"round",fill:"none","stroke-linejoin":"round"},
	arrowHeadBevel:{action:"polyline",points:"40 220 80 180 120 220",stroke:"black","stroke-width":"20","stroke-linecap":"square",fill:"none","stroke-linejoin":"bevel"}
};

function Svg(base,properties,options) {
	this.base=base;
	this.options=(options||{});
	this.element=document.createElement("div");
	this.element.IRender=this;
	this.element.style.width="100%";
	this.element.style.height="100%";
	this.svg=document.createElementNS(nsSVG,"svg");
	this.set(Object.assign({},properties,{width:"100%",height:"100%"}));
	this.element.appendChild(this.svg);
	this.loadUseShapes(shapes);
	if(this.options.mouseCoords==null || this.options.mouseCoords) {
		this.mouse=new MouseSvg(this);
	}
	this.element.addEventListener('dblclick', this.editFloatingPane.bind(this), false)
	this.svg.addEventListener('mousedown', this.setMoveSVGObject.bind(this), false);
}
Svg.prototype.appendTo=function(n) {
	n.appendChild(this.svg);
	this.parent;
	return this;
}
Svg.prototype.add2Attr=function(e,o) {
	for(let p in o) {
		if(e.hasAttribute(p))
			e.setAttribute(p,parseInt(e.getAttribute(p))+o[p]);
	}
};
Svg.prototype.add2pairs=function(aIn,x,y) {
	const a=aIn.replace(/,/g," ").trim();
	for(let r="", p=a.split(" "),i=0;i<p.length;i=i+2) {
		r+=(parseInt(p[i])+x)+","+(parseInt(p[i+1])+y)+" ";
	}
	return r.trim();
};
Svg.prototype.clear=function(n) {
	while(n.childNodes.length > 1)
		n.removeChild(n.firstChild);
};
Svg.prototype.clearAll=function() {
	this.clear(this.svg);
};
Svg.prototype.close=function() {
//	this.svgFloat.parentElement.removeChild(this.svgFloat);
	this.floatPane.style.display="none";
//	this.element.removeChild(this.floatPane);
//	delete this.floatPane;
};
Svg.prototype.createFloat=function(title) {
	this.floatPane=createTable(2,1);
	this.floatPane.addEventListener('click', eventDoNothing.bind(this), false);
	this.floatPane.mySvg=this;
	this.element.appendChild(this.floatPane);
	this.floatPaneHeader=this.floatPane.rows[0].style.width="100%";
	this.floatPaneHeader=this.floatPane.rows[0].cells[0];
	this.floatPaneHeader.mySvg=this;
	this.floatPaneHeader.style="background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;";
	this.floatPaneHeader.appendChild(createNode("\u00a0"+(title||"No Title Set")+"\u00a0"));
	this.closeIcon=this.getIconImage("close_s.gif");
	this.closeIcon.align="right";
	this.floatPaneHeader.appendChild(this.closeIcon);
	this.closeIcon.addEventListener('click', this.onclickClose.bind(this), false);
	this.closeIcon.addEventListener('mouseenter', this.iconEnter.bind(this), false);
	this.closeIcon.addEventListener('mouseleave', this.iconLeave.bind(this), false);
	this.floatPane.style=
		"min-width: 100px; min-height: 100px;"
		+"position:fixed; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
		+"overflow:auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;"
		;
	this.floatPaneDetail=this.floatPane.rows[1].cells[0];
	this.floatPane.draggable=true;//dragStart
	this.floatPane.addEventListener('dragstart', dragStart.bind(this), false);
	
	this.floatPaneDetail.mySvg=this;
	this.form=new Form(this)
		.select({title:"Shape"
			,option:{ "function": function(e) {
					for(var s in shapes) {
						e.appendChild(this.action({action:"option",label:s,value:s,children:[s]}));
				}}}
			,onchange: function(ev) {
					this.shape=ev.target.value;
					this.setMapping(shapes[this.shape])
					this.applyFilter("insert",shapes[this.shape].action);
				}
			},null,["insert"])
		.input({title:"Radius",type:"number",min:1},"r",["circle"])
		.input({title:"Stroke",type:"color"},"stroke")
		.input({title:"Stroke Width",type:"number",min:1,max:10,value:1},"stroke-width")
		.input({title:"Opacity",type:"range",min:0,max:100,value:50},"opacity") 
		.input({title:"Fill",type:"color"},"fill")   
		.input({title:"Fill Opacity",type:"range",min:0,max:100,},"fill-opacity") 
		.input({title:"",type:"button",value:"Insert"
				,onclick: function(ev) {
						this.parent.insertShape({x:ev.offsetX,y:ev.offsetY},Object.assign({},shapes[this.shape],this.getMapping()));
						this.parent.close();
					}
				},null,["insert"])
		.input({title:"",type:"button",value:"Update"
				,onclick: function(ev) {
//						this.parent.insertShape({x:ev.offsetX,y:ev.offsetY},Object.assign(Object.assign({},shapes[this.shape],this.getMapping());
						this.parent.close();
					}
				},null,["update"])
		.addItem({title:"Zoom",children:[
					{action:"input",type:"button",value:"Fit Window",onclick: function(ev) {this.parent.zoomAll();}}
					,{action:"input",type:"button",value:"+",onclick: function(ev) {this.parent.zoomIn();}}
					,{action:"input",type:"button",value:"-",onclick: function(ev) {this.parent.zoomOut();}}
				]
			})
		.setMapping(shapes.square);
	this.floatPaneDetail.appendChild(this.form.element);
};
Svg.prototype.draw=function(p) {
	this.drawObject(p);
	return this;
};
Svg.prototype.drawObject=function(p,n) {
	if (p.constructor === String)
		return n.appendChild(document.createTextNode(p));
	if(p instanceof Array) {
		for(let i=0;i<p.length;i++) {
			this.drawObject(p[i],n);
		}
		return;
	}
	let o=document.createElementNS(nsSVG, p.action);
	if(o==undefined) throw Error("SVG invalid function "+p.action);
	for(let a in p){
		if(a=="action") continue;
		if(a=="children" && p[a] instanceof Array) {
			this.drawObject(p[a],o);
			continue;
		}
		if(a instanceof Function) {
			o.addEventListener((p.substr(0,2)=="on"?p.substr(2):p), a.bind(this), false);
			continue;
		}
		try{
			o.setAttributeNS(null, a, p[a]);
		} catch(e) {
			throw Error("failed set attribute "+a+" to "+p[a]+" error "+e)
		}
	}
	if(p.action=="foreignObject")
		o.setAttributeNS(null, "requiredExtensions", "http://www.w3.org/1999/xhtml");
	o.style.cursor="move";
	(n||this.svg).appendChild(o);
	return o;
};
Svg.prototype.drawObjectAssign=function() {
	this.drawObject(Object.assign({},...arguments));
};
Svg.prototype.editFloatingPane=function(ev) {
	ev.stopPropagation();
	if(this.floatPane) {
		this.floatPane.style.display="table";
	} else {
		this.createFloat("Edit");
	}
	this.positionFixed(this.floatPane,ev.clientX,ev.clientY);
	if(ev.srcElement.nodeName=="svg") {
		this.form.applyFilter(["insert",ev.srcElement.nodeName]);
		return;
	}
	this.form.setMapping(this.toJSON(ev.srcElement));
	this.form.applyFilter(["update",ev.srcElement.nodeName]);
};
Svg.prototype.getDef=function() {
	if(!this.def) {
		this.def=document.createElementNS(nsSVG, "def");
		this.svg.appendChild(this.def);
	}
	return this.def;
};

Svg.prototype.getIconImage=function(n) {
	let i=new Image(16,16);
	i.src="images/"+n;
	return i;
};

Svg.prototype.iconEnter=function(ev) {
	ev.target.style.cursor="pointer";
		ev.target.style.filter="invert(100%)";
};
Svg.prototype.iconLeave=function(ev) {
	ev.target.style.cursor="inherit";
	ev.target.style.filter="inherit";
};
Svg.prototype.insertShape=function(pos,p) {
	switch(p.action) {
		case "circle": 
		case "ellipse":
			p.cx=pos.x;
			p.cy=pos.y;
			break;
		case "rect": 
		case "use": 
		case "g": 
		case "text": 
			p.x=pos.x;
			p.y=pos.y;
			break;
		case "line": 
			p.x2-=pos.x-p.x1;
			p.y2-=pos.y-p.y1;
			p.x1=pos.x;
			p.y1=pos.y;
			break;
	}
	this.drawObject(p);
};
Svg.prototype.loadUseShapes=function(o) {
	var def=this.getDef(),s;
	for(var p in o) {
		s=o[p];
		def.appendChild(this.drawObject({action:"g",id:p,children:o[p]}));
	}
};
Svg.prototype.onclickClose=function(ev) {
	ev.stopPropagation();
	this.close(ev);
};
Svg.prototype.pattern=function(p) {
	return this.drawObject(Object.assign({action:"pattern"},p));
};
Svg.prototype.positionFixed=function(e,x,y) {
	e.style.left=x+"px";
	e.style.top=y+"px";
};
Svg.prototype.set=function(o) {
	for (var p in o) {
		switch (p) {
			case "viewBox":
				this.svg.setAttribute(p,o[p].minx+" "+o[p].miny+" "+o[p].width+" "+o[p].height);
				break;
			case "draw":
				this.draw(o[p]);
				break;
			default:
				this.svg.setAttribute(p,o[p]);
		}
	}
};
Svg.prototype.toJSON=function(o) {
	let i,n,p,r={action:o.nodeName};
	for(i=0;i<o.attributes.length;i++) {
		p=o.attributes[i];
		r[p.nodeName]=p.value;
	}
	if(o.style) {
		for(i=0;;i++) {
			if(i in o.style) {
				p=o.style[i];
				n=p.split("-");
				for(var j=1;j<n.length;j++) {
					n[j]=n[j].charAt(0).toUpperCase()+n[j].substr(1);
				}
				r[p]=o.style[n.join("")];
				continue;
			}
			break;
		}
	}
	if(o.children.length) {
		r.children=o.children.map(c=>this.toJSON(c));
	}
	return r;
};
Svg.prototype.zoomAll=function() {
	const bb=this.svg.getBBox();
	this.svg.setAttribute("viewBox", [bb.x,bb.y,bb.width,bb.height].join(" ") );
};
Svg.prototype.zoomIn=function() {	
	this.svg.currentScale=1.1 * this.svg.currentScale; // zoom out
};
Svg.prototype.zoomOut=function() {	
	this.svg.currentScale=0.9 * this.svg.currentScale; // zoom out
};

Svg.prototype.setMoveSVGObject=function(ev) {
	if(ev.target.nodeName=="svg") return;
	if(ev.target.getAttribute("draggable")==="false") return;
	ev.stopPropagation();
	ev.preventDefault();
	this.moveObject=ev.target;
	this.moveX=ev.clientX;
	this.moveY=ev.clientY;
	this.moveObject.addEventListener('mouseout', this.moveSVGObjectReset.bind(this), false);
	this.moveObject.addEventListener('mouseup', this.moveSVGObjectReset.bind(this), false);
	this.moveObject.addEventListener('mousemove', this.moveSVGObject.bind(this), false);
	this.moveObject.addEventListener('click', eventDoNothing.bind(this), false);

/*
	this.moveTransform=his.moveObject.getAttributeNS(null, "transform");
	if(this.moveTransform=null) this.moveTransform="matrix(1 0 0 1 0 0)";
	this.moveMatrix=this.moveTransform.slice(7,-1).split(' ');
	for(var i=0; i<this.moveMatrix.length; i++) {
		this.moveMatrix[i]=parseFloat(this.moveMatrix[i]);
	}
*/
};
/*
Svg.prototype.delta=function(s,e) {
		return {x:(s.x-e.x),y:(s.y-e.y)}
	};
*/
Svg.prototype.moveSVGObject=function(ev) {
	if(!this.moveObject) return;
	switch(this.moveObject.nodeName) {
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
	}
/*
  let dx=ev.clientX - this.moveX
  	,dy=ev.clientY - this.moveY;
  this.moveMatrix[4] += dx;
  this.moveMatrix[5] += dy;
  this.moveObject.setAttributeNS(null, "transform", "matrix(" + moveMatrix.join(' ') + ")");
  this.moveX=ev.clientX;
  this.moveY=ev.clientY;
*/
};
Svg.prototype.moveSVGObjectReset=function(ev) {
	if(!this.moveObject) return;
	this.moveObject.removeEventListener('mousemove', this.moveSVGObject.bind(this), false);
	this.moveObject.removeEventListener('mouseout', this.moveSVGObjectReset.bind(this), false);
	this.moveObject.removeEventListener('mouseup', this.moveSVGObjectReset.bind(this), false);
	this.moveObject.removeEventListener('click', eventDoNothing.bind(this), false);
	delete this.moveObject;
};
Svg.prototype.movePane=function(p) {
	const left=Number(this.floatPane.style.left.slice(0, -2)),
		top=Number(this.floatPane.style.top.slice(0, -2));
	this.floatPane.style.left=(left+p.x)+"px";
	this.floatPane.style.top=(top+p.y)+"px";	
	this.setMaxPaneSize();
};
Svg.prototype.setMaxPaneSize=function() {
	const p=this.floatPane.getBoundingClientRect()
		,w=this.element.getBoundingClientRect()
	if(w.width<p.right) this.floatPane.style.width=(w.width-p.left)+"px";
	if(w.height<p.bottom) this.floatPane.style.height=(w.height-p.top)+"px";
};