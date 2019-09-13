function ITableDataRender(element,urlData,md,mp,d) {
	this.element=document.getElementById(element)
	if(md) {this.setMetaData(md);}
	if(mp) {this.setMapping(mp);}
	this.data=d||[];
	this.element.innerText=null;
	this.setLoading();  
	this.css=new IRenderClass("ITableCSS")
			.add("Error","border: 1px solid red;")
			.add("Table","border: 1px solid #a4a4a4; width:100%; height: 100%;")
			.add("Head" ,"padding-left:4px; border-bottom: 1px solid black; background: lightblue;  border: none;  position: sticky; top: 0;")
			.add("Head:hover","background: LightGrey; cursor: pointer")
			.add("Left","padding-left:4px; display: none;")
			.add("Left:hover","background: LightGrey; cursor: pointer")
			.add("Cell","padding-left:4px; ")
			.add("Cell:hover","background: LightGrey; cursor: pointer")
			.add("Cell0","padding-left:4px; display: none;")
			.add("Sticky","position: sticky; position: -webkit-sticky;")
			.add("TableBody","display: block; height: 100%; overflow: auto; width: 100%")
			;
	try{
        this.getData(urlData);
	} catch(e) {
	    this.error(e.message);
	}
	return this;
};
ITableDataRender.prototype.setLoading = function () {
    this.element.appendChild(document.createTextNode("Loading "));
};
ITableDataRender.prototype.clearPane = function () {
	while (this.element.firstChild) {
		//The list is LIVE so it will re-index each call
		this.element.removeChild(this.element.firstChild);
	}
};
ITableDataRender.prototype.processData = function (data) {
    Object.assign(this,JSON.parse(data));
    this.setMetaData(this.structure);
    this.setMapping(this.structure);
    var t=this.getHTMLTable();
    this.clearPane();
    this.element.appendChild(t);
};
ITableDataRender.prototype.error = function (err) {
    console.warn(err);
    this.css.createElement(this.element,"A","Error").appendChild(document.createTextNode("error: "+err));

};
ITableDataRender.prototype.getData = function (url) {
    if((url||"")=="/") throw Error("url not specified");
    var base=this, httpRequest= new XMLHttpRequest();
    httpRequest.timeout = 10000; // time in milliseconds
    //httpRequest.ontimeout = function (e) {
        // XMLHttpRequest timed out. Do something here.
    //};

    httpRequest.onreadystatechange = function () {
        try {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    base.processData(this.responseText);
                } else {
                    base.error('There was a problem with the get data request, status: '+this.status);
                }
            }
        } catch( e ) {
            console.warn(e);
            base.error('Caught Exception: ' + e.message + ' url:'+ url + ' data:'+this.responseText.substr(0,20));
        }
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}
ITableDataRender.prototype.setMetaData = function (md) {
	this.metaData=md;
	this.columns={};
	for(var n,i=0;i<md.length;i++) {
		n=md[i].name||md[i].column;
		if(md[i].title==null) md[i].title=n;
		this.columns[n]=Object.assign({offset:i},md[i]);
	}
	return this;
};

ITableDataRender.prototype.setMapping = function (m) {
		this.mapping=[];
		for(var c,i=0;i<m.length;i++) {
			c=m[i];
			var offset=typeof c.column === 'string'?this.columns[c.column].offset:offset=c.column-1;
			this.mapping.push( {format:(new IFormat()),offset:offset} );
		}
		return this;
	};
ITableDataRender.prototype.transform = function (d) {
	var o;
	for(var dl=d.length,i=0; i<dl ;i++) {
		for(var ml=this.mapping.length,m=0; m<ml; m++) {
			o+=this.mapping[m].format(d[this.mapping[m].column])																										;
		}
	}
	return o;
};
ITableDataRender.prototype.contextmenu = function (ev) {
	ev.preventDefault();
	if (this.dataMenu) {
		this.dataMenu.close();
		delete this.dataMenu;
	}
	this.dataMenu=new IContextMenu();
	var row=ev.target.parentNode.rowIndex,
		cell=ev.target.cellIndex;
	if(row==0) { // Header row
		this.dataMenu.add("Unhide all",this.unhideRowAll,[],this);
	} else {
		this.dataMenu.add("Row Details",this.displayRow,[row,cell],this)
			.add("Hide",this.hideRow,[row,cell],this);
	}
	this.dataMenu.positionAbsolute({y:ev.pageY,x:ev.pageX});
};
ITableDataRender.prototype.appendTo = function (n) {
	document.getElementById(n).appendChild(this.getHTMLTable());
	return this;
};
ITableDataRender.prototype.displayRow = function (ev,r) {
	if(!this.displayRowForm) {
		this.displayRowForm = new IForm(this,null,"Row")
				.setRemove(this.displayRowRemove.bind(this))
				.positionAbsolute({y:ev.pageY,x:ev.pageX});
		for(var d,t,ml=this.mapping.length,m=0; m<ml; m++) { //columns
			mp=this.mapping[m];
			md=this.metaData[mp.offset];
			d=this.data[r][mp.offset];
			switch (md.type) {
				case 'smallint': 
					t={type:"number",  size:7, maxsize:6};
					break;
				case 'int': 
					t={type:"number",  size:9, maxsize:8};
					break;
				case 'varchar':
					if(d) {
						var rows=d.search(/\n/g); // count newlines
					}
					if(rows>0) {
						t={action:"textarea", cols:100, rows:Math.min(rows+1,10), maxsize:md.typelen };
					} else {
						rows=Math.min(Math.ceil(d.length/100),10);
						if(rows>1) {
							t={action:"textarea", cols:100, rows:Math.min(rows,10), maxsize:md.typelen };
						} else {
							t={size:Math.min(md.typelen,100), maxsize:md.typelen};
						}
					}
					break;
				case 'boolean':
				default:
					t={};
			}
			this.displayRowForm.addItem(Object.assign({action:"input", title:md.title, type:"text", value: d},t))
		}
	}
	this.displayRowForm.display();
};
ITableDataRender.prototype.displayRowRemove = function () {
	delete this.displayRowForm;
};
ITableDataRender.prototype.hideRow = function (ev,r) {
	this.tbody.childNodes[r].style.display="none";
};
ITableDataRender.prototype.unhideRowAll = function (ev) {
	for(var r=0;r<this.tbody.childNodes[0].childElementCount;r++) {
		this.tbody.childNodes[r].style.display="";
	}
};
ITableDataRender.prototype.getHTMLTable = function () {
	var mp,md,r,
		t=this.css.createElement(null,"TABLE","Table");

	this.tbody=this.css.createElement(t,"TBODY","TableBody");
	tHeadRow=this.css.createElement(this.tbody,"TR");
	t.addEventListener('contextmenu', this.contextmenu.bind(this), false);
	this.css.createElement(tHeadRow,"TD","Cell0");
	
	for(var dl=this.data.length,i=0; i<dl ;i++) {  // define all row label cells
		const r=this.css.createElement(this.tbody,"TR");
		this.css.createElement(r,"TD","Left");
	}
	for(var ml=this.mapping.length,m=0; m<ml; m++) { //columns
		mp=this.mapping[m];
		md=this.metaData[mp.offset];
		this.css.createElement(tHeadRow,"TD","Head").appendChild(document.createTextNode(md.title));
		for(var i=0; i<dl ;i++) {
			r=this.tbody.rows[i+1];
			this.css.createElement(r,"TD","Cell").appendChild(document.createTextNode(this.data[i][mp.offset]));
		}
	}
	return t;
};