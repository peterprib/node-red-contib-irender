function HeaderRow(base,headerProperties,parentElement,options) {
	if(!(headerProperties.right || headerProperties.title || headerProperties.closable ) ) {
		return;
	}
	this.base=base;
	this.parent=parentElement;
	Object.assign(this,options,headerProperties);
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
}
HeaderRow.prototype.addRight = function (action) {
	if(action instanceof Array) {
		action.forEach((c)=>this.addRight(c));
	} else {
		if(action.image) {
			const iconNode=css.setClass(this.base.getImage(action.image),"CellRight");
			iconNode.addEventListener('click', this.onclickAction.bind(this), false);
			iconNode.iRenderAction=Object.assign({},this.base.actions[action.action],action);
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
HeaderRow.prototype.getActionCell = function (id,c) {
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
HeaderRow.prototype.setTitle = function (t) {
	while (this.center.firstChild) {
		this.center.removeChild(this.center.firstChild);
	}
	this.center.appendChild(createNode("\u00a0"+t+"\u00a0"));
};