function IChartBubble(chart){
	this.chart=chart;
}
IChartBubble.prototype.isCartezian=true;
IChartBubble.prototype.draw=function() {
	const transparency=0.8,
		zChartRange=Math.min(this.chart.width,this.chart.height)/4;
		axis=this.chart.axis,
		zColumns=axis.z.columns,
		offsetX=axis.x.column.offset,
		offsetY=axis.y.column.offset,
		base={action:"circle",stroke:(this.outline==="none"?columnZ.color:this.outline),"stroke-width":1,"fill-opacity":0.5};
	this.chart.addLegendRow({},"x axis: " + axis.x.column.title);
	this.chart.addLegendRow({},"y axis: " + axis.y.column.title);
	axis.z.columns.forEach(c=>this.chart.addLegendRow({},c.title,c.color));

	zColumns.forEach(c=>c.ratio=zChartRange/c.getRange());
	axis.x.draw();
	axis.y.draw();
	this.chart.dataStore.data.forEach(row=>{
		const x=axis.x.getPosition(row[offsetX]),
			y=axis.y.getPosition(row[offsetY]);
		zColumns.map(c=>{
			return {color:c.color,z:c.ratio*row[c.offset],title:' z: '+row[c.offset]};
		}).sort((a,b)=>b.z-a.z)
		.forEach(c=>{
			this.chart.graph({cx:x,cy:y,r:c.z,fill:c.color,title:'x: '+row[offsetX]+' y: '+row[offsetY]+c.title},base);
		});
	});
};
IChartBubble.prototype.chartCircle=function(base,x,y,z,color,title) {
	this.chart.graph(base,{action:"circle",cx:x,cy:y,r:z,fill:color,title:title});
};
IChartBubble.prototype.chartCandle=function(base,x,y,z,title) {
	this.chart.graph(base,{action:"rect",x:x-2,y:y-z/2,height:z,width:4,fill:color,title:title});
};
IChartBubble.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL")];
};
IChartBubble.prototype.getCoordsPoints=function(xPos,yPos) {
	const axis=this.chart.axis,
		columnX=axis.x.column;
	let y=this.chart.axis.y.offset - yPos;
	if(["FIXED","AUTO"].includes(axis.y.scale.type)) {
	} else if(!this.chart.axis.y.scale.type=="NOAXIS") {
		this.chart.insertCell(this.chart.addDetailXY(),
			...["x: "+this.dataToString(0,xBase.plot),"y: "+this.dataToString(1,yBase.plot)]);
	}
	this.chart.dataStore.data.forEach(row=>{
		zColumns.forEach(c=>{
			const radius=c.ratio*row[c.offset];
			const xPoints=columnX.getPointsNear(axis.x.getPositionValue(xPos),null,radius);
			axis.y.columns.forEach((column)=>{
				column.getPointsNear(axis.x.getPositionValue(yPos),xPoints,radius).forEach(i=>{
					this.chart.insertCell(this.chart.addDetailXY(),column.title,"x: "+columnX.getFormatted(i),"y: "+column.getFormatted(i));
				});
			});
		});
	});
};