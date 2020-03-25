function HeaderRow(base,headerProperties,parentElement,options) {
	Object.assign(this,options,headerProperties);
	if(!(headerProperties.refresh || headerProperties.left || headerProperties.right || headerProperties.title || headerProperties.closable ) ) {
		return;
	}
	this.base=base;
	this.parent=parentElement;
	this.element=createElement("TR",(options&&options.style?options.style:"HeaderRow"),parentElement);
	this.main=css.setClass(document.createElement("TABLE"),"FullSize");
	this.element.appendChild(this.main);
	this.mainRow=document.createElement("TR");
	this.main.appendChild(this.mainRow);
	this.left=createElement("TD","HeaderLeft",this.main);
	this.center=createElement("TD","HeaderCenter",this.main);
	this.setTitle(headerProperties.title||"No Title Set");
	this.right=createElement("TD","HeaderRight",this.main);
	if(headerProperties.closable) addCloseIcon(this,this.right);
	if(headerProperties.right) this.addRight(headerProperties.right);
	if(headerProperties.refresh) this.addRefresh(headerProperties.refresh);
}
HeaderRow.prototype.addRefresh = function (refresh) {
	const headerRow=this,refreshIcon=css.setClass(document.createElement("A"),"icon");
	this.left.appendChild(refreshIcon);
	if(refresh.callFunction) {
		refreshIcon.addEventListener('click',()=>refresh.callFunction.apply(refresh.object,refresh.parameters), false);
	} else {
		throw Error("missing property callFunction");
	}
	refreshIcon.appendChild(this.base.getImage("refreshIcon"));
	refreshIcon.appendChild(this.base.getImage("refreshIconOver","none"));
	refreshIcon.addEventListener('mouseover', ()=>headerRow.setIcon(refreshIcon,"refreshIconOver"), false);
	refreshIcon.addEventListener('mouseout', ()=>headerRow.setIcon(refreshIcon,"refreshIcon"), false);
}
HeaderRow.prototype.addRight = function (action) {
	if(action instanceof Array) {
		action.forEach((c)=>this.addRight(c));
	} else {
		if(action.image) {
			const iconNode=css.setClass(this.base.getImage(action.image),"CellRight");
			if(action.callFunction){
				iconNode.addEventListener('click',()=>action.callFunction.apply(action.object,action.parameters), false);
			} else{
				iconNode.addEventListener('click', this.onclickAction.bind(this), false);
				iconNode.iRenderAction=Object.assign({},this.base.actions[action.action],action);
			}
//			iconNode.iRenderAction=this.base.actions[action.action];
			this.right.insertBefore(iconNode, this.right.firstchild);
		}
	}
};
HeaderRow.prototype.executeAction = function (id) {
	const n=this.getAction(id);
	return n.iRenderAction.exec(this,
			{	pageY:window.pageYOffset + n.getBoundingClientRect().top,
				pageX:window.pageXOffset + n.getBoundingClientRect().left
			});
};
HeaderRow.prototype.getAction = function (id) {
	return this.getActionCell(id,this.left)||this.getActionCell(id,this.right);
};
HeaderRow.prototype.getActionCell = function (id,elements) {
	return elements.find(c=>c.iRenderAction && n.iRenderAction.id==id);
};
HeaderRow.prototype.getTarget = function () {
	return this.parent.IRender.getDetailObject();
};
HeaderRow.prototype.onclickAction = function (ev) {
	ev.stopPropagation();
	ev.currentTarget.iRenderAction.exec(this,ev,this.passing);
};
HeaderRow.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.pane.onclickClose(ev);
};
HeaderRow.prototype.setIcon = function (element,name) {
	let image=element.firstChild;
	while(image){
		if(image.name==name) {
			image.style.display="inline-block";
		} else if(image.style.display!=="none") {
			image.style.display="none";
		}
		image=image.nextSibling;
	}
}
HeaderRow.prototype.setTitle = function (t) {
	while (this.center.firstChild) {
		this.center.removeChild(this.center.firstChild);
	}
	this.center.appendChild(createNode("\u00a0"+t+"\u00a0"));
};