/*
 * response: { 
 * 	structure: [
 * 			{name:"name",column:this.name,title:"title",type:"string"}
 * 			]
 * 	data: [[col1,col2]]
 * }
 * this.columns={columnName:{offset:0,name:"name",column:this.name,title:"title"},...}
 * 
 * 	this.metaData=md;
	this.columns={};
	for(let n,i=0;i<md.length;i++) {
		if(md[i].name) {
			n=md[i].name;
			if(!md[i].column) md[i].column=n
		} else if(md[i].column) {
			n=md[i].column;
			md[i].name=n;
		} else {
			n="col"+(i+1);
			md[i].name=n;
			md[i].column=n;
		}
		if(!md[i].title) md[i].title=n;
		this.columns[n]=Object.assign({offset:i},md[i]);
	}
 */

function ITableDataRender(element,properties,md,mp,data) {
	Object.assign(this,
		(typeof properties =="string")?{url:properties}:properties
	);
	this.element=typeof element =="string"?document.getElementById(element):element;
	if(md) {this.setMetaData(md);}
	if(mp) {this.setMapping(mp);}
	this.data=data||[];
	this.element.innerText=null;
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
	this.setLoading();  
	try{
        this.getData();
	} catch(e) {
	    this.error(e.message);
	}
	return this;
};
ITableDataRender.prototype.maxColumns = function (n) {
	return this.data.reduce((a,c)=>Math.max(a,c.length),0);
};
ITableDataRender.prototype.addRowId = function (n) {
	const columnMetaData={name:"_rowid",type:"number",title:"Id",offset:0};
	this.data.forEach((c,i)=>c.unshift(i));
	this.structure.forEach(column=>this.columns[column.name].offset++);
	this.structure.unshift(columnMetaData);
	this.setColumn(columnMetaData,0);
};
ITableDataRender.prototype.appendTo = function (n) {
	document.getElementById(n).appendChild(this.getHTMLTable());
	return this;
};
ITableDataRender.prototype.buildColumnar = function (n) {
	this.data.forEach((row)=>{
	});
};
ITableDataRender.prototype.clearPane = function () {
	while (this.element.firstChild) {
		//The list is LIVE so it will re-index each call
		this.element.removeChild(this.element.firstChild);
	}
};
ITableDataRender.prototype.contextmenu = function (ev) {
	ev.preventDefault();
	if (this.dataMenu) {
		this.dataMenu.close();
		delete this.dataMenu;
	}
	this.dataMenu=new IContextMenu();
	let row=ev.target.parentNode.rowIndex,
		cell=ev.target.cellIndex;
	if(isNaN(row) || isNaN(cell)) return;
	if(row==0) { // Header row
		this.dataMenu.add("Unhide all",this.unhideRowAll,[],this);
	} else {
		this.dataMenu.add("Row Details",this.displayRow,[row-1,cell],this)
			.add("Hide",this.hideRow,[row,cell],this);
	}
	this.dataMenu.positionAbsolute({y:ev.pageY,x:ev.pageX});
};
ITableDataRender.prototype.displayPane = function () {
	if(this.element.IRender) {
		this.element.IRender.display();
	} else {
		console.error("ITableDataRender displayPane IRender not found on element");
	}
};
ITableDataRender.prototype.displayRow = function (ev,r) {
	if(!this.displayRowForm) {
		this.displayRowForm = new IForm(this,null,"Row")
				.setRemove(this.displayRowRemove.bind(this))
				.positionAbsolute({y:ev.pageY,x:ev.pageX});
		for(let d,t,ml=this.mapping.length,m=0; m<ml; m++) { //columns
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
					let rows=(d||"").search(/\n/g); // count newlines
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
ITableDataRender.prototype.error = function (err) {
    console.warn(err);
	if(this.element.IRender && this.element.IRender.onLoadError) {
		this.element.IRender.onLoadError(err);
	} else {
		this.clearPane();
	    this.css.createElement(this.element,"A","Error").appendChild(document.createTextNode("error: "+err));
	}
    if(this.onLoad && this.onLoad.onError) {
		this.onLoad.onError.apply(this.onLoad.object,[err.toString()]);
    }
};
ITableDataRender.prototype.filterColumn = function (f) {
	return this.structure.filter(c=>f.apply(this,[c.columnObject]));
};
ITableDataRender.prototype.forEachColumn = function (f) {
	this.structure.forEach(c=>f.apply(this,[c.columnObject]));
};
ITableDataRender.prototype.getColumn = function (name) {
	return this.columns[name];    //this.structure[offset].columnObject
};
ITableDataRender.prototype.getData = function (url) {
	if(url) this.url=url;
    if((this.url||"/")=="/") throw Error("url not specified");
    this.getUrl=this.url;
    this.refresh();
};
ITableDataRender.prototype.getHTMLTable = function () {
	const t=this.css.createElement(null,"TABLE","Table");
	this.tbody=this.css.createElement(t,"TBODY","TableBody");
	const tHeadRow=this.css.createElement(this.tbody,"TR");
	t.addEventListener('contextmenu', this.contextmenu.bind(this), false);
	this.css.createElement(tHeadRow,"TD","Cell0");
	let dl=this.data.length;
	for(let i=0; i<dl ;i++) {  // define all row label cells
		this.css.createElement(this.css.createElement(this.tbody,"TR"),"TD","Left");
	}
	this.clearPane();
    this.element.appendChild(t);
	
	this.mapping.forEach(mp=>{
//	for(let ml=this.mapping.length,m=0; m<ml; m++) { //columns
//		const mp=this.mapping[m];
//		const md=this.metaData[mp.offset];
		mp.appendCellTitle(tHeadRow,this.css);
		for(let i=0; i<dl ;i++) {
			mp.appendCellData(this.tbody.rows[i+1],this.css,this.data[i]);
//			this.css.createElement(this.tbody.rows[i+1],"TD","Cell").appendChild(mp.format.toHTML(this.data[i][mp.offset]));
		}
	});
	return t;
};
ITableDataRender.prototype.groupBy = function (order) {
	this.data=this.groupedData(order);
	return this.data; 
};
ITableDataRender.prototype.groupedData = function (order) {
	const groupOffsets=[],addOffsets=[],
		data=this.sortedData(order);
	this.structure.forEach((c,i)=>(order.includes(c.name)?groupOffsets:addOffsets).push(c.offset));
	return data.reduce((a,r)=>{
		if(a.length==0) return a.push(r);
		const last=a[a.length]; 
		groupOffsets.forEach(c=>{
			const i=c.offset;
			if(a[i]==last[i]) next;
			return a.push(r)
		});
		addOffsets.forEach(c=>last[i]+=r[i]);
		return a;
	},[]);
};
ITableDataRender.prototype.hideRow = function (ev,r) {
	this.tbody.childNodes[r].style.display="none";
};
ITableDataRender.prototype.processData = function (data) {
    Object.assign(this,JSON.parse(data));
    if(!this.metaData) {
        this.setMetaData(this.structure);
        this.setMapping(this.structure);
    }
    this.getHTMLTable();
    if(this.onLoad) {
    	try{
        	this.onLoad.callFunction.apply(this.onLoad.object,[this]);
    	} catch(e) {
    		this.error(e);
    	}
    }
};
ITableDataRender.prototype.refresh = function () {
    let base=this, httpRequest= new XMLHttpRequest();
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
                    base.error('There was a problem with the get data request url:'+ base.getUrl + ', status: '+this.status);
                }
            } 
        } catch( e ) {
            console.warn(e);
            base.error('Caught Exception: ' + e.message + ' url:'+ base.getUrl + ' data:'+this.responseText.substr(0,20));
        }
    };
    httpRequest.open('GET', base.getUrl);
    httpRequest.onerror = function(){
    	base.error("http get failed, check log for details");
    }
    try{
        httpRequest.send();
    } catch(e) {
        console.error(e);
    	base.error(e.message);
    }
}
ITableDataRender.prototype.setColors = function () {
	let availableColors=getColorPallet(this.structure.length);
	this.structure.forEach(c=>{
		const color=this.columns[c.name].color||availableColors.pop();
		this.columns[c.name].color=color in colors?colors[color]:color;
	});
}
ITableDataRender.prototype.setColumn = function (c,i) {
	if(!c.name) c.name=c.column||"col"+(i+1);
	const column=new Column({data:this.data,offset:i,type:c.type},c);
	this.columns[column.name]=column;
	c.columnObject=column;
	return column 
};
ITableDataRender.prototype.setLoading = function () {
	if(this.element.IRender) {
		if(this.element.IRender.setLoading) {
			this.element.IRender.setLoading();
		} else {
			this.element.IRender.base.setLoading(this.element);
		}
	} else {
	    this.element.appendChild(document.createTextNode("Loading "));
	}
};
ITableDataRender.prototype.setMetaData = function (md) {
	this.metaData=md;
	this.columns={};
	md.forEach((c,i)=>this.setColumn.apply(this,[c,i]));
	return this;
};
ITableDataRender.prototype.setMapping = function (m) {
	this.mapping=m.map(c=>{
		const column=this.columns[c.name];
//		.map(c=>{//			format:(new IFormat(c))
//		column.offset=(typeof c.column === 'string'?this.columns[c.column].offset:offset=c.column-1);
		return column;
	});
};
ITableDataRender.prototype.sortedBy = function (order) {
	this.data=this.sortedData();
};
ITableDataRender.prototype.sortedData = function (order) {
	//[{offset:0,direction:1},
	return this.data.sort((a,b)=>{
		for(let c in order) {
			const i=c.offset;
			if(a[i]>b[i]) return c.direction||1;
			if(a[i]<b[i]) return -c.direction||1;
		}
		return 0
	});
};
ITableDataRender.prototype.transform = function (d) {
	return d.reduce(
		(accumlatorRow,row)=>
			accumlatorRow+this.mapping.reduce(
				(accumlatorColumn,column)=>accumlatorColumn+column.format.formatter(row[column.name]),
				""
			),
		""
	);
};
ITableDataRender.prototype.unhideRowAll = function (ev) {
	for(let r=0;r<this.tbody.childNodes[0].childElementCount;r++) {
		this.tbody.childNodes[r].style.display="";
	}
};