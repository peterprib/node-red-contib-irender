function IChartPie(chart) {
	this.chart=chart;
}
IChartPie.prototype.getColumns=function() {
	if(!this.columns) {
		this.columns=this.chart.axis.y.columns.filter(c=>c.isMeasure());
	}
	return this.columns;
};
IChartPie.prototype.getDataColumn=function(i) {
	return this.getColumns().map(c=>this.data[i][c.offset]);
}
IChartPie.prototype.getDataRow=function(i) {
	return this.getColumns()[i].getColumnData();
};
IChartPie.prototype.getTitleRow=function(i) {
	return this.columns[i].title;
};
IChartPie.prototype.getTitleColumn=function(i) {
	const column=this.chart.axis.x.column;
	return column?column.name+":"+this.chart.dataStore.data[i][column.offset]:null;
};
IChartPie.prototype.setChartType=function() {
	this.data=this.chart.dataStore.data;
	this.isSlicesByRow=(this.chart.slices=='row');
	this.colorPallet=[];
	this.labels=[];
	if(this.isSlicesByRow) {
		this.getData=this.getDataRow;
		this.getTitle=this.getTitleRow;
		this.chartNumber=this.getColumns().length;
//		this.data.forEach((c,i)=>{
//			this.chart.addLegendRow({},c[this.chart.axis.x.column.offset],color);
//		});
		const column=this.chart.axis.x.column;
		this.data.forEach((cell,i)=>{
			const color=colorsBase[i];
			const title=column.title+"="+cell[column.offset];
			this.chart.addLegendRow({},title,color);
			this.labels.push(title);
			this.colorPallet.push(color);
		});
	} else {
		this.getData=this.getDataColumn;
		this.getTitle=this.getTitleColumn;
		this.chartNumber=this.data.length;
		this.chart.axis.y.columns.forEach((column)=>{
			this.chart.addLegendRow({},column.title,column.color);
			this.colorPallet.push(column.color);
			this.labels.push(column.title);
		});
	}
}
IChartPie.prototype.draw=function() {
	if(this.chart.height==0  || this.chart.width==0) return;
	this.setChartType();
	const axis=this.chart.axis,
		squareSize=Math.min(Math.sqrt((this.chart.height*this.chart.width)/(this.chartNumber+1)),
				this.chart.height,this.chart.width)
	if(squareSize<30)
		throw Error('Not enough space to draw pie chart, number of charts: '+this.chartNumber+' chart width:' + this.chart.width + 'height:' + this.chart.height);
	
	for(let xPos=0,yPos=0,i=0; i<this.chartNumber; i++) {
		const title=this.getTitle(i);
		if(title)
			this.chart.graph({action:"text",x:xPos,y:yPos+10,"font-size":this.chart.pie.label.size,children:[title]});
		try{
			const data=this.getData(i);
			this.drawPie(xPos,yPos+10,squareSize-5,data);
		} catch (e) {
			console.warn(e);
			const fontSize=this.chart.pie.label.size;
			this.chart.graph({action:"text",x:x,y:y+1+fontSize,"font-size":fontSize,children:[e.message]});
		}
		xPos+=squareSize;
		if(xPos>this.chart.width) {
			xPos=0;
			yPos+=squareSize;
			if(xPos>this.chart.width) 
				throw Error('Not enough space to draw pie chart');
		}
	}
};
IChartPie.prototype.drawPie=function(x,y,diameter,data) {
	const xCentre=x+diameter/2,
		yCentre=y+diameter/2,
		radius=diameter/2*0.98,
		total=data.reduce((a,c)=>a+=c,0);		
	if(!total) return;
	const unitDegreesRatio=360/total;
	for(let angleStart,	angleEnd=0,	i=0; i<data.length; i++) {
		const color=this.colorPallet[i],
			value=data[i];
		if(value==null) continue;
		angleStart=angleEnd;
		angleEnd+=unitDegreesRatio*value;
		this.chart.graph({action:"path",d:this.describeArc(xCentre,yCentre,radius,angleStart,angleEnd),
			stroke:color,"stroke-width":this.chart.lineWidth,fill:color,title:this.labels[i]+" : "+value});
	}
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
IChartPie.prototype.getCoordsPoints=function(xPos,yPos) {
};
IChartPie.prototype.check=function() {
	this.chart.check("slices",['row','column']);
};