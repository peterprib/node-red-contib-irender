function IForm(parent,node,title,options) {
	this.element=css.createElement(node||document.getElementsByTagName("body")[0],"TABLE","Table");
	this.activeFilter=[];
	this.parent=parent;
	try{
		if("target" in (options||{})) {
			this.target=options.target;
		} else {
			this.target=parent.getTarget();
		}
	}  catch(e) {
		this.target=this.parent;
	}
	if(title || options && options.title) {
		this.header=css.createElement(this.element,"TR","Header")
		this.header.appendChild(document.createTextNode(title))
		this.closeIcon=css.setClass(this.getIconImage("close_s.gif"),"CloseIcon");
		this.header.appendChild(this.closeIcon);
		this.closeIcon.addEventListener('click', this.onclickClose.bind(this), false);
		this.element.draggable=true;
		this.element.addEventListener('dragstart', dragStart.bind(this), false);
	}
	this.core=css.createElement(this.element,"TR","DetailPane");
	if(title || options && options.footer) {
		this.footer=css.createElement(this.element,"TR","Footer");
	}
	this.data=css.createElement(this.core,"TABLE","Table");
}
IForm.prototype.action = function (p) {
	if(typeof p === 'array') {
		var span=document.createElement("span");
		for(var i=0;i<p.length;i++) {
			span.appendChild(this.action(p[i]));
		}
		return span
	}
	if(typeof p === 'object') {
		var e= document.createElement(p.action)
		if(p.action && p.action.toUpperCase()=="TEXTAREA") {
			e.append(document.createTextNode(p.value));
		}
		return this.set(e,Object.assign(p,{draggable:true}),{action:null,title:null});

	}
	return document.createTextNode(p);
};
IForm.prototype.addItem = function (p,m,t) {
	if(p instanceof Array) {
		for(var i=0;i<p.length;i++) {
			this.addItem(p[i]);
		}
		return this;
	}
	var r=createTableRow(this.data);
	createTableCell(r).appendChild(document.createTextNode(p.title));
	createTableCell(r).appendChild(this.action(p));
	if(m) r.mapping=m
	if(t) r.filterTags=(t instanceof Array? t : [t]);
	return this;
};
IForm.prototype.applyFilter = function (f) {
	if(f) this.activeFilter=(f instanceof Array? f : [f]);
	row:for(var t,f, i=0;i<this.data.rows.length;i++) {
		if(this.data.rows[i].filterTags) {
			f=this.data.rows[i].filterTags;
			for (var c in f) {
				var t =this.activeFilter.indexOf(f[c]);
				if(this.activeFilter.indexOf(f[c])<0) {
					this.data.rows[i].style.display="none";
					continue row;
				}
			}
			this.data.rows[i].style.display="table-row";
		}
	}
};
//IForm.prototype.button = function (p,t) {
	//this.action(Object.assign({action:"input",type:"button"},p),t)
//};

