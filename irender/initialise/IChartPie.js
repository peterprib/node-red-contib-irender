function IChartPie(chart) {
	this.chart=chart;
	if(this.isSlicesByRow) {
		
	}
	this.getData=this.isSlicesByRow?this.getDataRow:this.getDataColumn;
}
IChartPie.prototype.getColumns=function() {
	if(!this.columns)
		this.columns=this.chart.axis.y.columns.length==0
			?this.data.filter(c=>c.isMeasure())
			:this.chart.axis.y.columns;
	return this.columns;
}
IChartPie.prototype.getDataRow=function(i) {
	return this.getColumns()[i].columnObject.getColumnData();
}
IChartPie.prototype.getDataColumn=function(i) {
	return this.getColumns().map(c=>this.data[i][c.offset]);
}
IChartPie.prototype.draw=function() {
	this.isSlicesByRow=(this.slices=='row');
	const axis=this.chart.axis;
	this.data=this.chart.dataStore.data;
	if(this.chart.height==0  || this.chart.width==0) return;
	const piesCount=(this.isSlicesByRow?this.getColumns.length:this.data.length),
		squareSize=Math.min(Math.sqrt((this.chart.height*this.chart.width)/(piesCount+1)),
				this.chart.height,this.chart.width)
	if(squareSize<30)
		throw Error('Not enough space to draw pie chart, number of charts: '+piesCount+' chart width:' + this.chart.width + 'height:' + this.chart.height);
	
	let colorPallet=[],label=[];
	if(this.isSlicesByRow) {
		this.data.forEach((c,i)=>{
			const color=colorsBase[i];
			this.addLegendRow({},c[0],color);
			colorPallet.push(color);
			label.push(c[0]);
		});
	} else {
		axis.y.columns.forEach((c,i)=>{
			this.chart.addLegendRow({},c.title,c.color);
			colorPallet.push(c.color);
			label.push(c.title);
		});
	} 
	
	for(let xPos=0,yPos=0,i=0; i<piesCount; i++) {
		const data=this.getData(i);
		this.drawPie(xPos,yPos,squareSize,data,colorPallet,label);
		xPos+=squareSize;
		if(xPos>this.chart.width) {
			xPos=0;
			yPos+=squareSize;
			if(xPos>this.chart.width) 
				throw Error('Not enough space to draw pie chart');
		}
	}
};
IChartPie.prototype.drawPie=function(x,y,diameter,data,colorPallet,label) {
	const xCentre=x+diameter/2,
		yCentre=y+diameter/2,
		radius=diameter/2*0.98,
		total=data.reduce((a,c)=>a+=c,0);		
	if(!total) return;
	const unitDegreesRatio=360/total;
	for(let angleStart,	angleEnd=0,	i=0; i<data.length; i++) {
		const color=colorPallet[i],
			value=data[i];
		if(value==null) continue;
		angleStart=angleEnd;
		angleEnd+=unitDegreesRatio*value;
		this.chart.graph({action:"path",d:this.describeArc(xCentre,yCentre,radius,angleStart,angleEnd),
			stroke:color,"stroke-width":this.chart.lineWidth,fill:color,title:label[i]+" : "+value});
	}
//	this.chart.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.dataStore.data[i][this.columnIndex[0]]]});
};
IChartPie.prototype.describeArc=function(x, y, radius, startAngle, endAngle) {
	const start=this.chart.polarToCartesian(x, y, radius, endAngle),
		end=this.chart.polarToCartesian(x, y, radius, startAngle);
	return "M "+start+" "+
		"A "+radius+" "+radius+" 0 "+(endAngle-startAngle<=180 ? "0" : "1")+" 0 "+end +
		"L "+x+" "+y+" "+
		"L "+start; 
};
IChartPie.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Slice","slices","row","column")]
};