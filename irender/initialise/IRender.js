function PaneRow(b,p,n) {
	this.element=css.setClass(document.createElement("TR"),"TableRow");
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.centerCell=new Pane(b,p,n);
	this.element.appendChild(this.centerCell.element);
}

function Text(t) {
	var n=document.createElement("a");
	n.innerText=t;
	return n;
}
function TextArea(v,o,n) {
	this.element=document.createElement("textarea");
	if(o) Object.assign(this.element,o);
	this.element.iRender=this;
	this.element.value=v;
	this.appendTo(n);
}
TextArea.prototype.appendTo = function (n) {
	if(n) {
		this.element.style.width=n.clientWidth+"px";
		this.element.style.height=n.clientHeight+"px";
		n.appendChild(this.element);
	}
	return this;
};
function Table() {
	this.element=document.createElement("TABLE");
}
Table.prototype.addRow = function () {
	this.appendCell(new Cell(this));
	return this;
};
Table.prototype.appendRow = function (row) {
	this.element.appendChild(row.element);
	return this;
};
function Row(table) {
	this.table=table;
	this.element=document.createElement("TR");
	table.appendRow(this);
}
Row.prototype.addCell = function () {
		this.appendCell(new Cell(this));
		return this;
	};
Row.prototype.appendCell = function (cell) {
		this.element.appendChild(cell.element);
		return this;
	};
function Cell(row) {
	this.row=row;
	this.element=document.createElement("TD");
	row.appendCell(this);
	return this;
}
function Window (base,p,n) {
	this.element=css.setClass(createTable(),"Table");
	if(p.title) document.title=p.title;
	this.headerRow=new HeaderRow(base,p,this.element,{style:"HeaderMain"});
	this.centerRow=new PaneRow(base,base.panes[p.pane],this.element);	
	if(p.footer) this.footerRow=new FooterRow(base,p,this.element,{style:"FooterMain"});
	n.append(this.element);
	base.floatHandle=n;
}	
Window.prototype.sizeCenter = function () {
		// rect is a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		this.centerNode.element.height = (this.element.clientHeight
				-(this.headerNode?this.headerRow.element.getBoundingClientRect().height:0)
				-(this.footerNode?this.footerRow.element.getBoundingClientRect().height:0)
				) + "px";
	};


function IRender() {
	this.actions={folder:{type:"folder"}};
	this.guid=0;
	this.metadata = {
			action: {action:null,id:null,type:["link","pane","table","svg","googleMap","httpGet"],
				url:null,title:null,target:null,pane:null,passing:null,setDetail:null,timeout:null}
			,image: {action:null,id:null ,file:null}
			,menu: {action:null,id:null ,options:{"default":Array.constructor}}
			,menuOption: {action:null,menu:null,title:null ,executeAction:null ,passing:null}
			,pane: {action:null,id:null ,title:null, leftMenu:null,show:null ,closable:null, onCloseHide:null ,header:null ,footer:null, content:null}
			,window: {title:{"default":"No Title Specified"},leftMenu:null,footer:{"default":"No Footer Specified"},pane:null}
		};
	this.panes={};
	this.window={};
	this.menus={};
	this.images={
		alert:"icon-alert.gif",alertBig:"alert_big.gif",cancel:"icon-cancel.gif",error:"icon-error.gif",edit:"icon-edit.gif",
		file:"file.gif",folderOpen:"folderOpen.gif",folderClose:"folderClose.gif",
		loadingPage:"loadingpage_small.gif",closeIcon:"close_s.gif"
	};
	this.imageBase="images/";
	this.addAction({id:"folder",type:"folder"});
	
	this.addPane({id:"error",title:"Error"});
	this.addAction({id:"actionNotDefined",type:"floatingPane",pane:"error"
		,passing:{message:"Action has not been defined"}});
	this.addVis();
	this.addSVG();
}
IRender.prototype.getImage = function(n) {
		var i = new Image(16,16);
		i.src=this.imageBase+this.images[n];
		return i;
	};
