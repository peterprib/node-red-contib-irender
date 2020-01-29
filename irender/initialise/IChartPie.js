function IChartPie(chart) {
	this.chart.grouping=null;
	this.chart.chart.axis.y.scale.type="NOAXIS";
}
IChartPie.prototype.drawChart_pie=function() {
	if(this.chart.height==0  || this.chart.width==0) return;
	let piesCount=(this.slices=='row'?this.columnIndexDetails.y.size+1:this.data.length),
		squareSize=Math.sqrt((this.chart.height*this.chart.width)/(piesCount+1));
	squareSize=Math.min(squareSize,this.chart.height,this.chart.width)
	if(squareSize<30)
		throw Error('Not enough space to draw pie chart, number of charts: '+piesCount+' chart width:' + this.chart.width + 'height:' + this.chart.height);
	for(let xPos=0,yPos=0,i=(this.slices=='row'?0:0); i<piesCount; i++) {
		this.drawPie(xPos,yPos,squareSize,i);
		xPos+=squareSize;
		if(xPos>this.chart.width) {
			xPos=0;
			yPos+=squareSize;
			if(xPos>this.chart.width) 
				throw Error('Not enough space to draw pie chart');
		}
	}
	
	if(this.slices=='row') {
		this.data.forEach((c,i)=>this.addLegendRow({},c[0],this.colors[i]))
	} else 
		this.chart.axis.y.columns.forEach((c,i)=>{
//		for(let i=y.start; i<y.end; i++)
			this.addLegendRow({},this.label[i],this.colors[i]);
		});
	
};
IChartPie.prototype.drawPie=function(x,y,d,i) {
	let total=this.slices=='row'?
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

	const data=this.slices=='row'?this.data:this.data[0].map((col, i) => this.data.map(([...row]) => row[i]));
	for(let row=0; row<data.length; row++) {
		color=this.colors[row];
		value=data[row][i];
		if(value==null) continue;
		angleStart=angleEnd;
		angleEnd+=unitDegreesRatio*value;
		this.graph({action:"path",d:describeArc(xCentre,yCentre,radius,angleStart,angleEnd),stroke:color,"stroke-width":this.lineWidth,fill:color});
	}
	if(this.slices=='row')
		this.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.label[i]]});
	else if(this.columnIndex[0]!= null)
		this.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.dataStore.data[i][this.columnIndex[0]]]});
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