function MenuOption(b,p,parent) {
	this.base=b;
	Object.assign(this,p);
	this.actionObject=this.base.actions[this.action]||this.base.actions.actionNotDefined;
	this.element=createElement("TR","MenuOption",parent);
	this.parent=parent;
	this.expandCell=createElement("TD",null,this.element);
	this.iconCell=createElement("TD",null,this.element);
	this.textCell=createElement("TD",null,this.element);
	this.element.iRender= p;
	this.element.addEventListener('click', this.onclick.bind(this), false);
	switch(p.action) {
		case "folder":
			this.setCollapsed();
			break;
		case "states":
			this.state=0;
			this.iconCell.appendChild(this.base.getImage(this.actionObject.passing[0].image));
			break;
		default:
			this.iconCell.appendChild(b.getImage(coalesce(p.image,"file")));
	}
	this.textA=createElement("a","MenuText",this.textCell);
	this.textA.innerText=coalesce(this.title,(this.actionObject?this.actionObject.title:null),"*** no title specifed *** ");
	this.properties=p;
}
MenuOption.prototype.nextState = function (a) {
		this.iconCell.removeChild(this.iconCell.firstChild);
		if(++this.state>=a.passing.length) this.state=0;
		this.iconCell.appendChild(this.base.getImage(a.passing[this.state].image));
	};
MenuOption.prototype.isExpanded = function () {
		return (this.expandCell.innerText=="-");
	};
MenuOption.prototype.setExpanded = function (b) {
		this.expandCell.innerText="-";
		this.iconCell.removeChild(this.iconCell.firstChild);
		this.iconCell.appendChild(this.base.getImage("folderOpen"));
		
		if(this.textCell.lastChild.nodeName=="TABLE") {
			this.textCell.lastChild.style.display="TABLE";
			return;
		}
		if (!("menu" in this.passing)) throw Error("no menu entry specified in passing options");
		this.menu=new Menu(this.base,Object.assign({subMenu:true},this.base.menus[this.passing.menu]),this.textCell,this.parent.target);
	};
MenuOption.prototype.setCollapsed = function () {
		this.expandCell.innerText="+";
		try{
			this.iconCell.removeChild(this.iconCell.firstChild);
		} catch(ex) {}
		this.iconCell.appendChild(this.base.getImage("folderClose"));
		if(this.textCell.childElementCount>1) this.textCell.lastChild.style.display="none";
	};
MenuOption.prototype.setFocus = function (t,n) {
		return this.parent.setFocus(coalesce(this.title,t),n);
	};
MenuOption.prototype.setDetail = function (t,n) {
		return this.parent.setDetail(coalesce(this.title,t),n);
	};
MenuOption.prototype.onclick = function (ev) {
		ev.stopPropagation();
		this.actionObject.exec(this,ev,this.passing);
	};
