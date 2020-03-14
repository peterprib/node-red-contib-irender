/*******************************************************************************
 *  Author: Peter Prib
 * 
 *  Copyright Jarolav Peter Prib 2019 All rights reserved.
 *
 *********************************************************************************/
//new ITableDataRender()
//this.scaleArray(a,r)  this.tableData=new ITableDataRender(options)
//(element,urlData,md,mp,data)
function IChart(base,properties,options) {
	let args=[];
	while(args.length<arguments.length) args.push(arguments[args.length]);
	while(args.length<2) args.push(null);
	args[2]=Object.assign({mouseCoords:false,legend:{},
		mousedown:{call:this.svgCoords,object:this},
		mouseup:{call:this.svgCoordsReset,object:this}
		},args[2]);
	Svg.apply(this,args);
	this.processParameters(Object.assign({},properties,options));
	this.detailXY=this.createElement("table",this.element);
	this.detailXY.style="font-size:10px; top:0px; left:60px ; position:absolute ; display:none; background:transparent; border:transparent; z-index: 11; background-color: #FFFFFF; filter: alpha(opacity=80); opacity:0.6;";
	if(!this.loadDefer)
		this.refresh();
}
IChart.prototype=Object.create(Svg.prototype);
IChart.prototype.setOptions=function (options) {
	Object.assign(this,{
		chart: {
			axis:{
				x:{
					name:null,
					line:{width:1,color:"black"},
					text:{size:10},
					tick:{width:1,color:"black",increment:5},
					scale:{max:1,min:1}
				},
				y:{
					line:{width:1,color:"black"},
					scale:{type:'AUTO',max:1,min:1},
					text:{size:10},
					tick:{width:1,color:"black",increment:5},
					upperBound:null,
					lowerBound:null
				},
				z:{}
			}
		},
		autoDelta:true,
		axis:{},
		bubbleRatio:0.2,
		delta:null,
		deltaNormaliser:1,
		disableLeftMenu:false,
		flipDataSet:false,
		grouping:null,
		height:100,
		highlight:'',
		lineWidth:1,
		onNoDataThrowError:true,
		outline:'black',
		pie:{label:{font:{size:10}}},
		showPoints:false,
		slices:'row',
		table:null,
		tableChart:null,
		tickIncrement:5,
		type:'line',
		width:100
		},
		options
	);
	if(this.url===null) throw Error("Cannot render chart as url for table not specified");
};
IChart.prototype.addDetailXY=function() {
	return this.detailXY.insertRow(-1);
};
IChart.prototype.buildDataSet=function() {
	const data=this.dataStore.data;
	if(data.length <1 && this.onNoDataThrowError) throw Error('No data to chart');
	Object.assign(this,{columnIndex:[],data:[],dataType:[],deltaCol:[],deltaData:[],deltaIndex:[],dataMax:[],dataMin:[],group:[],groupingValue:"",
		groupValue:[],precision:[],label:[],xTicks:[],yTicks:[]
	});
};
IChart.prototype.chartSize=function() {
	this.resizeChart();
	this.drawChart();
};
IChart.prototype.check=function(p,a) {
	const v=eval("this."+p);
	if(a.includes(v)) return;
	throw Error("parameter "+p+": '"+v+"' can only equal: "+a);
};
IChart.prototype.checkExists=function(value,errorMessage) {
	if(value==null) throw Error("check exists error: "+errorMessage);
};
IChart.prototype.display=function() {
	this.dataStore.getHTMLTable();
	this.dataStore.displayPane();
};
IChart.prototype.drawChart=function() {
	let errors;
	this.clearAll();
	try {
		this.chartingObject.draw();
	} catch(e) {
		console.warn(e);
		this.displayError("drawing " + this.type + "\n" + e.toString())
	};
};
IChart.prototype.displayError=function(message) {
	console.warn(message);
	this.graph({action:"text",x:this.width/2-message.length/2,y:this.height/2-5,"font-size":10,children:[message]});
};
IChart.prototype.getMetricColumnsOptions=function(pane) {
	this.selectWithOptions(pane,"Y Metrics","ySeries",iFormat.numberTypes);
	this.selectWithOptions(pane,"Grouping","grouping",iFormat.stringTypes);
	this.selectWithOptions(pane,"Delta","delta",iFormat.numberTypes);
};
IChart.prototype.menuButton=function(title,property,o1,o2) {
	return {title:title,action:"input",type:"button",value:(this[property]==o1?o1:o2),name:property,onclick: function(ev) {this.parent.parent.target.setParameter(ev.currentTarget);}};
};
IChart.prototype.insertCell=function(element) {
	for(let i=1;i<arguments.length;i++) element.insertCell(-1).innerHTML=arguments[i];
}
IChart.prototype.onError=function(error) {
	alert(error);
};
IChart.prototype.processParameters=function(options) {
	this.setOptions(options);
	this.check("highlight",['first','last','']);
	try {
		const chartFunction="IChart"+this.type.charAt(0).toUpperCase() + this.type.substring(1);
		if(chartFunction in window) {
			this.chartingObject=new window[chartFunction](this);
		} else {
			throw Error('Unknown chart type: ' + this.type);
		}
		if("check" in this.chartingObject) this.chartingObject.check();
	} catch(e) {
		console.error(e);
	};
};
IChart.prototype.refresh=function() {
	this.dataStore.refresh.apply(this.dataStore);
};
IChart.prototype.renderTableData=function() {
	if(this.firstChartLoad && this.delta==null && this.autoDelta)
		this.delta=this.dataStore.structure.filter(c=>c.isAccumulation).map(c=>c.name).join();
	this.buildDataSet();
	this.chartSize();
};
IChart.prototype.resizeChart=function() {
	const paneSize=this.getPaneSize(),
		axisX=this.chart.axis.x,
		axisY=this.chart.axis.y,
		colX=axisX.column;
	this.width=paneSize.width;
	this.height=paneSize.height;
	if(colX.isMeasure()) {
		this.axis.x=new Axis({
			bound:{lower:null,upper:null},
			chart:this,
			column:axisX.column?axisX.column:axisX.columns[0],
			columns:axisX.columns,
			direction:"horizontal",
			graph:this.graph
		});
	}
	this.axis.y=new Axis({
		bound:{lower:null,upper:null},
		chart:this,
		column:axisY.column?axisY.column:axisY.columns[0],
		columns:axisY.columns,
		direction:"vertical",
		graph:this.graph
	});
	if(this.chart.axis.z.columns)
		this.axis.z=new Axis({
			bound:{lower:null,upper:null},
			chart:this,
			columns:this.chart.axis.z.columns,
			direction:"size",
			graph:this.graph
		});
};
IChart.prototype.selectWithOptions=function(pane,title,property,types) {
	let options=[];
	const metadataColumns=this.dataStore.columns,
		colsIn=this[property]||[]; 
	for(let i=0; i<tablesCols.name.length; i++)	{
		if(types.includes(tablesCols.type[i])) {
			const colName=tablesCols.name[i];
			if(metadataColumns[colName]==null) break;
			let o={action:"option",label:+metadataColumns[colName].title,value:colName};
			cols.filter(c=>c==colName).forEach(o.selected="selected");
			options.push(o);
		}
	}
	pane.push({title:title,action:"select",multiple:"multiple",name:property,children:options,
		onchange:function(ev) {this.parent.parent.target.setProperty(ev.srcElement);}
	});
};
IChart.prototype.setData=function(tableData) {
	const axis=this.chart.axis;
	this.firstChartLoad=true;
	if(axis.x.name && axis.x.name=="_rowid") {
		this.dataStore.addRowId();
	} else {
		if(this.chartingObject.isCartezian) {
			this.dataStore.addRowId();
			axis.x.name="_rowid";
		} else {
			const potentialColumns=this.dataStore.filterColumn(c=>c.isMeasure());
			axis.x.column=potentialColumns[0];
			axis.x.name=this.chart.axis.x.column.name;
		}
	} 
	axis.x.column=this.dataStore.columns[this.chart.axis.x.name];
	this.dataStore.setColors();
	axis.y.columns=this.dataStore.filterColumn(c=>c.isMeasure()&&axis.x.column.name!==c.name).map(c=>c.columnObject);
	if(this.type=="bubble") {
		if(axis.z.columns==null) {
			if(!axis.y.columns || axis.y.columns.length<1) {
				throw Error("z value set and no y axis values available");
			}
			console.warn("no z axis selected so selected ones from y axis")
			axis.z.columns=axis.y.columns.slice(1);
			axis.y.columns=[axis.y.columns[0]];
		}
	}
	if(this.flipDataSet)			
		this.dataStore.data.reverse();
	this.renderTableData();
};
IChart.prototype.setDataStore=function(dataStore) {
	this.dataStore=dataStore;
};
IChart.prototype.setMenuOptions=function(menuArray=[]) {
	let options=this.chartingObject.getMenuOptions();
	options.push(this.menuButton("Legend","chart.legend.display","hide","show"));
	options.push({title:"Show",action:"input",type:"button",value:"chart",name:"display",onclick: function(ev) {this.parent.parent.target.setParameter(ev.currentTarget);}});
	options.push({title:"Max. rows",action:"input",type:"text",value:"chart",name:this.baseTableData.maxResultsToFetch,onchange: function(ev) {this.parent.parent.target.setParameter(this);}});
	this.getMetricColumnsOptions(options);
	this.optionsDialog.setContent('<table>'+options+this.getMetricColumnsOptions(options)+'</table>','Options', null, null, null);
	return menuArray;
};
IChart.prototype.setProperty=function(inputElement) {
	this[inputElement.name]=inputElement.children.filter(c=>c.selected).map(c=>c.value);
	this.renderTableData();
};
IChart.prototype.setParameter=function(element) {
	this[element.name]=element.value;
	switch (name) {
	case 'legend.display': 
		this.legend.display=element.value;
		this.hideLegend();
		elment.value (this.legend.display=="hide"?"show":"hide");
	}
	switch (element.name) {
	case 'slices': 
		element.value=(element.value=='row'?'column':'row');
		break;
	case 'chart.axis.y.scale.type':
		element.value=(element.value=='AUTO'?'EXPONENTIAL':'AUTO');
		break
	case 'type': 
		switch (this.type) {
		case 'bar': 
			element.value='stack';
			break;
		case 'stack':
			element.value='bar';
			break;
		}
	case 'display':  //?? change to button
		this.tableData.display();
	}
};
IChart.prototype.svgCoords=function(evt) {
	let mousePosition=this.getMousePosition(evt),
		x=mousePosition.x,
		y=mousePosition.y;
	while (this.detailXY.rows.length) // clear old details
		this.detailXY.deleteRow(0);
	this.svgCoordsDetails(x,y);
	this.detailXY.style.display='table';
	const detailXY=this.detailXY.getBoundingClientRect()
		axisX=this.axis.x,axisY=this.axis.y;
	this.detailXY.style.top=(evt.clientY-(y<this.height/2?-5:detailXY.height+5))+'px';
	this.detailXY.style.left=(evt.clientX-(x<this.width/2?-5:detailXY.width+5))+'px';
	let crosshairs=[];
	if(x>axisY.position) 
		crosshairs.push({action:"line",x1:x,x2:x,y1:0,y2:axisX.position,stroke:"black","stroke-width":1});
	if(y<axisX.position)
		crosshairs.push({action:"line",x1:axisY.position,x2:this.width,y1:y,y2:y,stroke:"black","stroke-width":1});
	this.crosshairs=this.graph({action:"g",id:"crosshairs",children:crosshairs});
};
IChart.prototype.svgCoordsDetails=function(xPos,yPos) {
	const indexDetails=this.columnIndexDetails,
		colX=this.columnIndex[0];
	let	XYRow=this.addDetailXY();
	this.chartingObject.getCoordsPoints(xPos,yPos); //.forEach(c=>this.chart.insertCell(XYRow,c));
};
IChart.prototype.svgCoordsReset=function() {
	this.detailXY.style.display='none';
	this.crosshairs.remove();
	delete this.crosshairs;
};