IRender.prototype.getPane = function(n) {
		if(n in this.panes)	return this.panes[n];
		throw Error("Pane "+n+" not found");
	};
IRender.prototype.add = function(p) {
		if(p) {
			if(p instanceof Array) {
				p.forEach((c)=>this.add(c));
			} else {
				try{
					this[p.action](p);
				} catch(e) {
					console.error('IRender add error: '+e.message+" for "+p);
				}		
			}
		}
		return this;
	};
IRender.prototype.addAction = function(p) {
		this.checkProperties(p,"action");
		this.actions[p.id]=new Action(this,p);
		return this;
	};
IRender.prototype.addImage = function(p) {
		this.checkProperties(p,"image");
		this.images[p.id]=p.file;
        return this;
	};
IRender.prototype.addMenu = function(p) {
		this.checkProperties(p,"menu");
		this.menus[p.id]=p;
		return this;
	};
IRender.prototype.addMenuOption = function(m,p) {
		let	properties=p?Object.assign({menu:m},p):m,
			menu=properties.menu;
		this.checkProperties(properties,"menuOption");
		if(!(menu in this.menus)) throw Error("menu not found for "+menu);
		this.menus[menu].options.push(properties);
		return this;
	};
IRender.prototype.addPane = function(p) {
		this.checkProperties(p,"pane");
		this.panes[p.id]=p;
        return this;
	};
IRender.prototype.attributes = function(a) {
		if(a===null) return "";
		var r="";
		for(var p in a)
			r+=" "+p+"='"+a[p]+"'";
		return r;
	};
IRender.prototype.build = function() {
		console.log("IRender build");
		this.setAllNodes('IRender',this.buildBase);
        return this;
	};
IRender.prototype.buildBase = function(n) {
		try{var f=this[n.nodeName];} catch(e) {
			console.error("IRender buildBase ignored tag "+n.nodeName.toString());	
			return this;
		}
		try{f.apply(this,[n]);} catch(e) {
			console.log("IRender buildBase "+e);	
			console.error("IRender buildBase tag "+n.nodeName.toString()+ "error: "+e+"\nStack: "+e.stack);	
		}
        return this;
	};
IRender.prototype.BODY = function(n) {
		this.windowObject=new Window(this,this.window,n);
	};
IRender.prototype.getAdjustedPosition = function(x,y,n) {
		// rect is a DOMRect object with eight properties: left, top, right, bottom, x, y, width, height
		var window=this.getBoundingClientRect()
			,pane=n.getBoundingClientRect()
			,paneEndx=x+pane.width
			,paneEndy=y+pane.height
			,ax=(paneEndx<window.width?x:x-paneEndx+window.width)
			,ay=(paneEndy<window.height?y:y-paneEndy+window.height);
		return {x:ax,y:ay};
	};
IRender.prototype.getBoundingClientRect = function() {
		return this.windowObject.element.getBoundingClientRect();
	};
IRender.prototype.checkProperties = function(o,e) {
		var ps=this.metadata[e];
		for(var p in o)
			if(!p.inList(ps))
				throw Error("invalid property "+p+" for "+e);
		for(var p in ps) {
			if(!o.hasOwnProperty(p)) {
				if(ps[p]!==null) {
					var d=coalesce(ps[p]["default"],null);
					if(d == Array.constructor) {
						o[p] = [];
					} else if(d == Object.constructor) {
						o[p] = {};
					} else if(d instanceof Function) {
						o[p] = new d();
					} else if(d instanceof Array) {
						if (ps[p] in d)
							throw Error("unknown value for "+p+" found "+ps[p]+" expecting "+d.join());
					} else {
						op[p]= d;
					}
				}
			}
		}
		return this;
	};
IRender.prototype.header = function(a,n) {
		return this.tag("header",a,coalesce(n,this.window.title,"No Title Set"));
	};
