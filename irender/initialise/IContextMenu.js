function IContextMenu() {
	this.css=new IRenderClass("IContextCSS")
			.add("Table tr td:hover","background: LightGrey; cursor: pointer")
			.add("Table","max-width: fit-content; min-width: 10ch; min-height: 1ch; "
			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
			+"overflow: auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;");
	this.menus=this.css.createElement(document.getElementsByTagName("body")[0],"TABLE","Table");
	this.menus.addEventListener('click', this.click.bind(this), false);
	this.menus.addEventListener('mouseleave', this.hide.bind(this), false);
	this.actions=[];
	return this;
}
IContextMenu.prototype.add = function (t,f,p,o) {
	var c=this.createElement("TD",this.createElement("TR",this.menus)).appendChild(document.createTextNode(t));
	if(!(f instanceof Function)) throw Error("no function provided for "+t)
	this.actions.push({call:f,base:o,parameters:p});
	return this;
};
IContextMenu.prototype.click = function (ev) {
	this.menus.style.display="none";
	var a=this.actions[ev.target.parentNode.rowIndex];
	a.call.apply(a.base,[ev].concat(a.parameters));
};
IContextMenu.prototype.close = function () {
	document.getElementsByTagName("body")[0].removeChild(this.menus);
	this.menus=null;
	delete this;
};
IContextMenu.prototype.createElement=function(e,n){
	var en=document.createElement(e);
	if(n) n.appendChild(en);
	return en;
};
IContextMenu.prototype.positionAbsolute = function (p) {
	this.menus.style.display="table";
	this.menus.style.left=p.x+"px";
	this.menus.style.top=p.y+"px";
	this.menus.style.height="auto";
	this.menus.style.width="auto";
};
IContextMenu.prototype.hide = function (ev) {
	this.menus.style.display="none";
};
IContextMenu.prototype.unhide = function (ev) {
	this.menus.style.display="table";
};
