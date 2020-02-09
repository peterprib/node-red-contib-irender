function IChartPie(chart) {
	this.chart=chart;
}
IChartPie.prototype.draw=function() {
	this.isSlicesByRow=(this.slices=='row');
	const axis=this.chart.axis;
	this.data=this.chart.dataStor.data;
	if(this.chart.height==0  || this.chart.width==0) return;
	const piesCount=(this.isSlicesByRow?axis.y.columns.length:this.data.length),
		squareSize=Math.min(Math.sqrt((this.chart.height*this.chart.width)/(piesCount+1)),
				this.chart.height,this.chart.width)
	if(squareSize<30)
		throw Error('Not enough space to draw pie chart, number of charts: '+piesCount+' chart width:' + this.chart.width + 'height:' + this.chart.height);
	
	for(let xPos=0,yPos=0,i=0; i<piesCount; i++) {
		this.drawPie(xPos,yPos,squareSize,i);
		xPos+=squareSize;
		if(xPos>this.chart.width) {
			xPos=0;
			yPos+=squareSize;
			if(xPos>this.chart.width) 
				throw Error('Not enough space to draw pie chart');
		}
	}
	
	if(this.isSlicesByRow) {
		this.data.forEach((c,i)=>this.addLegendRow({},c[0],colors[i]))
	} else 
		axis.y.columns.forEach((c,i)=>{
			this.addLegendRow({},this.label[i],c.color);
		});
	
};
IChartPie.prototype.drawPie=function(x,y,d,i) {
	let total=this.isSlicesByRow?
			this.data.reduce((p,c)=>p+(isNaN(c[i])?0:c[i])):
				this.data[i].reduce((p,c)=>p+(isNaN(c)?0:c));		
	if(!total) return; 
	const xCentre=x+d/2,
		yCentre=y+d/2,
		radius=d/2*0.98,
		angleStart=0,
		angleEnd=0,
		value=null,
		unitDegreesRatio=2*Math.PI/total,
		color=this.colors[row];

	const data=this.isSlicesByRow
		?this.data
		:this.data[0].map((col, i) => this.data.map(([...row]) => row[i]));
	for(let row=0; row<data.length; row++) {
		color=this.colors[row];
		value=data[row][i];
		if(value==null) continue;
		angleStart=angleEnd;
		angleEnd+=unitDegreesRatio*value;
		this.graph({action:"path",d:describeArc(xCentre,yCentre,radius,angleStart,angleEnd),stroke:color,"stroke-width":this.lineWidth,fill:color});
	}
};
IChartPie.prototype.drawPieColumn=function() {
	const data=this.data[0].map((col, i) => this.data.map(([...row]) => row[i]));
	data.forEach((c,i,a)=>{
		
		this.graph({action:"path",d:describeArc(xCentre,yCentre,radius,angleStart,angleEnd),stroke:color,"stroke-width":this.lineWidth,fill:color});
	});
	
	this.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.dataStore.data[i][this.columnIndex[0]]]});
};
IChartPie.prototype.drawPieRow=function() {
	const data=this.data;
	data.forEach((c,i,a)=>{
		this.graph({action:"path",d:describeArc(xCentre,yCentre,radius,angleStart,angleEnd),stroke:color,"stroke-width":this.lineWidth,fill:color});

	});
	this.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.label[i]]});
};
IChartPie.prototype.describeArc=function(x, y, radius, startAngle, endAngle) {
	const start=this.polarToCartesian(x, y, radius, endAngle),
		end=this.polarToCartesian(x, y, radius, startAngle);
	return 
		"M "+start+" "+
		"A"+radius+" "+radius+" 0 "+(endAngle-startAngle<=180 ? "0" : "1")+" 0 "+end +
		"L "+x+" "+y+" "+
		"L "+start; 
};
IChartPie.prototype.getMenuOptions=function() {
	return [this.chart.menuButton("Slice","slices","row","column")]
};