IRender.prototype.insertFooter = function(n) {
		console.log("IRender insertFooter");
		var h = css.setClass(document.createElement("FOOTER"),"Footer");
		h.appendChild(this.createNode(coalesce(this.window.footer,"No Footer Set")));
		n.appendChild(h);
        return this;
	};
IRender.prototype.insertHeader = function(n) {
		console.log("IRender insertHeader");
		var h = css.setClass(document.createElement("HEADER"),"Header");
		h.appendChild(createNode(coalesce(this.window.title,"No Title Set")));
		if(n.childNodes.length>0)
			n.insertBefore(h,n.childNodes[0]);
		else
			n.appendChild(h);
        return this;
	};
IRender.prototype.input = function(a,n) {
		return this.tag("input",a,n);
	};
IRender.prototype.options = function(id,o) {
		var r="";
		for(var i in o)
			r+=this.tag("option",{label:i},o[i]);
		return this.tag("select",{id:id},r);
	};
IRender.prototype.getPaneDetail = function(id,node) {
//	 	for(var p=node.parentNode;node.name!=="";p=node.parentNode) continue;
	 	
	};
IRender.prototype.setAllNodes = function(c,f) {
		var f=coalesce(f,this[c],null);
		if(f===null) return;
		for(var ns = document.getElementsByClassName(c),nsl=ns.length,i=0;i<nsl;i++)
			f.apply(this,[ns[i]]);
        return this;
	};
IRender.prototype.setAllProperties = function(t,p,m) {
		for(var i in p)
			t[i]=coalesce(p[i],(m.default?m.default[i]:null));
        return this;
	};
IRender.prototype.setWindow = function(p) {
		this.checkProperties(p,"window");
		this.window=p;
		this.setAllProperties(this.window,p,this.metadata.window);
        return this;
	};