IForm.prototype.display = function () {
	this.element.style.display="block";
	return this;
};
IForm.prototype.getBoundingClientRect = function() {
	return this.parent.getBoundingClientRect();
};
IForm.prototype.getIconImage = function (n) {
	var i = new Image(16,16);
	i.src="images/"+n;
	i.alt="X";
	return i;
};
IForm.prototype.getTarget = function () {
	return this.target;
};
IForm.prototype.getMapping = function () {
	for(var r={}, i=0;i<this.data.rows.length;i++) {
		if(this.data.rows[i].mapping) {
			r[this.data.rows[i].mapping]=this.getValue(i);
		}
	}
	return r;
};
IForm.prototype.getTitleRow = function (t) {
	for(var i=0;i<this.data.rows.length;i++) {
		if(this.data.rows[i].cell[0].innerText==t) {
			return this.data.rows[i]
		}
	}
	throw Error("form title not found for "+t);
};
IForm.prototype.getTitleInputCell = function (t) {
	return this.getTitleRow(t).cell[1];
};
IForm.prototype.getTitleInput = function (t) {
	return this.getTitleInputCell(t).firstChild;
};
IForm.prototype.getValue = function (i) {
	var e=this.data.rows[i].cells[1].firstChild;
	switch(e.nodeName) {
		case "INPUT": return e.value;
		case "SELECT": return e.options[e.selectedIndex].value;
	}
	console.error("Form getValue unknown: "+e.nodeName)
};
IForm.prototype.input = function (p,m,t) {
	return this.addItem(Object.assign({action:"input"},p),m,t);
};
IForm.prototype.movePane = function (p) {
	const rect = this.element.getBoundingClientRect();
	this.positionAbsolute({x:rect.left+p.x,y:rect.top+p.y});
	this.setMaxPaneSize();
};
IForm.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.element.parentNode.removeChild(this.element);
	if(this.parentRemove) this.parentRemove();
	delete this.element;
}
IForm.prototype.options = function (s,p) {
	for(var o in p.options) {
		s.appendChild(this.set(document.createElement(p.action),Object.assign(e,p.options[o])));
	}
	return this;
};
IForm.prototype.positionAbsolute = function (p) {
	this.element.style.left=p.x+"px";
	this.element.style.top=p.y+"px";
	this.element.style.position="absolute";
	return this;
};
IForm.prototype.select = function (p,m,t) {
	return this.addItem(Object.assign({action:"select"},p),m,t);
};
IForm.prototype.setRemove = function (f) {
	this.parentRemove=f;
	return this;
};
IForm.prototype.set = function (e,o,r) {
	var a;
	for (var p in o) {
		a=o[p];
		if(r && p in r) {
			if(r.p==null) continue;
			this[p](e,a);
			continue;
		}
		if(a instanceof Array) {
			if(p=="children") {
				for(var l=a.length,i=0;i<l;i++) {
					e.appendChild(this.action(a[i]));
				}
				continue;
			}
			for(var l=a.length,i=0;i<l;i++) {
				e.appendChild(this.action(Object.assign({action:p},a[i])));
			}
			continue;
		}
		if(a instanceof Function) {
			e.addEventListener((p.substr(0,2)=="on"?p.substr(2):p), a.bind(this), false);
			continue;
		}
		if(a instanceof Object) {
			for(var p1 in a) {
				if(p1=="function") {
					a.function.apply(this, [e]);
				}
			}
			continue;
		}
		e.setAttribute(p,a);
	}
	return e;
};
IForm.prototype.setMapping = function (p) {
	if(p== null) {
		console.error("form set mapping no properties provided");
		return;
	}
	for(var m, i=0;i<this.data.rows.length;i++) {
		if(this.data.rows[i].mapping) {
			m=this.data.rows[i].mapping;
			if(m in p) {
				this.setValue(i,p[m]);
			}
		}
	}
	return this;
};
IForm.prototype.setMaxPaneSize = function () {
	const p = this.element.getBoundingClientRect()
		,w=this.parent.element.getBoundingClientRect()
	if(w.width<p.right) this.element.style.width=(w.width-p.left)+"px";
		if(w.height<p.bottom) this.element.style.height=(w.height-p.top)+"px";
};
IForm.prototype.setTitle = function (t,v) {
	var e=this.getTitleInput(t).value=v;
	switch(e.nodeName) {
		case "INPUT":
			e.value=v;
			break;
		case "SELECT":
			for(var i in e.options) {
				if(e.options[i].value==v) {
					var j=i;
				} else {
					if(e.options[i].selected) delete e.options[i].selected;
				}
			}
			break;
		default: 
			console.error("Form set title element type unknown: "+e.nodeName)
	}
	return this;
};
IForm.prototype.setValue = function (i,v) {
	var e=this.data.rows[i].cells[1].firstChild;
	switch(e.nodeName) {
		case "INPUT":
			if(e.type=="color" && !v.startsWith("#")) {
				if(v.startsWith("rgb(")) {
					v=eval("this."+v);
				} else {
					if(!(v in colors)) throw Error("color not found for "+v);
					v=colors[v];
				}
			}
			e.value=v; 
			return;
		case "SELECT":
			for(var i=0;i<e.options.length;i++) {
				if(e.options[i].value==v) {
					e.options[i].selected=true;
					return;
				}
			}
			console.error("Form setValue unknown select: "+v);
			return this;
	}
	console.error("Form setValue unknown: "+e.nodeName);
	return this;
};


