function Menu(b,p,n,t) {
	this.base=b;
	this.parent=n;
	this.target=t;
	this.resizeHover=false;
	if(!p.subMenu)
		css.setClass(n,"MenuCell");
	this.element=createElement("TABLE","Menu",n);
	this.options={};
	for(var option in p.options){
		this.addOption(option,p.options[option]);
	}
	if(!p.subMenu)
		n.addEventListener('mousemove', this.mousemove.bind(this), false);	
}
Menu.prototype.addOption = function (o,p) {
		this.options[o] = new MenuOption(this.base,p,this);
	};
Menu.prototype.appendChild = function (n) {
		this.element.appendChild(n);
	};
Menu.prototype.mousemove = function (e) {
		//* resize
		if (e.clientX > e.currentTarget.clientWidth) {
			if(this.resizeHover==false) {
				css.addClass(this.parent,"resizeVertical");
				this.resizeHover=true;
			}
		} else if(this.resizeHover==true) {
			this.resizeHover=false;
			 css.removeClass(this.parent,"resizeVertical");
		}
	};
Menu.prototype.select = function (o) {
		if(o==null) return;
		fireEvent(this.find(o).element, "click");
	};
Menu.prototype.setDetail = function (t,n) {
		return this.target.setDetail(t,n);
	};
Menu.prototype.find = function (t) {
		for(var option in this.options){
			if(this.options[option].title==t) return this.options[option];
		}
		throw Error("menu option "+t+" not found");
	};