function CenterRow(parent,base,centerProperties,parentElement,options) {
	this.parent=parent;
	this.base=base;
	this.element=createElement("TR",(options&&options.style?options.style:"CenterRow"),parentElement);
	this.centerCell=createElement("TD",null,this.element);
	this.table=css.setClass(createTable(1,2),"Table");
	if(coalesce(centerProperties.tab,true)) {
		this.tabPane = new TabPane(base,centerProperties,this.table.rows[0].cells[1]);
	}
	if(centerProperties.hasOwnProperty("leftMenu")) {
		this.menu=new Menu(base,base.menus[centerProperties.leftMenu],this.table.rows[0].cells[0],this.tabPane);
	} else {
		this.table.rows[0].cells[0].style.display = 'none';
	}
	this.centerCell.appendChild(this.table);
	this.detail=this.table.rows[0].cells[1]
}
CenterRow.prototype.appendChild = function (n) {
	this.detail.appendChild(n);
};
CenterRow.prototype.getDetail = function () {
	return this.detail;
};
CenterRow.prototype.getDetailObject = function () {
	return this.detail.firstChild.IRender||this;
};
CenterRow.prototype.getTarget = function () {
	return this.parent.getTarget();
};
CenterRow.prototype.content = function (c) {
	if(c instanceof Array) {
//		this.contentDetail=new IForm(this,this.detail,null,{target:this.getTarget()}).addItem(c);
		this.contentDetail=new Form(this,this.detail).addItem(c);
	}
};
CenterRow.prototype.setDetail = function (title,n) {
	return this.tabPane.setDetail(title,n);
};
CenterRow.prototype.setLoading = function () {
	this.replaceDetail(this.base.getLoadingPane());
};
CenterRow.prototype.replaceDetail = function (n) {
	while (this.detail.firstChild) {
		if(this.detail.firstChild.IRender) this.detail.firstChild.IRender.close();
		this.detail.removeChild(this.detail.firstChild);
	}
	this.detail.appendChild(n);
};
