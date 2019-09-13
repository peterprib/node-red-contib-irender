function Form(parent,parentElement) {
	this.element=createTable();
	this.activeFilter=[];
	this.parent=parent;
	if(parentElement) parentElement.appendChild(this.element);
}
Form.prototype.addItem = function (p,m,t) {
	if(p instanceof Array) {
		return this.addItems(p,m,t);
	}
	var r=createTableRow(this.element);
	if(m) r.mapping=m
	if(t) r.filterTags=(t instanceof Array? t : [t]);
	createTableCell(r).appendChild(createNode(p.title));
	createTableCell(r).appendChild(this.action(p));
	return this;
};
Form.prototype.addItems = function (p,m,t) {
	p.forEach((r)=>this.addItem(r,m,t));
	return this;
};
Form.prototype.applyFilter = function (f) {
		if(f) this.activeFilter=(f instanceof Array? f : [f]);
		row:for(var t,f, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].filterTags) {
				f=this.element.rows[i].filterTags;
				for (var c in f) {
					var t=this.activeFilter.indexOf(f[c]);
					if(this.activeFilter.indexOf(f[c])<0) {
						this.element.rows[i].style.display="none";
						continue row;
					}
				}
				this.element.rows[i].style.display="table-row";
			}
		}
	};
//Form.prototype.button = function (p,t) {
		//this.action(Object.assign({action:"input",type:"button"},p),t)
//	};
Form.prototype.input = function (p,m,t) {
		return this.addItem(Object.assign({action:"input"},p),m,t);
	};
Form.prototype.options = function (s,p) {
		for(var o in p.options) {
			s.appendChild(this.set(document.createElement(p.action),Object.assign(e,p.options[o])));
		}
	};
Form.prototype.select = function (p,m,t) {
	return this.addItem(Object.assign({action:"select"},p),m,t);
	};

Form.prototype.getMapping = function () {
		for(var r={}, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].mapping) {
				r[this.element.rows[i].mapping]=this.getValue(i);
			}
		}
		return r;
	};
Form.prototype.setMapping = function (p) {
		if(p== null) {
			console.error("form set mapping no properties provided");
			return;
		}
		for(var m, i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].mapping) {
				m=this.element.rows[i].mapping;
				if(m in p) {
					this.setValue(i,p[m]);
				}
			}
		}
		return this;
	};
Form.prototype.getTitleRow = function (t) {
		for(var i=0;i<this.element.rows.length;i++) {
			if(this.element.rows[i].cell[0].innerText==t) {
				return this.element.rows[i];
			}
		}
		throw Error("form title not found for "+t);
	};
Form.prototype.getTitleInputCell = function (t) {
		return this.getTitleRow(t).cell[1];
	};
Form.prototype.getTitleInput = function (t) {
		return this.getTitleInputCell(t).firstChild;
	};
Form.prototype.getValue = function (i) {
		var e=this.element.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT": return e.value;
			case "SELECT": return e.options[e.selectedIndex].value;
		}
		console.error("Form getValue unknown: "+e.nodeName)
	};

Form.prototype.setValue = function (i,v) {
		var e=this.element.rows[i].cells[1].firstChild;
		switch(e.nodeName) {
			case "INPUT":
				if(e.type=="color" && !v.startsWith("#")) {
					if(v.startsWith("rgb(")) {
						v=eval(v);
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
Form.prototype.setTitle = function (t,v) {
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
Form.prototype.action = function (p) {
		if(typeof p === 'array') {
			var span=document.createElement("span");
			for(var i=0;i<p.length;i++) {
				span.appendChild(this.action(p[i]));
			}
			return span
		}
		if(typeof p === 'object') 
			return this.set(document.createElement(p.action),Object.assign(p,{draggable:true}),{action:null,title:null});
		return createNode(p);
	};
Form.prototype.set = function (e,o,r) {
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
						a.function.apply(this, [e])
					}
				}
				continue
			}
			e.setAttribute(p,a);
		}
		return e;
	};

