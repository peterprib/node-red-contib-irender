function Pane(base,paneProperties={},parentElement,target,action) {
	Object.assign(this,paneProperties,{base:base,dependants:[],parent:parentElement,target:target,action:action});
	this.element=css.setClass(createTable(),"Table");
	this.element.IRender=this;
	let header=Object.assign({},paneProperties.header||{},{closable:paneProperties.closable ,title:paneProperties.title,pane:this});
	if(header) this.headerRow=new HeaderRow(base,header,this.element,{style:"Header"});
	this.centerRow=new CenterRow(this,base,paneProperties,this.element);
	if(paneProperties.hasOwnProperty("footer")) this.footerRow=new FooterRow(base,paneProperties,this.element,{style:"Footer"});
	if(parentElement) parentElement.appendChild(this.element);
	if(paneProperties.hasOwnProperty("content")) this.centerRow.content(paneProperties.content);
//	this.onCloseHide=p.onCloseHide||false;
	if(this.onCloseHide) {
		if(action) {
			if(target) {
				target.parent.setDependant(this);
			} else {
				console.error("expecting target for action "+action.id+" and none found")
			}
		} else
			this.onCloseHide=false;
	}
	if(this.initiallyHide) {
		this.hide();
	}
}
Pane.prototype.findDependant = function (id) {
	return this.dependants.find(({action})=>action.id==id);
}
Pane.prototype.openDependant = function (id) {
	const p=this.findDependant(id);
	if(p) {
		p.open();
		return true;
	} else {
		return false;
	}
}
Pane.prototype.setDependant = function (node) {
	this.dependants.push(node);
}
Pane.prototype.appendChild = function (n) {
	this.centerRow.appendChild(n);
	return this;
};
Pane.prototype.onclickClose = function (e) {
	if(this.element && this.element.iRender && this.element.iRender.tabPane ) {
		this.element.iRender.tabPane.closeTabTitle(this.element.iRender.title);
		return;
	}
	this.close();
};
Pane.prototype.close = function () {
	if(this.onCloseHide) {
		this.hide();
		return this;
	}
	this.remove();
};
Pane.prototype.closeDependants = function () {
	this.dependants.forEach((c)=>c.close());
	return this;
};
Pane.prototype.executeHeaderAction = function (id) {
	if(this.headerRow) {
		this.headerRow.executeAction(id);
	}
	return this;
};
Pane.prototype.getAction = function (id) {
	if(this.headerRow) {
		return this.headerRow.getAction(id);
	}
};
Pane.prototype.getDetail = function () {
	return this.centerRow.getDetail();
};
Pane.prototype.getDetailObject = function () {
	return this.centerRow.getDetailObject();
};
Pane.prototype.getTarget = function () {
	return this.target||this.centerRow.getDetailObject()||this;
};
Pane.prototype.hide = function () {
	if(this.element.style.display == 'none') return;
	this.styleDisplay=this.element.style.display;
	this.element.style.display = 'none';
	this.closeDependants();
};
Pane.prototype.display = function () {
	if(this.element.style.display == 'table') return;
	this.styleDisplay=this.element.style.display;
	this.element.style.display = 'table';
//	this.displayDependants();
};
Pane.prototype.open = function () {
	this.element.style.display = this.styleDisplay;
	return this;
};
Pane.prototype.onLoadError = Pane.prototype.setError;
//Pane.prototype.sizeCenter = function () {
//	this.centerNode.style.height= this.element.clientHeight
//			-(this.headerNode?this.headerNode.element.getBoundingClientRect().Height:0)
//			-(this.footerNode?this.footerNode.element.getBoundingClientRect().Height:0);
//};
Pane.prototype.remove = function () {
	this.removeDependants();
	if(this.element) this.element.remove()
	delete this;
};
Pane.prototype.removeDependants = function () {
	this.dependants.forEach((c)=>c.remove());
	return this;
};
Pane.prototype.setDetail = function() {
	if(arguments.length>1) {
		this.setTitle(arguments[0]);
		this.centerRow.replaceDetail(arguments[1]);
	} else {
		this.centerRow.replaceDetail(arguments[0]);
	}
	return this;
};
Pane.prototype.setError = function(error) {
	let div=css.setClass(createDiv(),"ErrorDetail");
	div.appendChild(this.base.getImage("alertBig"));
	div.appendChild(createNode(error));
	this.centerRow.replaceDetail(div);
	return this;
}
Pane.prototype.setFullSize = function (n) {
	n.style.width=this.element.clientWidth+"px";
	n.style.height=this.element.clientHeight+"px";
	return this;
};
Pane.prototype.setLoading = function () {
	this.centerRow.setLoading();
//	this.base.setLoading(this.getTarget());
	return this;
};
Pane.prototype.setTitle = function (t) {
	this.headerRow.setTitle(t);
	return this;
};