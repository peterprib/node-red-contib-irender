function Pane(base,paneProperties={},parentElement,target,action) {
	this.base=base;
	this.parent=parentElement;
	Object.assign(this,paneProperties);
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
				if(!target.hasOwnProperty('dependants'))target.dependants=[];
				target.dependants[action.id]=this;
			} else {
				console.error("expecting target for action "+action.id+" and none found")
			}
		} else
			this.onCloseHide=false;
	}
	this.target=target;
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
		this.close(e);
	};
Pane.prototype.close = function (e) {
		if(this.element.style.display == 'none') return;
		this.styleDisplay=this.element.style.display;
		this.element.style.display = 'none';
		this.closeDependants();
		if(this.onCloseHide) return this;
		this.deleteDependants();
		delete this;
	};
Pane.prototype.closeDependants = function () {
		if(this.hasOwnProperty('dependants')) {
			for(var n in this.dependants)
				this.dependants[n].close();
		}
		
		return this;
	};
Pane.prototype.deleteDependants = function () {
		if(this.hasOwnProperty('dependants')) {
			for(var n in this.dependants)
				delete this.dependants[n];
		}
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
Pane.prototype.getDetailObject = function () {
		return this.centerRow.getDetailObject();
	};
Pane.prototype.getTarget = function () {
		return this.target||this.centerRow.getDetailObject()||this;
	};
Pane.prototype.open = function () {
		this.element.style.display = this.styleDisplay;
		return this;
	};
//Pane.prototype.sizeCenter = function () {
//	this.centerNode.style.height= this.element.clientHeight
//			-(this.headerNode?this.headerNode.element.getBoundingClientRect().Height:0)
//			-(this.footerNode?this.footerNode.element.getBoundingClientRect().Height:0);
//};
Pane.prototype.setDetail = Pane.prototype.appendChild;
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
