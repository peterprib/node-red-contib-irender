function PaneFloat(base,paneProperties,options,target,action) {
	this.pane=new Pane(base,
		Object.assign({},paneProperties,{closable:true,tab:false}),  //paneProperties
		base.floatHandle,  //parentElememt
		target,
		action
	);
	css.setClass(this.pane.element,"PaneFloat");
	this.position(options.x,options.y);
	if(options) {
		if("message" in options) {
			this.pane.appendChild(Text(options.message));
		}
	}
	this.pane.headerRow.element.draggable=true;//dragStart
	this.pane.headerRow.element.addEventListener('dragstart', dragStart.bind(this), false);
}
PaneFloat.prototype.position = function (x,y) {
		this.positionAbsolute(this.pane.base.getAdjustedPosition(x,y,this.pane.element))
	};
PaneFloat.prototype.positionAbsolute = function (p) {
		this.pane.element.style.left=p.x+"px";
		this.pane.element.style.top=p.y+"px";
	};
PaneFloat.prototype.movePane = function (p) {
		const rect = this.pane.element.getBoundingClientRect();
		this.positionAbsolute({x:rect.left+p.x,y:rect.top+p.y});
		this.setMaxPaneSize();
	};
PaneFloat.prototype.setMaxPaneSize = function () {
		const p = this.pane.element.getBoundingClientRect()
			,w=this.pane.base.getBoundingClientRect()
		if(w.width<p.right) this.pane.element.style.width=(w.width-p.left)+"px";
 		if(w.height<p.bottom) this.pane.element.style.height=(w.height-p.top)+"px";
	};