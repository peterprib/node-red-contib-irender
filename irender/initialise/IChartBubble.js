function IChartBubble(){
	const zDetails=this.chart.axis.z.column;
	this.zDataMax=zDetails.getMax();
	this.zDataMin=zDetails.getMin();
	this.zRatioColumns=[];
	for(i=0;i<zDetails.dataMin.length;i++) {
		this.zRatioColumns[i]={};
		var ratio=this.zRatioColumns[i];
		rangeZ=zDetails.dataMax[i]-zDetails.dataMin[i];
		if(rangeZ==0) {
			rangeZ=zDetails.dataMin[i];
			ratio.zRatioOffset=0;
		} else 
			ratio.zRatioOffset=zDetails.dataMin[i];
		ratio.zRatio=this.bubbleRatio*(Math.min(this.yMax,this.xMax)/rangeZ );
		if(ratio.zRatio==Infinity) this.zRatio=this.bubbleRatio;
	}
	rangeZ=this.zDataMax-this.zDataMin;
	if(rangeZ==0) {
		rangeZ=this.zDataMin;
		this.zRatioOffset==0;
	} else 
		this.zRatioOffset=this.zDataMin;
	this.zRatio=this.bubbleRatio*(Math.min(this.yMax,this.xMax)/rangeZ);
	if(this.zRatio==Infinity) this.zRatio=this.bubbleRatio;
	if(isNaN(this.zRatio)) throw "z ratio calculation error, charting width:"+ this.yMax + " max:"+ Math.max.apply(Math,this.columnIndexDetails.z.dataMax) + " min:"+ Math.min.apply(Math,this.columnIndexDetails.z.dataMin);

}
IChartBubble.prototype.drawChart_bubble=function() {
	this.drawAxisX();
	this.drawAxisY();

	const zDetails=this.columnIndexDetails.z,
		yStart=this.columnIndexDetails.y.start,
		yEnd=this.columnIndexDetails.y.end,
		colX=this.columnIndex[0];
	for(let i=0; i<this.data.length; i++) {
		for(let j=yStart; j<yEnd; j++) {
			const data=(this.deltaIndex[this.columnIndex[j]]? this.deltaData : this.data)
			const zData=( zDetails.deltaIndex[zDetails.columnIndex[j]] ? zDetails.deltaData : zDetails.dataStore );
			if(this.data[i][j]==null) continue;
			const y=data[i][j];
			if(isNaN(y)) continue;
			const xPos=this.xPositionScale(this.data[i][colX]);
			const yPos=this.yPositionScale(y);
			const radius=Math.abs(this.scaleZ(zData[i][j],j)/2);
			if(radius==0) continue;;
			this.graph({action:"circle",cx:xPos,cy:xPos,r:radius,stroke:(this.outline==="none"?this.colors[j]:this.outline),"stroke-width":1,fill:color,"fill-opacity":0.5});
		}
	}
};

IChartBubble.prototype.checkOptions=function() {
	this.checkExists(axis.z.name,'Missing parameter axis.z.name');
};

