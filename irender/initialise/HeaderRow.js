function HeaderRow(base,headerProperties,parentElement,options) {
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
	this.center.appendChild(createNode("\u00a0"+(headerProperties.title||"No Title Set")+"\u00a0"));
	this.right=createElement("TD","HeaderRight",this.main);
	if(headerProperties.closable) addCloseIcon(this,this.right);
	if(headerProperties.right) this.addRight(headerProperties.right);
}
HeaderRow.prototype.addRight = function (right) {
	for(var i in right) {
		var icon=right[i];
		if("image" in icon) {
			var iconNode=css.setClass(this.base.getImage(icon.image),"CellRight");
			iconNode.addEventListener('click', this.onclickAction.bind(this), false);
			iconNode.iRenderAction=this.base.actions[icon.action];
			this.right.insertBefore(iconNode, this.right.firstchild);
		}
	}
};
HeaderRow.prototype.executeAction = function (id) {	
	this.executeActionCell(id,this.left);
	this.executeActionCell(id,this.right);
};
HeaderRow.prototype.executeActionCell = function (id,c) {
	for(var n,i=0;i<c.childNodes.length;i++) {
		n=c.childNodes[i];
		if(!n.hasOwnProperty('iRenderAction')) continue;
		if(n.iRenderAction.id!=id) continue;
		return n.iRenderAction.exec(this,
			{	pageY:window.pageYOffset + n.getBoundingClientRect().top,
				pageX:window.pageXOffset + n.getBoundingClientRect().left
			});
	}
};
HeaderRow.prototype.getTarget = function () {
	return this.parent.IRender.getDetailObject();
};
HeaderRow.prototype.onclickAction = function (ev) {
	ev.stopPropagation();
	var action=ev.currentTarget.iRenderAction
	action.exec(this,ev,this.passing);
};
HeaderRow.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.pane.onclickClose(ev);
};