//IRender.prototype.submitButton = function() {
//		return this.input({type:"submit",value:"Submit"});
//	};
IRender.prototype.tag = function(tag,a,n) {
		return "<"+tag+this.attributes(a)+">"+coalesce(n,"")+"</"+tag+">";
};
IRender.prototype.addSVG = function () {
	this.addAction({id:"svg",title:"SVG Editor",type:"svg",pane:"svgEditor"
		,passing:{draw:[{action:"circle",cx:"50",cy:"50",r:"40",stroke:"green","stroke-width":4,fill:"yellow"}
						,{action:"rect",id:"rect",x:1,y:1,width:300,height:100,style:"fill-opacity:0.1;fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)"}
						]}
		})
	.addPane({id:"svgEditor",title:"SVG Editor"
		,header:{right:[{image:"edit",action:"svgOptions"}]}
		})
	.addAction({id:"svgOptions",title:"SVG Options",type:"floatingPane",pane:"svgOptions"})
	.addPane({id:"svgOptions",title:"SVG Options"
			,content:
				[{title:"zoomAndPan",action:"select",children:
					[{action:"option",label:"magnify",value:"magnify"}
					,{action:"option",label:"disable",value:"disable"}
					],
					onchange:function(ev) {this.parent.parent.target.set({zoomAndPan:ev.srcElement.value});}
				}
				,{title:"preserveAspectRatio",action:"select",children:
					[{action:"option",label:"none",value:"none"}
					,{action:"option",label:"xMinYMin",value:"xMinYMin"}
					,{action:"option",label:"xMinYMid",value:"xMinYMid"}
					,{action:"option",label:"xMinYMax",value:"xMinYMax"}
					,{action:"option",label:"xMidYMin",value:"xMidYMin"}
					,{action:"option",label:"xMidYMid",value:"xMidYMid"}
					,{action:"option",label:"xMidYMax",value:"xMidYMax"}
					,{action:"option",label:"xMaxYMin",value:"xMaxYMin"}
					,{action:"option",label:"xMaxYMid",value:"xMaxYMid"}
					,{action:"option",label:"xMaxYMin",value:"xMaxYMin"}
					],
					onchange:function(ev) {this.parent.parent.target.set({preserveAspectRatio:ev.srcElement.value});}
				}
				,{title:"Zoom",children:
					[{action:"input",type:"button",value:"Fit Window",onclick: function(ev) {this.parent.parent.target.zoomAll();}}
					,{action:"input",type:"button",value:"+",onclick: function(ev) {this.parent.parent.target.zoomIn();}}
					,{action:"input",type:"button",value:"-",onclick: function(ev) {this.parent.parent.target.zoomOut();}}
					]}
				]
			})
};
IRender.prototype.addVis = function () {
	this.addPane({id:"vis",title:"vis"})
	.addPane({id:"visConfiguration",title:"vis Configuration",onCloseHide:true})
	.addAction({id:"visConfiguration",title:"Vis Configuration",type:"floatingPane",pane:"visConfiguration"})
	.addAction({id:"vis",title:"vis",type:"pane",pane:"vis",
		setDetail:function (p) {
			let dataset,options,div=createDiv(),module=this.passing.module||"Network";
			p.setDetail(div);
			if(this.passing.config) {
				let nc=createDiv();
				nc.style.height=Math.round(window.innerHeight * 0.80) + 'px'; 
				nc.style.overflow='auto';
				nc.style.height='auto';
				options= Object.assign({configure:{enabled:true,container: nc,showButton:true}},this.passing.options);
				p.headerRow.addRight([{image:"edit",action:"visConfiguration"}]);  
				p.executeHeaderAction("visConfiguration");  //execute to add element so can set content 
				p.centerRow.dependants.visConfiguration.setDetail(nc); //set content to be used by vis
			} else {
				options=this.passing.options;
			}
			try {
				if(module=="Network") {
					dataset=this.passing.dataset ? this.passing.dataset :
						this.passing.data ? {nodes:  new vis.DataSet(this.passing.data.nodes), edges:  new vis.DataSet(this.passing.data.edges)} :
						{nodes:  new vis.DataSet([{id: 1, label: 'No Nodes'}]), edges:  new vis.DataSet([ {from: 1, to: 1}])};
				} else {
					dataset=this.passing.dataset ? this.passing.dataset :
						this.passing.data ? new vis.DataSet(this.passing.data) :
						[
							    {x: '2019-09-13', y: 30, group: 0},
							    {x: '2019-09-14', y: 10, group: 0},
							    {x: '2019-09-15', y: 15, group: 1},
							    {x: '2019-09-16', y: 30, group: 1},
							    {x: '2019-09-17', y: 10, group: 1},
							    {x: '2019-06918', y: 15, group: 1}
							];
				}
				p.network = new vis[module](div,dataset, options);
			} catch(e) {
				p.setError("vis not available, error: "+e.message);
			}
		}
	})
	.addPane({id:"visWithConfig",title:"vis",header:{right:[{image:"edit",action:"visConfiguration"}]}})
	.addAction({id:"visWithConfig",title:"vis",type:"pane",pane:"visWithConfig",
		setDetail:function (p) {
			let div=createDiv();
			p.setDetail(div);
			let nc=createDiv();
			nc.style.height=Math.round(window.innerHeight * 0.80) + 'px'; 
			nc.style.overflow='auto';
			nc.style.height='auto';
			p.executeHeaderAction("visConfiguration");
			p.centerRow.dependants.visConfiguration.setDetail(nc).close();
			try {
				let dataset=this.passing && this.passing.dataset ? this.passing.dataset :
					this.passing && this.passing.data ? new vis.DataSet(this.passing.data) :
						new vis.DataSet([
						    {x: 1, y: 30},
						    {x: 2, y: 10},
						    {x: 3, y: 15},
						    {x: 4, y: 30},
						    {x: 4, y: 10},
						    {x: 4, y: 15}
						]);
				p.graph2d = new vis.Graph2d(div, dataset,{ // need to convert to function which is passed to get data
//					configure:{enabled:true,container: nc}
			});
			} catch(e) {
				p.setError("vis not available, error: "+e.message);
				console.log("vis not available, error: "+e.message +"\n"+e.stack)
			}
		}
	})
};

