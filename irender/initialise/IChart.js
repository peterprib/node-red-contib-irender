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
//	iFormat=new IFormat();
//	this.setColorPallet();
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
		offset:20,
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
	this.isCartezian		=this.isLine||['line','bar','setline','stack','bubble'].includes(this.type);
	if(this.url===null) throw Error("Cannot render chart as url for table not specified");
};
IChart.prototype.addDetailXY=function() {
	return this.detailXY.insertRow(-1);
};
IChart.prototype.buildDataSet=function() {
	const data=this.dataStore.data;
	if(data.length <1 && this.onNoDataThrowError) throw Error('No data to chart');
//	delete this.columnIndexDetails;
	Object.assign(this,{columnIndex:[],data:[],dataType:[],deltaCol:[],deltaData:[],deltaIndex:[],dataMax:[],dataMin:[],group:[],groupingValue:"",
		groupValue:[],precision:[],label:[],xTicks:[],yTicks:[]
	});
//	this.setColumnDetails(0,this.chart.axis.x.name);
//	this.processGrouping();
	let x=-1;
//	this.xNormaliser=1;
//	const colX=this.columnIndex[0];
	const columnX=this.chart.axis.x.column;
	const columns=this.dataStore.structure;
/*
	this.columnIndex.forEach((c,i)=>{
		const col=this.dataStore.getColumn(c);
		this.dataMax[i]=col.getMax();
		this.dataMin[i]=col.getMin();
	});
*/
/*
	data.forEach((dataRow,row)=>{
		if(this.grouping==null) {
			this.clearData(++x);
		} else {
			if(x==-1 || dataRow[columnX.offset] !=  data[row-1][columnX.offset]) {
				this.clearData(++x);
			}
			this.setGroupingValue(groupIndex.reduce((a,c)=>a+=' '+ dataRow[c],""));
		}
		if(this.isCartezian) this.xTicks[x]=row;
		this.columnIndex.filter((c,i)=>this.group[i]==this.groupingValue).forEach((columnIndex,i)=>{
			let value=(columnIndex==null?x+1:dataRow[columnIndex]);
		this.data[x][i]=value;
		});
	});
*/
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
		throw Error("drawing " + this.type + "\n" + e.toString());
	};
};
IChart.prototype.getMetricColumnsOptions=function(pane) {
	const tableCols=this.baseTableData.columnsInfo;
	this.selectWithOptions(pane,tablesCols,"Y Metrics","ySeries",iFormat.numberTypes);
	this.selectWithOptions(pane,tablesCols,"Grouping","grouping",iFormat.stringTypes);
	this.selectWithOptions(pane,tablesCols,"Delta","delta",iFormat.numberTypes);
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
/*
IChart.prototype.processGrouping=function() {
	if(this.grouping){
		this.groupIndex=[];
		var groupingArray=this.grouping.split(",");
		for(let j=0; j<groupingArray.length;j++) {
			const columnName=groupingArray[j];
			const column=this.dataStore.columns[columnName];
			if(!isDatabaseConnectionVersion(column)) continue;
			try{
				this.groupIndex[j]=column.offset;
			} catch(e) {
				throw Error("grouping "+e.toString());
			}
		}
		return;
	}
//	this.setColumnIndexDetails("y");
};
*/
IChart.prototype.processParameters=function(options) {
	this.setOptions(options);
	this.check("highlight",['first','last','']);
	this.check("legend.display",[true,false]);
	this.check("slices",['row','column']);
	try {
		this.chartingObject=new window["IChart"+this.type.charAt(0).toUpperCase() + this.type.substring(1)](this);
	} catch(e) {
		console.warn(e);
		throw Error('Unknown chart type: ' + this.type);
	};
//	this.chartingObject.checkOptions();   too early as expec axis info which may only come after
};
IChart.prototype.refresh=function() {
	this.firstChartLoad=true;
	this.retrieveTableData();
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
		axisOffset=this.chart.axis.offset,
		colX=this.chart.axis.x.column;
	this.width=paneSize.width;
	this.height=paneSize.height;
//	const colY=this.columnIndexDetails.y;
//	this.xMax=this.width-axisOffset-6;
	if(colX.isMeasure()) {
		this.axis.x=new Axis({
			bound:{lower:null,upper:null},
			chart:this,
			column:axisX.column?axisX.column:axisX.columns[0],
			columns:axisX.columns,
			direction:"horizontal",
			graph:this.graph
//			position:this.height-axisOffset,
//			type:(axisX.type||colX.type)
		});
	}
	this.axis.y=new Axis({
		bound:{lower:null,upper:null},
		chart:this,
		column:axisY.column?axisY.column:axisY.columns[0],
		columns:axisY.columns,
		direction:"vertical",
		graph:this.graph
//		position:axisOffset,
//		type:(axisY.type||colY.type)
	});
};
IChart.prototype.scaleNormalY=function(value){
	return value*this.yRatio;
};
IChart.prototype.scaleExponentialNormalY=function(value){
	return value>0?Math.log(value)*this.yRatio:value<=0?Math.log(this.dataMinaxisY*0.1)*this.yRatio:null;
};
IChart.prototype.scaleZ=function(value,j) {
	const ratio=j&&this.zRatioColumns[j]?this.zRatioColumns[j]:this;
	return value?(value-ratio.zRatioOffset)*ratio.zRatio:0;
};
IChart.prototype.selectWithOptions=function(pane,tablesCols,title,property,types) {
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
/*
IChart.prototype.setColumnIndexDetails=function(axis) {
	var isaxisY=(axis=="y");
	if(this.columnIndexDetails==null) this.columnIndexDetails={};
	if(this.columnIndexDetails[axis]==null) 
		this.columnIndexDetails[axis]={
			columnIndex:[null],
			dataType:[null],
			dataStore:[null],
			dataMin:[null],
			dataMax:[null],
			group:[null],
			label:[null],
			start: this.columnIndex.length
		};
	const columnIndexDetails=this.columnIndexDetails[axis];
	const series=this[axis+"Series"];
	if(series instanceof Array){
		if(isaxisY)
			series.forEach(c=>this.setColumnDetails(this.columnIndex.length,c))
		else
			series.forEach(c=>this.setColumnDetailsAxis(columnIndexDetails,c));
	}
	columnIndexDetails.end=(axis=="y"?this.columnIndex.length:columnIndexDetails.columnIndex.length);
	columnIndexDetails.size=columnIndexDetails.end-columnIndexDetails.start;
};	
IChart.prototype.setColumnDetails=function(index,columnName) {
	if(columnName==null) {
		this.columnIndex[index]=null;
		this.dataType[index]='int';
		this.label[index]=this.groupingValue;
		this.group[index]=this.groupingValue;
		return;
	}
	const column=this.dataStore.columns[columnName];
	if(!column.color) column.color=this.colors[index];
	this.columnIndex[index]=column.offset;
	this.dataType[index]=column.type;
	this.label[index]=this.groupingValue + " " + column.title;
	this.group[index]=this.groupingValue;
};
IChart.prototype.setColumnDetailsAxis=function(columnDetails,columnName) {
	if(columnName==null) throw Error("Column name not specified");
	const column=this.dataStore.columns[columnName];
	const index=columnDetails.columnIndex.length;
	columnDetails.columnIndex[index]=column.offset;
	columnDetails.dataType[index]=column.type;
	columnDetails.label[index]=this.groupingValue + " " + column.title;
	columnDetails.group[index]=this.groupingValue;
};
*/

IChart.prototype.setData=function(tableData) {
	this.firstChartLoad=true;
	if(this.chart.axis.x.name && this.chart.axis.x.name=="_rowid") {
		this.dataStore.addRowId();
	} else {
		if(this.isCartezian) {
			this.dataStore.addRowId();
			this.chart.axis.x.name="_rowid";
		} else {
			this.chart.axis.x.column=this.dataStore.structure(c=>c.columnObject.isMeasure());
			this.chart.axis.x.name=this.chart.axis.x.column.name;
		}
	} 
	this.chart.axis.x.column=this.dataStore.columns[this.chart.axis.x.name];
	const columns=this.dataStore.columns;
	let availableColors=getColorPallet(this.dataStore.structure.length);
	this.dataStore.structure.forEach(c=>{
		const color=columns[c.name].color||availableColors.pop();
		columns[c.name].color=color in colors?colors[color]:color;
	});
	
	this.ySeries=this.dataStore.structure.filter(c=>columns[c.name].isMeasure()&&c.name!==this.chart.axis.x.name).map(c=>c.name);
	this.chart.axis.y.columns=this.ySeries.map(c=>this.dataStore.columns[c]);
	if(this.flipDataSet)			
		this.dataStore.data.reverse();
	this.renderTableData();
};
IChart.prototype.setDataStore=function(dataStore) {
	this.dataStore=dataStore;
};
/*
IChart.prototype.setGroupingValue=function(newGroupingValue) {
	if(this.groupValue.includes(newGroupingValue)) return;
	if(!this.groupValue.includes(this.groupingValue)){
		this.groupValue.push(this.groupingValue);
//		this.setColumnIndexDetails("y");
	}
};
*/	
IChart.prototype.setMenuOptions=function(menuArray=[]) {
	let options=[];
	switch (this.type) {
	case 'pie':
		options.push(this.menuButton("Slice","slices","row","column"));
		break;
	case 'bubble':
	case 'bubbleandline':
	case 'line':
		options.push(this.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL"));
		break;
	case 'bar':
	case 'stack':
		options.push(this.menuButton("Chart Type","chart.type","bar","stack"));
		break;
	}
	options.push(this.menuButton("Legend","chart.legend.display","hide","show"));
	options.push({title:"Show",action:"input",type:"button",value:"chart",name:"display",onclick: function(ev) {this.parent.parent.target.setParameter(ev.currentTarget);}});
	options.push({title:"Max. rows",action:"input",type:"text",value:"chart",name:this.baseTableData.maxResultsToFetch,onchange: function(ev) {this.parent.parent.target.setParameter(this);}});
	this.getMetricColumnsOptions(options);
	this.optionsDialog.setContent('<table>'+options+this.getMetricColumnsOptions(options)+'</table>','Options', null, null, null);
	return menuArray;
};
IChart.prototype.setMetrics=function(select) {
	this.ySeries=select.options.filter(c=>c.selected).map(c=>c.value);
	this.chart.axis.y.columns=this.ySeries.map(c=>this.dataStore.structure[c].column);
	this.renderTableData();
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
	this.chartSize();
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
	const detailXY=this.detailXY.getBoundingClientRect();
	this.detailXY.style.top=(evt.clientY-(y<this.height/2?-5:detailXY.height+5))+'px';
	this.detailXY.style.left=(evt.clientX-(x<this.width/2?-5:detailXY.width+5))+'px';
	let crosshairs=[];
	if(x>this.axisX.position) 
		crosshairs.push({action:"line",x1:x+0.5,y1:this.axisY.position,x2:x+0.5,y2:"0",stroke:"black","stroke-width":1});
	if(y<this.xaxisY.position)
		crosshairs.push({action:"line",x1:this.axisX.position,y1:y+0.5,x2:this.width,y2:y+0.5,stroke:"black","stroke-width":1});
	this.crosshairs=this.graph({action:"g",id:"crosshairs",children:crosshairs});
};
IChart.prototype.svgCoordsDetails=function(xPos,yPos) {
	const indexDetails=this.columnIndexDetails,
		colX=this.columnIndex[0];
	let	XYRow=this.addDetailXY();
	this.chartingObject.getCoordsPoints(xPos,yPos).forEach(c=>this.chart.insertCell(XYRow,c));
};
IChart.prototype.svgCoordsReset=function() {
	this.detailXY.style.display='none';
	this.crosshairs.remove();
	delete this.crosshairs;
};
