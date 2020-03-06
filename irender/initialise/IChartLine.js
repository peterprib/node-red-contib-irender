function IChartLine(chart) {
	this.chart=chart;
}
IChartLine.prototype.isCartezian=true;
IChartLine.prototype.draw=function(plot=this.plot) {
	const transparency=0.8,
		axis=this.chart.axis,
		data=this.chart.dataStore.data,
		columnX=axis.x.column;
	let baseAttributes={action:"polyline",stroke:columnX.color,"stroke-width":axis.x.line.width,fill:"none","fill-opacity":transparency},
		basePointAttributes={action:"circle",r:3,stroke:"none","stroke-width":axis.x.line.width,fill:"none","fill-opacity":transparency};

	this.chart.addLegendRow({},"x axis: " + columnX.title);
	const zTitle=axis.z?" z: "+axis.z.column.title:"";
	axis.y.columns.forEach(c=>this.chart.addLegendRow({},c.title+zTitle,c.color));
	axis.x.draw();
	axis.y.draw();
	let errors;
	axis.y.columns.forEach(columnY=>{
		try {
			if(this.chart.showPoints) {
				basePointAttributes.stroke=columnY.color;
				basePointAttributes.fill=columnY.color;
			}
			baseAttributes.stroke=columnY.color;
			if(this.chart.highlight=='first' && data.length)
				this.drawPoint(columnX.getDataFirst(),columnY.getDataFirst(),columnX.title,columnY.title);
			this.plot(columnX,columnY,baseAttributes,basePointAttributes);
			if(this.highlight=='last' && data.length)
				this.drawPoint(columnX.getDataLast(),columnY.getDataLast(),columnX.title,columnY.title);
		} catch(e) {
			console.warn(e);
			errors += ' error plotting '+columnY.title+' '+e +'\n';
		}
	});
	if(errors) throw Error(errors);
};
IChartLine.prototype.drawPoint=function(x,y,xLabel,yLabel) { 
	const axis=this.chart.axis;
	this.chart.graph(basePointAttributes,{cx:axis.x.getPosition(x),cy:axis.y.getPosition(y),title:xLabel+": "+x+" "+yLabel+": "+y});
};
IChartLine.prototype.plot=function(colX,colY,baseAttributes,basePointAttributes) { 
	const axis=this.chart.axis;
	let errors,points=[];
	colX.getColumnData().forEach((dataX,i)=>{
		const dataY=colY.getDataRow(i);
		try{
			if(dataX!==null && dataY!==null) {
				const x=axis.x.getPosition(dataX), y=axis.y.getPosition(dataY);
				this.chart.graph(basePointAttributes,{cx:x,cy:y,title:colX.title+": "+dataX+" "+colY.title+": "+dataY});
				points.push(x+","+y);
			} else if(points.length>0) {
				this.chart.graph(baseAttributes,{points:points.join(" ")});
				points=[];
			}
		} catch (e) {
			errors += " x: " + dataX + " ( " + (x==null?null:x) + " ) " + " y: " + dataY + " ( " + (y==null?null:y) + " ) " + "\n" + e + "\n";
			this.chart.graph(baseAttributes,{points:points.join(" ")});
			points=[];
		} 
	});
	if(points.length>0) {
		this.chart.graph(baseAttributes,{points:points.join(" ")});
	}
	if(errors) throw Error(errors);
};
IChartLine.prototype.checkOptions=function() {
	if(!this.chart.axis.x || !this.chart.axis.x.column) throw Error("axis x not defined");
	this.chart.checkExists(this.chart.axis.x.column.name,'Chart type: '+this.chart.type+' is missing parameter chart.axis.x.column.name');
};
IChartLine.prototype.getCoordsPoints=function(xPos,yPos) {
	const axis=this.chart.axis;
	let y=this.chart.offset - yPos;
	if(["FIXED","AUTO"].includes(axis.y.scale.type)) {
	} else if(!this.chart.axis.y.scale.type=="NOAXIS") {
		this.chart.insertCell(this.chart.addDetailXY(),
				...["x: "+this.dataToString(0,xBase.plot),"y: "+this.dataToString(1,yBase.plot)]);
	}
	const columnX=axis.x.column;
	const xPoints=columnX.getPointsNear(axis.x.getPositionValue(xPos));
	axis.y.columns.forEach((column)=>{
		column.getPointsNear(axis.x.getPositionValue(yPos),xPoints).forEach(i=>{
			this.chart.insertCell(this.chart.addDetailXY(),column.title,"x: "+columnX.getFormatted(i),"y: "+column.getFormatted(i));
		});
	});
};
IChartLine.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL")];
};