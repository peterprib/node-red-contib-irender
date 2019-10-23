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
	this.add("CellRight","float:right;")
	.add("CellRight:hover","cursor: pointer; filter: invert(100%);")
	.add("ErrorDetail","float: center; height: 100%; width: 100%;")
	.add("CloseIcon","float:right;height: 12px; width: 12px;  border: 4px; margin: 0px 0px 0px 4px;")
	.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;")
	.add("FullSize","height: 100%; width: 100%;")
	.add("HeaderCenter","float: center;width: 100%;")
	.add("HeaderMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center;  padding: 1px; display: table-row;")
	.add("Header","background-color: LightGrey; height: 25px; width: 100%; text-align: center; vertical-align:top ;")
	.add("HeaderRow","background-color: LightGrey; height: 100%; width: 100%; text-align: center; vertical-align:top ;")
	.add("HeaderLeft","float: left;")
	.add("HeaderCenter","float: center;width: 100%;")
	.add("HeaderRight","float: right;")
	.add("FooterMain","background-color: LightSkyBlue; height: 25px; width: 100%; text-align: center; display: table-row;")
	.add("FooterMainCell","background-color: LightSkyBlue; display: table-cell;")
	.add("Footer","background-color: LightGrey; width: 100%; text-align: center;")
	.add("DetailPane"," width: 100%; height: 100%; overflow: auto;")
	.add("MenuCell","vertical-align: top; width: 200px; height: 100%; border-right-style: solid; border-right-color: LightGrey; border-right-width: 5px;")
	.add("Menu","vertical-align: top;")
	.add("MenuText:hover","background: LightGrey;")
	.add("MenuOption","height: 20px; vertical-align: top;")
	.add("PaneFloat","min-width: 100px; min-height: 100px; "
			+"position:absolute; filter: alpha(opacity=100); -moz-opacity: 1; background-color:white; opacity: 1; padding:0px;"
			+"overflow: auto; z-index:99999; background-color:#FFFFFF; border: 1px solid #a4a4a4;")
	.add("resizeVertical:hover","cursor: ew-resize;")
   	.add("Tab","height: 20px; float: left; border: medium solid LightGrey; border-top-left-radius: 5px; border-top-right-radius: 10px;")
   	.add("TabDetail","height: 100%; width: 100%; vertical-align:top ;")
	.add("TabPaneCell","border-top-style: solid; border-top-color: LightGrey;")
   	.add("FullLeft","display: inline-block; height: 100%; width: 100%; background-color: white;")
   	.add("Table","display: table; height: 100%; width: 100%; border-spacing: 0px;")
   	.add("TableCell","background-color: inherit")
   	.add("TableRow","display: table-row;")
   	.add("LoadingIcon","max-height: 50px; max-width: 50px; vertical-align: middle; margin-left: auto; margin-right: auto; height: 100%; width: 100%;")
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
var css = new IRenderClass("default");