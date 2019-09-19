function IRenderClass(n) {
	this.id=n;
    this.styleSheet = document.getElementById(n||"IRenderCSS");
    if (this.styleSheet===null) this.CreateStyleSheet(n);
}
IRenderClass.prototype.CreateStyleSheet = function (n) {
	console.log("IRenderClass define stylesheet"+(n||"IRenderCSS"));
	this.styleSheet = document.createElement("style");
	this.styleSheet.type = "text/css";
	this.styleSheet.id = n||"IRenderCSS";
	document.getElementsByTagName("head")[0].appendChild(this.styleSheet);
	this.rule=this.styleSheet.sheet.insertRule?this.cssInsertRule:this.cssAddRule;
	this.add("CellRight","float:right;");
	this.add("CellRight:hover","cursor: pointer; filter: invert(100%);");
	this.add("CloseIcon","float:right;height: 12px; width: 12px;  border: 4px; margin: 0px 0px 0px 4px;");
   	this.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;");
	this.add("FullSize","height: 100%; width: 100%;");
	this.add("HeaderCenter","float: center;width: 100%;");
	this.add("HeaderMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center;  padding: 1px; display: table-row;");
	this.add("Header","background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;");
	this.add("HeaderRow","background-color: LightGrey; height: 100%; width: 100%; text-align: center; vertical-align:top ;");
	this.add("HeaderLeft","float: left;");
	this.add("HeaderCenter","float: center;width: 100%;");
	this.add("HeaderRight","float: right;");
	this.add("FooterMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center; display: table-row;");
	this.add("FooterMainCell","background-color: LightSkyBlue; display: table-cell;");
	this.add("Footer","background-color: LightGrey; width: 100%; text-align: center;");
	this.add("DetailPane"," width: 100%; height: 100%; overflow: auto;");
	this.add("MenuCell","vertical-align: top; width: 200px; height: 100%; border-right-style: solid; border-right-color: LightGrey; border-right-width: 5px;");
	this.add("Menu","vertical-align: top;");
	this.add("MenuText:hover","background: LightGrey;");
	this.add("MenuOption","height: 20px; vertical-align: top;");
	this.add("PaneFloat","min-width: 100px; min-height: 100px; "
			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
			+"overflow: auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;")
	this.add("resizeVertical:hover","cursor: ew-resize;");
   	this.add("Tab","height: 20px; float: left; border: medium solid LightGrey; border-top-left-radius: 5px; border-top-right-radius: 10px;");
   	this.add("TabDetail","height: 100%; width: 100%; vertical-align:top ;");
	this.add("TabPaneCell","border-top-style: solid; border-top-color: LightGrey;");
   	this.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;");
   	this.add("Table","display: table; height: 100%; width: 100%; border-spacing: 0px;");
   	this.add("TableCell","background-color: inherit");
   	this.add("TableRow","display: table-row;");
   	this.setHTMLBody("height: 100%; width: 100%; margin: 0px 0px 0px 0px; overflow: hidden;");
};
IRenderClass.prototype.add = function (name,rules) {
		if(!this.rule) this.rule=this.styleSheet.sheet.insertRule?this.cssInsertRule:this.cssAddRule;
  		this.rule.call(this,name,rules);
  		return this;
	};
IRenderClass.prototype.createElement = function (n,t,c) {
		var e=this.setClass(document.createElement(t),c)
		if(n) n.appendChild(e);
		return e;
	};
IRenderClass.prototype.cssInsertRule = function (name,rules) {
	   this.styleSheet.sheet.insertRule('.IRender'+this.id+name+"{"+rules+"}",0);
	   return this;
    };
IRenderClass.prototype.cssAddRule = function (name,rules) {
	   this.styleSheet.sheet.addRule('.IRender'+this.id+name, rules);
	   return this;
    };
IRenderClass.prototype.setClass = function (n,name) {
		n.className="IRender"+this.id+name;
		return n;
	};
IRenderClass.prototype.addClass = function (n,name) {
		n.classList.add("IRender"+this.id+name);
		return n;
	};
IRenderClass.prototype.setHTMLBody = function (r) {
		if(this.styleSheet.sheet.insertRule) {
			this.styleSheet.sheet.insertRule("html,body {"+r+"}",0);
		} else {
			 this.styleSheet.sheet.addRule("html,body", r);
		}
	};
IRenderClass.prototype.removeClass = function (n,name) {
		n.classList.remove("IRender"+this.id+name);
		return n;
	};
IRenderClass.prototype.replaceClass = function (n,name) {
		return css.addClass(css.removeClass(n,from),to);
	};
IRenderClass.prototype.resetClass = function (n,name) {
		return css.removeClass(n,name,name);
	};
var css = new IRenderClass();