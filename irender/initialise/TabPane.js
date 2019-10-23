function TabPane(b,p,parent) {
	this.base=b;
	this.element=parent;
	this.tabs=createTable();
	this.tabsRow=createTableRow(this.tabs);
	this.panes=css.setClass(createTable(),"Table");
	this.panesRow=css.setClass(createTableRow(this.panes),"Row");
	this.table=css.setClass(createTable(2,1),"Table");
	this.table.rows[0].style.height="30px";
	this.tabsHide();
	this.table.rows[0].cells[0].appendChild(this.tabs);
	this.table.rows[1].cells[0].appendChild(this.panes);
	css.setClass(this.table.rows[1].cells[0],"TabPaneCell");
	this.element.appendChild(this.table);
}
TabPane.prototype.find = function (t) {
	for(var i=0; i<this.tabsRow.cells.length;i++ ) {
		if(this.tabsRow.cells[i].firstChild.innerText==t) return i
	}
	return null
};
TabPane.prototype.hideCurrent = function (e) {
	try{
		this.panesRow.cells[this.activeTab].style.display = 'none';
		this.tabsRow.cells[this.activeTab].style.backgroundColor="";
		this.panesRow.cells[this.activeTab].firstChild.IRender.closeDependants();
	} catch(e) {}
	this.activeTab=null;
};
TabPane.prototype.onclick = function (ev) {
	this.hideCurrent();
	this.setCurrent(ev.currentTarget.cellIndex);
};
TabPane.prototype.onclickClose = function (ev) {
	ev.stopPropagation();
	this.removeTabTitle(ev.currentTarget.parentElement.innerText); //ev.currentTarget.cellIndex||
};
TabPane.prototype.remove = function () {
	while(this.tabsRow.cells) {
		this.removeTab(0);
	}
}
TabPane.prototype.removeTab = function (i) {
	this.activeTab=null;
	try{
		this.panesRow.cells[i].firstChild.IRender.remove();
	} catch(e) {}
	this.panesRow.deleteCell(i);
	this.tabsRow.deleteCell(i);
	if(this.tabsRow.cells.length<1) return;
	if(i>=this.tabsRow.cells.length) i--;
	this.setCurrent(i);
};
TabPane.prototype.removeTabTitle = function (t) {
	this.removeTab(this.find(t));
}
TabPane.prototype.setCurrent = function (i) {
	if(i<0) {
		this.activeTab=null;
		return;
	}
	this.panesRow.cells[i].style.display = 'table-cell';
	this.tabsRow.cells[i].style.backgroundColor="LightGrey";
	this.activeTab=i;
};
TabPane.prototype.setDetail = function (t,n) {
	this.hideCurrent();
	var i=this.find(t);
	if(i!==null) {
		this.activeTab=i;
		while (this.panesRow.cells[i].firstChild) {
			this.panesRow.cells[i].removeChild(this.panesRow.cells[i].firstChild);
		}
		this.panesRow.cells[i].appendChild(n);
		this.setCurrent(i);
		return this;
	}
	var ct=css.setClass(createTableCell(this.tabsRow),"Tab")
		,cp=css.setClass(createTableCell(this.panesRow),"TabDetail");
	ct.addEventListener('click', this.onclick.bind(this), false);	
	var ctt=createElement("a","MenuText",ct);
	ctt.innerText=t;
	addCloseIcon(this,ct);
	this.setCurrent(this.tabsRow.cells.length-1);
	n.iRender={tabPane:this,title:t};
	cp.appendChild(n);
	if(this.tabsRow.cells.length>1) this.tabsUnhide();
	n.IRenderTab=ct;
	return this;
};
TabPane.prototype.setFullSize = function (n) {
	var c=this.panesRow.cells[this.activeTab];
	if(n==undefined) {
		n=c.lastChild;
	}
	n.style.width=c.clientWidth+"px";
	n.style.height=c.clientHeight+"px";
	return this;
};
TabPane.prototype.tabsHide = function () {
	this.table.rows[0].style.display="none";
};
TabPane.prototype.tabsUnhide = function () {
	this.table.rows[0].style.display="table-row";
};