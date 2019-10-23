function MenuOption(base,p,parent) {
	this.base=base;
	Object.assign(this,p);
	this.actionObject=this.base.actions[this.executeAction]||this.base.actions.actionNotDefined;
	this.element=createElement("TR","MenuOption",parent);
	this.parent=parent;
	this.expandCell=createElement("TD",null,this.element);
	this.iconCell=createElement("TD",null,this.element);
	this.textCell=createElement("TD",null,this.element);
	this.element.iRender= p;
	this.element.addEventListener('click', this.onclick.bind(this), false);
	switch(p.executeAction) {
		case "folder":
			this.collapse();
			break;
		case "states":
			this.state=0;
			this.iconCell.appendChild(this.base.getImage(this.actionObject.passing[0].image));
			break;
		default:
			this.iconCell.appendChild(this.base.getImage(coalesce(p.image,"file")));
	}
	this.textA=createElement("a","MenuText",this.textCell);
	this.textA.innerText=coalesce(this.title,(this.actionObject?this.actionObject.title:null),"*** no title specifed *** ");
	this.properties=p;
}
MenuOption.prototype.collapse = function () {
	this.expandCell.innerText="+";
	try{
		this.iconCell.removeChild(this.iconCell.firstChild);
	} catch(ex) {}
	this.iconCell.appendChild(this.base.getImage("folderClose"));
	if(this.textCell.childElementCount>1) this.textCell.lastChild.style.display="none";
	return this;
};
MenuOption.prototype.expand = function (b) {
	this.expandCell.innerText="-";
	this.iconCell.removeChild(this.iconCell.firstChild);
	this.iconCell.appendChild(this.base.getImage("folderOpen"));
	if(this.textCell.lastChild.nodeName=="TABLE") {
		this.textCell.lastChild.style.display="TABLE";
		return this;
	}
	if (!("menu" in this.passing)) throw Error("no menu entry specified in passing options");
	this.menu=new Menu(this.base,Object.assign({subMenu:true},this.base.menus[this.passing.menu]),this.textCell,this.parent.target);
	return this;
};
MenuOption.prototype.isExpanded = function () {
	return (this.expandCell.innerText=="-");
};
MenuOption.prototype.nextState = function (a) {
	if(this.iconCell.firstChild) this.iconCell.removeChild(this.iconCell.firstChild);
	if(++this.state>=a.passing.length) this.state=0;
	let state=a.passing[this.state];
	this.iconCell.appendChild(this.base.getImage(state.image));
	if(state.call) {
		state.call.apply(state.object||state,state.parameters);
	}
};
MenuOption.prototype.onclick = function (ev) {
	ev.stopPropagation();
	this.actionObject.exec(this,ev,this.passing);
};
MenuOption.prototype.setFocus = function (t,n) {
	return this.parent.setFocus(coalesce(this.title,t),n);
};
MenuOption.prototype.setDetail = function (t,n) {
	return this.parent.setDetail(coalesce(this.title,t),n);
};
MenuOption.prototype.toogle = function () {
	return this.isExpanded()?this.collapse():this.expand();
};