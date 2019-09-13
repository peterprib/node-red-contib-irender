
function PaneRow(b,p,n) {
	this.element=css.setClass(document.createElement("TR"),"TableRow");
	n.appendChild(this.element);
	this.center=document.createElement("TD");
	this.centerCell=new Pane(b,p,n);
	this.element.appendChild(this.centerCell.element);
}
function TabPane(b,p,parent) {
	this.base=b;
	this.element=parent;
	this.tabs=createTable();
	this.tabsRow=createTableRow(this.tabs);
	this.panes=css.setClass(createTable(),"Table");
	this.panesRow=css.setClass(createTableRow(this.panes),"Row");
	this.table=css.setClass(createTable(2,1),"Table");
	this.table.rows[0].style.height="30px";
	this.tabsHide();
	this.table.rows[0].cells[0].appendChild(this.tabs);
	this.table.rows[1].cells[0].appendChild(this.panes);
	css.setClass(this.table.rows[1].cells[0],"TabPaneCell");
	this.element.appendChild(this.table);
}
TabPane.prototype.close = function () {
	while(this.tabsRow.cells.length>0) {
		this.closeTab(0);
	}
}
TabPane.prototype.closeTabTitle = function (t) {
		this.closeTab(this.find(t));
}
TabPane.prototype.closeTab = function (i) {
		this.activeTab=null;
		try{
			this.panesRow.cells[i].firstChild.IRender.close();
		} catch(e) {}
		this.panesRow.deleteCell(i);
		this.tabsRow.deleteCell(i);
		if(this.tabsRow.cells.length<1) return;
		if(i>=this.tabsRow.cells.length) i--;
		this.setCurrent(i);
	};
TabPane.prototype.onclick = function (ev) {
	this.hideCurrent();
	this.setCurrent(ev.currentTarget.cellIndex);
};
TabPane.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.closeTabTitle(ev.currentTarget.parentElement.innerText); //ev.currentTarget.cellIndex||
};
TabPane.prototype.setCurrent = function (i) {
	if(i<0) {
		this.activeTab=null;
		return;
	}
	this.panesRow.cells[i].style.display = 'table-cell';
	this.tabsRow.cells[i].style.backgroundColor="LightGrey";
	this.activeTab=i;
};
TabPane.prototype.hideCurrent = function (e) {
		try{
			this.panesRow.cells[this.activeTab].style.display = 'none';
			this.tabsRow.cells[this.activeTab].style.backgroundColor="";
			this.panesRow.cells[this.activeTab].firstChild.IRender.closeDependants();
		} catch(e) {}
		this.activeTab=null;
	};
TabPane.prototype.setFullSize = function (n) {
		var c=this.panesRow.cells[this.activeTab];
		if(n==undefined) {
			n=c.lastChild;
		}
		n.style.width=c.clientWidth+"px";
		n.style.height=c.clientHeight+"px";
		return this;
	};
TabPane.prototype.find = function (t,f) {
		for(var i=0; i<this.tabsRow.cells.length;i++ ) {
			if(this.tabsRow.cells[i].firstChild.innerText==t) return i
		}
		return null
	};
TabPane.prototype.setDetail = function (t,n) {
		this.hideCurrent();
		var i=this.find(t);
		if(i!==null) {
			this.activeTab=i;
			while (this.panesRow.cells[i].firstChild) {
				this.panesRow.cells[i].removeChild(this.panesRow.cells[i].firstChild);
			}
			this.panesRow.cells[i].appendChild(n);
			this.setCurrent(i);
			return this;
		}
		var ct=css.setClass(createTableCell(this.tabsRow),"Tab")
			,cp=css.setClass(createTableCell(this.panesRow),"TabDetail");
		ct.addEventListener('click', this.onclick.bind(this), false);	
		var ctt=createElement("a","MenuText",ct);
		ctt.innerText=t;
		addCloseIcon(this,ct);
		this.setCurrent(this.tabsRow.cells.length-1);
		n.iRender={tabPane:this,title:t};
		cp.appendChild(n);
		if(this.tabsRow.cells.length>1) this.tabsUnhide();
		n.IRenderTab=ct;
		return this;
	};
TabPane.prototype.tabsHide = function () {
		this.table.rows[0].style.display="none";
	};
TabPane.prototype.tabsUnhide = function () {
		this.table.rows[0].style.display="table-row";;
	};
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
function Window (b,p,n) {
	this.element=css.setClass(createTable(),"Table");
	if(p.title) document.title=p.title;
	this.headerRow=new HeaderRow(b,p,this.element,{style:"HeaderMain"});
	this.centerRow=new PaneRow(b,b.panes[p.pane],this.element);	
	this.footerRow=new FooterRow(b,p,this.element,{style:"FooterMain"});
	n.append(this.element);
	b.floatHandle=n;
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
			action: {id:null,type:["link","pane","svg","googleMap"],url:null,title:null,target:null,pane:null,passing:null,setDetail:null}
			,image: {id:null ,file:null}
			,menu: {id:null ,options:{"default":Array.constructor}}
			,menuOption: {title:null ,action:null ,passing:null}
			,pane: {id:null ,title:null, leftMenu:null,show:null ,closable:null, onCloseHide:null ,header:null ,footer:null, content:null}
			,window: {title:{"default":"No Title Specified"},footer:{"default":"No Footer Specified"},pane:null}
		};
	this.panes={};
	this.window={};
	this.menus={};
	this.images={
		file:"file.gif",folderOpen:"folderOpen.gif",folderClose:"folderClose.gif",
		loadingPage:"loadingpage_small.gif",closeIcon:"close_s.gif",
		cancel:"icon-cancel.gif",alert:"icon-alert.gif",error:"icon-error.gif",edit:"icon-edit.gif"
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
		this.checkProperties(p,"menuOption");
		if(!(m in this.menus)) throw Error("menu not found for "+m)
		this.menus[m].options.push(p);
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
	this.addAction({id:"visConfiguration",title:"Vis Configuration",type:"floatingPane",pane:"visConfiguration"})
	.addPane({id:"visConfiguration",title:"vis Configuration",onCloseHide:true})
	.addAction({id:"vis",title:"vis",type:"pane",pane:"vis",
		setDetail:function (p) {
				var div=createDiv();
				p.setDetail(div);
				if(this.passing.config) {
					var nc=createDiv();
					nc.style.height=Math.round(window.innerHeight * 0.80) + 'px'; 
					nc.style.overflow='auto';
					var options= Object.assign({configure:{enabled:true,container: nc,showButton:true}},this.passing.options);
					p.headerRow.addRight([{image:"edit",action:"visConfiguration"}]);
					p.executeHeaderAction("visConfiguration").dependants.visConfiguration.setDetail(nc);
				} else
					var options=this.passing.options;
				p.network = new vis[this.passing.module||"Network"](div,this.passing.dataset, options);
			}
	})
	.addPane({id:"visInline",title:"vis",header:{right:[{image:"edit",action:"visConfiguration"}]}})
	.addPane({id:"vis",title:"vis"});

	this.addAction({id:"visInlineg2d",title:"vis",type:"pane",pane:"visInline",
			setDetail:function (p) {
				var div=createDiv();
				p.setDetail(div);
				var nc=createDiv();
				nc.style.height=Math.round(window.innerHeight * 0.80) + 'px'; 
				nc.style.overflow='auto';
				p.executeHeaderAction("visConfiguration").dependants.visConfiguration.setDetail(nc);
				var network = new vis.Graph2d(div, g2data,{ // need to convert to function which is passed to get data
						configure:{enabled:true,container: nc}
			});
			}
		})
};

