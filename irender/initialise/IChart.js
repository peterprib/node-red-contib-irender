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
	this.detailXY=this.createElement("table",this.element);
	this.detailXY.style="font-size:10px; top:0px; left:60px ; position:absolute ; display:none; background:transparent; border:transparent; z-index: 11; background-color: #FFFFFF; filter: alpha(opacity=80); opacity:0.6;";
	args[2]=Object.assign({mouseCoords:false,legend:{},
		onclick:this.canvasCoords.bind(this)
		},args[2]);
	Svg.apply(this,args);
	this.iFormat=new IFormat();
	this.setColorPallet();
	this.setOptions(Object.assign({},properties,options));
	if(!this.loadDefer)
		this.refresh();
}
IChart.prototype=Object.create(Svg.prototype);
IChart.prototype.setOptions=function (options) {
	Object.assign(this,{
		table:null,
		tableChart:null,
		disableLeftMenu:false,
		lineWidth:1,
		chart: {
			height:100,
			legend:{
				display:'show'
			},
			name:'default',
			title:null,
			type:'line',
			width:100,
			pie:{label:{font:{size:10}}},
			axis:{
				offset:30,
				x:{
					name:null,
					line:{width:1,color:"black"},
					position:0,
					text:{size:10},
					tick:{width:1,color:"black",increment:5},
					scale:{max:1,min:1}
				},
				y:{
					line:{width:1,color:"black"},
					position:0,
					scale:{type:'AUTO',max:1,min:1},
					text:{size:10},
					tick:{width:1,color:"black",increment:5},
					upperBound:null,
					lowerBound:null
				}
			}
		},
		highlight:null,
		outline:'black',
		tickIncrement:5,
		scaleUpOnly:false,
		scaleDownOnly:false,
		flipDataSet:false,
		showPoints:false,
		slices:'row',
		grouping:null,
		delta:null,
		autoDelta:true,
		deltaNormaliser:1,
		zAxis:null, 
		bubbleRatio:0.2,
		onNoDataThrowError:true
		},
		options
	);
	this.isLine				=['bar','pushline','setline'].includes(this.chart.type);
	this.isPushline			=this.chart.type==='pushline';
	this.isCartezian		=this.isLine||['stack','bubble'].includes(this.chart.type);
	this.isEvents			=['events'].includes(this.chart.type);
	this.isBubbleOrLine		=['bubble','bubbleandline','line'].includes(this.chart.type);
	this.isBarOrStack		=['bar','stack'].includes(this.chart.type)
	this.isPieChart			=['pie'].includes(this.chart.type);
	this.isScaleNormal		=["FIXED","AUTO"].includes(this.chart.axis.y.scale.type);
	this.isScaleExponential	=("EXPONENTIAL"==this.chart.axis.y.scale.type);
	this.isScaleNoAxis		=this.chart.axis.y.scale.type=="NOAXIS";
	this.scaleY=this.isScaleExponential?this.scaleExponentialNormalY:this.scaleNormalY;
	if(this.url===null) throw Error("Cannot render chart as url for table not specified");
};
IChart.prototype.addDetailXY=function() {
	return this.detailXY.insertRow(-1);
};
IChart.prototype.buildDataSet=function() {
	const data=this.dataStore.data;
	if(data.length <1 && this.onNoDataThrowError) throw Error('No data to chart');
	delete this.columnIndexDetails;
	Object.assign(this,{columnIndex:[],data:[],dataType:[],deltaCol:[],deltaData:[],deltaIndex:[],dataMax:[],dataMin:[],group:[],groupingValue:"",
		groupValue:[],precision:[],label:[],xTicks:[],yTicks:[]
	});
	this.processDelta();
	if(!this.chart.axis.x.name) {
		if(this.isCartezian) {
			data.forEach((c,i)=>c.push(i));
			//set column details
			this.chart.axis.x.name="_rowid";	
		}
	}
	this.setColumnDetails(0,this.chart.axis.x.name);
	this.processGrouping();
	let x=-1;
	this.xNormaliser=1;
	const xCol=this.columnIndex[0];
	const columns=this.dataStore.structure;
	data.forEach((dataRow,row)=>{
		if(this.grouping==null) {
			this.clearData(++x);
		} else {
			if(x==-1 || dataRow[xCol] !=  data[row-1][xCol]) {
				this.clearData(++x);
			}
			this.setGroupingValue(groupIndex.reduce((a,c)=>a+=' '+ dataRow[c],""));
		}
		if(this.isCartezian) this.xTicks[x]=row;
		this.columnIndex.filter((c,i)=>this.group[i]==this.groupingValue).forEach((columnIndex,i)=>{
			let value=(columnIndex==null?x+1:dataRow[columnIndex]);
//			let value=(columnIndex==null?x+1:columns[i].format(dataRow[columnIndex]));
			this.data[x][i]=value;
			if(this.deltaIndex[columnIndex]!==undefined) {
				if(i==0) {
					if(x>0) {
						this.deltaData[x-1][0]=value-this.data[x-1][0];
						this.xNormaliser=this.deltaData[x-1][0]/this.xNormliseFactor;
					}
				} else { 
					if(x==0){
						value=null;
					} else {
						value-=(value - this.data[x-1][i]) / this.xNormaliser;
						this.deltaData[x-1][i]=value; 
					}
				}
			}
			this.setMaxMin(this, i, value);
			if(this.zAxis) this.setDataAxis('z',dataRow,x,i); 
		});
	});
};
IChart.prototype.calculateTicks=function(max,min,type,metric) {
	let tickPosition=[];
	if(max==null) return tickPosition;
	let tickCount=Math.floor(max/20);
	if(tickCount<1) tickCount=1; 
	let i=0,k=0,duration=max-min;
	if(this.iFormat.isDateTime(type)) {
		this.precision[metric]=1;
		duration=Math.floor(duration/60000);   // minutes?
		if(duration>0) {
			this.precision[metric]=60;
			const minTS=(new Date()).setTime(parseInt(min));
//			const maxTS= (new Date()).setTime(parseInt(max)).setMilliseconds(0).setSeconds(0);
			duration=Math.floor(duration/60);   // hours?
			if(duration>0) { 	
				this.precision[metric]=360;
				minTS.setMinutes(0);
				duration=Math.floor(duration/24);   // days?
				if(duration > 0) { 	
					this.precision[metric]=1440;
					minTS.setHours(0);
					for(let j=1; j<100 ; j++)
						if(duration<j*5+1) continue; 
					duration=j*24*3600000;
				} else {
					duration=(Math.floor(Math.floor((max-min)/3600000)/5)+1)*3600000; //hours
				}
			} else {	
				const range=Math.floor((max-min)/(60000));             // minutes
				duration=range<5?60000:range<25?300000:600000; 
			} 					
			for(i=minTS.getTime(); i<max; i=i+duration )
				if(i>min && i<=max) tickPosition[k++]=i;
//			return tickPosition;
		}
//		duration=max-min;
	} else if(this.iFormat.isMeasure(type)) {
//		const min=parseFloat(min), max=parseFloat(max), 
		const range=max-min,
			tickSpan=Math.floor(range/tickCount),
			maxTicks=Math.floor(Number.MAX_VALUE / tickSpan),
			tickTotal=Math.min(tickCount+10,maxTicks);
		for(let j=0;j<=tickTotal;j++) {
			tickPosition[j]= min + j*tickSpan;
			if(tickPosition[j]>max) 
				return tickPosition;
		}
	} else {
		throw 'Unknown type: "'+type+'" for axis tick creation, check types are numeric, label: '+this.label[metric];
	}
	return tickPosition;
};
IChart.prototype.canvasCoordsDetails=function(chart,xPos,yPos) {
	const indexDetails=this.columnIndexDetails,
		XYRow=this.addDetailXY();
	if(this.isEvents) {
		const xBase=this.getRatioBase(xPos, this.xOffset,this.xRatio);
		this.data.forEach((row)=>{
			if(xBase.notInRange(row[0])) continue;
			let details="event:";
			for(let i=indexDetails.y.start; i<indexDetails.y.end; i++)
				details+=" "+this.dataToString(i,row[i]);
			this.insertCell(XYRow,details);
			XYRow=this.addDetailXY();
			
		});
	} else if(this.isBubbleOrLine) {
		const xBase=this.getRatioBase(xPos,this.xOffset,this.xRatio);
		let yBase;
		const y=this.yOffset - yPos;
		if(this.isScaleNormal) {
			yBase=this.getRatioBase(y,0,this.yRatio);
		} else if(this.isScaleExponential) {
			yBase=this.yOffset==yPos?{plot:0,minRange:0,maxRange}:{
				plot:Math.exp(y/this.yRatio),
				minRange: Math.exp((y-5)/this.yRatio),
				maxRange:Math.exp((y+5)/this.yRatio),
			};
			ybase.notInRange=v=>v< this.minRange || v> this.maxRange;
		} else if(!this.isScaleNoAxis) {
			this.insertCell(XYRow,"x: "+this.dataToString(0,xBase.plot));
			XYRow=this.addDetailXY();
			this.insertCell(XYRow,"y: "+this.dataToString(1,yBase.plot));
		}
		const yDetail=this.columnIndexDetails.y;
		this.data.forEach((row)=>{
			const headRow=row[0];
			if(xBase.notInRange(headRow)) continue;
			for(let i=yDetail.start; i<yDetail.end; i++) {
				const cell=row[i];
				if(isNaN(cell)) continue;
				y=(this.deltaIndex[this.columnIndex[i]]?this.dataToString(i,this.deltaData[row][i])
						:this.dataToString(i,cell));
				if(isNaN(y) || yBase.notInRange(y)) continue;
				XYRow=this.addDetailXY();
				this.insertCell(XYRow,this.label[i],"x: "+this.dataToString(0,headRow),"y: "+y);
				if(this.zAxis) {
					const zDetails=this.columnIndexDetails.z,
					zData=( zDetails.deltaIndex[zDetails.columnIndex[i]] ? zDetails.deltaData : zDetails.dataStore );
					this.insertCell(XYRow,"z: "+this.dataToString(i,zData[row][i]));
				}
			}
		});
	} else if(this.isBarOrStack) {
		const x=Math.floor((xPos - this.chart.axis.x.position)/this.tickIncrement-0.5);
		this.insertCell(XYRow,"x:",this.iFormat.isDateTime(this.dataType[0])
			?this.dataToString(0,(xPos -this.xOffset)/this.xRatio)
			:this.data[x][0]
		);
		this.insertCell(this.addDetailXY(),"y:",this.dataToString(1,(this.yOffset-yPos)/this.yRatio));
	}
};
IChart.prototype.canvasCoords=function(callingEvent) {
	var xPos=callingEvent.clientX - this.canvasOffset[0]-10;
	var yPos=callingEvent.clientY - this.canvasOffset[1]-10;
	while (this.detailXY.rows.length> 0) 
		this.detailXY.deleteRow(0);
	this.canvasCoordsDetails(this,xPos,yPos);
	this.detailXY.setStyle({'top':  (yPos-  ( yPos<this.chart.height/2 ? 0 : this.detailXY.getHeight()) ) + 'px'
		,'left': (xPos - ( xPos<this.chart.width/2  ? 0 : this.detailXY.getWidth() ) ) + 'px'
		,'display': 'block'});
	// x axis
	this.graph({action:"line",x1:xPos+0.5,y1:this.chart.axis.y.position,x2:xPos+0.5,y2:"0",stroke:"black","stroke-width":1});
	// y axis
	this.graph({action:"line",x1:this.chart.axis.x.position,y1:yPos+0.5,x2:this.chart.width,y2:yPos+0.5,stroke:"black","stroke-width":1});
};
IChart.prototype.chartSize=function() {
	this.resizeChart();
	this.drawChart();
};
IChart.prototype.check=function(p,a) {
	if(a.includes(this[p])) return;
	throw Error("parameter "+p+": '"+this[p]+"' can only equal: "+a);
};
IChart.prototype.checkExists=function(value,errorMessage) {
	if(value==null) throw Error("check exists error: "+errorMessage);
};
IChart.prototype.clearData=function(x) {
	this.data[x]=[];
	this.deltaData[x]=[];
};
IChart.prototype.colors=[ 
	'#FF0000', // Red 		
	'#00FFFF', // Turquoise 		
	'#408080', // Grass Green
	'#0000A0', // Dark Blue 		
	'#FF8040', // Orange 	
	'#FFFF00', // Yellow 	 	
	'#800000', // Burgundy 	
	'#800080', // Dark Purple 	
	'#804000', // Brown 	
	'#00FF00', // Pastel Green 		
	'#FF00FF', // Pink 	 	
	'#C0C0C0', // Light Grey 	
	'#808000', // Forest Green 	
	'#0000FF', // Light Blue 	 	
	'#FF0080', // Light Purple 	 	
	'#808080' // Dark Grey
];
IChart.prototype.dataToString=function(i,value) {
	return this.iFormat.formatAbbreviate(value,this.dataType[i],this.precision[i]);
};
IChart.prototype.describeArc=function(x, y, radius, startAngle, endAngle) {
	const start=this.polarToCartesian(x, y, radius, endAngle),
		end=this.polarToCartesian(x, y, radius, startAngle);
	return 
		"M "+start+" "+
		"A"+radius+" "+radius+" 0 "+(endAngle-startAngle<=180 ? "0" : "1")+" 0 "+end +
		"L "+x+" "+y+" "+
		"L "+start; 
};
IChart.prototype.display=function() {
	this.dataStore.displayPane();
};
IChart.prototype.displayPoint=function() {
	
};
IChart.prototype.drawAxisLine=function() {
	const xAxis=this.chart.axis.x, yAxis=this.chart.axis.y;
	if(!['bar','bubble','bubbleandline','line','pushline','setline','stack'].includes(this.chart.type)) return;
	// x axis
	this.graph({action:"line",
		x1:xAxis.position+0.5,y1:yAxis.position,
		x2:this.chart.width,y2:yAxis.position,stroke:"black","stroke-width":1});
	// x ticks
	if(this.isBubbleOrLine) {
		const dataType=this.dataType[0],precision=this.precision[0];
		this.xTicks.forEach((tick,i)=>{
			const axisLabel=this.iFormat.formatter(tick,dataType,precision);
			this.drawAxisTickX(this.xPositionScale(tick),axisLabel);
		});
	} else if(this.isCartezian) {
		this.graph({action:"line",x1:xAxis.position+0.5,y1:yAxis.position,x2:xAxis.position+0.5,
			y2:this.chart.height-(this.chart.type=='setline'?this.tickIncrement:0),
			stroke:"black","stroke-width":xAxis.line.width
		});
		this.tickIncrement=this.xTicks.length==0?this.xMax:Math.floor(this.xMax/(this.xTicks.length+1));
		const k=Math.ceil(50/this.tickIncrement),
			axisOffset=this.chart.axis.offset;
		for(let i=0; i<this.xTicks.length; i+=k) {
			if(this.columnIndex[0] && this.data[i]) next;
			const pos=axisOffset+this.tickIncrement*(i+1)-(this.chart.type=='setline'?this.tickIncrement:0);
			const type=this.dataType[0];
			const label=this.iFormat.isDateTime(type)?this.data[i][0].toString()
					:this.iFormat.isNumber(type)?axisLabel:this.dataToString(1,this.yTicks[i]);
			this.drawAxisTickX(pos,label);
		}
	}
	// y axis
	this.graph({action:"line",x1:xAxis.position,y1:yAxis.position,x2:xAxis.position,
		y2:this.chart.type=='setline'? this.tickIncrement:0,
		stroke:"black","stroke-width":yAxis.line.width
	});
	// y ticks
	this.yTicks.forEach(tick=>{
		const pos=this.yPositionScale(tick);
		this.drawAxisTickY(pos,this.dataToString(1,tick));
	});
};
IChart.prototype.drawAxisTickX=function(x,label) {
	const y=this.chart.axis.y.position;
	const textSize=this.chart.axis.x.text.size
	this.graph({action:"line",x1:x,y1:y+5,x2:x,y2:y-5,stroke:"black","stroke-width":this.chart.axis.x.tick.width});
	if(label)
		this.graph({action:"text",x:x,y:y+10+textSize/2,"font-size":textSize,"text-anchor":"end",children:[label]});

};
IChart.prototype.drawAxisTickY=function(y,label) {
	if(y==Infinity || y==-Infinity) return;
	const x=this.chart.axis.x.position;
	this.graph({action:"line",x1:x+5,y1:y,x2:x-5,y2:y,stroke:"black","stroke-width":this.chart.axis.x.tick.width});
	this.graph({action:"text",x:x-6,y:y,"text-anchor":"end","font-size":this.chart.axis.y.text.size,children:[label]});

};
IChart.prototype.drawChart=function() {
	let errors;
	const colorCnt=this.isPieChart&&this.slices=='row'?this.data.length:this.columnIndexDetails.y.size+1;
	if(colorCnt>this.colors.length) {
		const delta=this.colorPallet.length/colorCnt;
		for(let i=this.colors.length; i<colorCnt; i++) 
			this.colors[i]=this.colorPallet[Math.floor(i*delta)];
	}
	this.clearAll();
	this.drawAxisLine();
	try {
		this["drawChart_"+this.chart.type]();
	} catch(e) {throw "drawing " + this.chart.type + "\n" + e.toString(); };
	const y=this.columnIndexDetails.y;
	if(this.isPieChart) {
		if(this.slices=='row') {
			this.data.forEach((c,i)=>this.addLegendRow({},c[0],this.colors[i]))
		} else 
			for(let i=y.start; i<y.end; i++)
				this.addLegendRow({},this.label[i],this.colors[i]);
	} else  {
		this.addLegendRow({},"x axis: " + this.label[0]);
		for(let i=y.start; i<y.end; i++) {
			this.addLegendRow({},
				this.label[i]+(this.zAxis?" z is "+this.columnIndexDetails.z.label[i]:""),
				this.colors[i]
			);
		}
	}
};
IChart.prototype.drawChart_bar=function () {
	const yDetails=this.columnIndexDetails.y;
	this.barWidth=Math.floor(this.tickIncrement/yDetails.size);
	for(let xPos=0,yPos=0,d,j,i=0; i<this.data.length; i++) {
		for(j=yDetails.y.start; j<yDetails.y.end; j++) {
			d=this.data[i][j];
			if(d==null) continue;
			xPos=this.chart.axis.x.position+Math.floor((i+0.5)*this.tickIncrement)+(j-1)*this.barWidth;
			yPos=this.yPositionScale(d);
			this.graph({action:"rect",x:xPos,y:yPos,width:this.barWidth,
				height:this.chart.axis.y.position-yPos,
				stroke:(this.outline==="none"?this.colors[j]:this.outline),
				"stroke-width":this.lineWidth,
				fill:this.colors[j]
			});
		}
	}
};
IChart.prototype.drawChart_bubble=function() {
	const zDetails=this.columnIndexDetails.z,
		yStart=this.columnIndexDetails.y.start,
		yEnd=this.columnIndexDetails.y.end;
	for(let i=0; i<this.data.length; i++) {
		for(let j=yStart; j<yEnd; j++) {
			const data=(this.deltaIndex[this.columnIndex[j]]? this.deltaData : this.data)
			const zData=( zDetails.deltaIndex[zDetails.columnIndex[j]] ? zDetails.deltaData : zDetails.dataStore );
			if(this.data[i][j]==null) continue;
			const y=data[i][j];
			if(isNaN(y)) continue;
			const xPos=this.xPositionScale(this.data[i][0]);
			const yPos=this.yPositionScale(y);
			const radius=Math.abs(this.scaleZ(zData[i][j],j)/2);
			if(radius==0) continue;;
			this.graph({action:"circle",cx:xPos,cy:xPos,r:radius,stroke:(this.outline==="none"?this.colors[j]:this.outline),"stroke-width":1,fill:color,"fill-opacity":0.5});
		}
	}
};
IChart.prototype.drawChart_bubbleandline=function() {
	this.drawChart_line();
	this.drawChart_bubble();
};
IChart.prototype.drawChart_events=function(data) {
	let dataX, plotX;
	for(let j=0 ; j<data.length; j++) {
		const dataX=data[j][0];
		if(dataX==null || isNaN(dataX) ) continue;
		plotX=this.xPositionScale(dataX);
		this.graph({action:"line",x1:plotX,y1:0,x2:plotX,y2:this.chart.axis.y.position,stroke:"red","stroke-width":this.lineWidth,"fill-opacity":0.8});
	}
};
IChart.prototype.drawChart_line=function() {
	var errors;
	for(let j=this.columnIndexDetails.y.start; j<this.columnIndexDetails.y.end; j++)
		try {
			this.plot(j, 1, (this.deltaIndex[this.columnIndex[j]]? this.deltaData : this.data),0.8 );
		} catch(e) {
			errors += 'error plotting '+ this.label[i] + '  ' +e +'\n';
		}
		if(errors) throw Error(errors);
};
IChart.prototype.drawChart_pie=function() {
	if(this.chart.height==0  || this.chart.width==0) return;
	let piesCount=(this.slices=='row'?this.columnIndexDetails.y.size+1:this.data.length),
		squareSize=Math.sqrt((this.chart.height*this.chart.width)/(piesCount+1));
	squareSize=Maths.min(squareSize,this.chart.height,this.chart.width)
	
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
};
IChart.prototype.drawChart_pushline=function() {
	let errors;
	const y=this.columnIndexDetails.y;
	this.barWidth=Math.floor(this.tickIncrement/y.size);
	for(let j=y.start; j<y.end; j++)
		try {
			this.plotSet(j, 1, (this.deltaIndex[this.columnIndex[j]]? this.deltaData : this.data) );
		} catch(e) {
			errors += 'error plotting '+ this.label[i] + '  ' +e +'\n';
		}
	if(errors) throw Error(errors);
};
IChart.prototype.drawChart_setline=function() {return this.drawChart_pushline();};
IChart.prototype.drawChart_stack=function() {
	this.barWidth=this.tickIncrement;
	const yStart=this.columnIndexDetails.y.start,
		yEnd=this.columnIndexDetails.y.end;
	for(let xPos=0,yPos=0,y=0,total,d,j,i=0; i<this.data.length; i++) {
		xPos=this.chart.axis.x.position+Math.floor((i+0.5)*this.tickIncrement);
		total=0;
		const row=this.data[i];
		for(j=yStart; j<yEnd; j++) {
			d=row[j];
			if(d==null) continue;
			total+=d;
		}
		yPos=this.chart.axis.y.position-this.scaleY(total);
		for(j=yStart; j<yEnd; j++) {
			d=row[j];
			if(d==null) continue;
			y=this.scaleY(d);
			this.graph({action:"rect",x:xPos,y:yPos,width:this.barWidth,height:y,stroke:this.outline=="none"?this.colors[j]:this.outline,"stroke-width":this.lineWidth,fill:this.colors[j]});
			yPos+=y;
		}
	}
};
IChart.prototype.drawPie=function(x,y,d,i) {
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
		this.graph({action:"text",x:x,y:y+10,"font-size":this.chart.pie.label.size,children:[this.localDataSet[i][this.columnIndex[0]]]});
};
IChart.prototype.getMetricColumnsOptions=function(pane) {
	const tableCols=this.baseTableData.columnsInfo;
	this.selectWithOptions(pane,tablesCols,"Y Metrics","ySeries",this.iFormat.numberTypes);
	this.selectWithOptions(pane,tablesCols,"Grouping","grouping",this.iFormat.stringTypes);
	this.selectWithOptions(pane,tablesCols,"Delta","delta",this.iFormat.numberTypes);
};
IChart.prototype.getRatioBase=function(pos,offset,ratio) {
	return {Plot:(pos - offset)/ratio,
		MinRange:(pos - 5 - offset)/ratio,
		MaxRange:(pos + 5 - offset)/ratio,
		notInRange:v=>v<xBase.minRange||v>this.maxRange
	};
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
IChart.prototype.plot=function(y, offset, data,transparency=1) { 
	if(data.length==0) return;
	const color=this.colors[y * offset],
		baseAttributes={stroke:color,"stroke-width":this.lineWidth,fill:color,"fill-opacity":transparency};
	if(data.length==1 || this.highlight=='first') {
		const dataX=this.data[0][0], dataY=data[0][y];
		if((dataX||dataY)==null) return;
		const plotX=this.xPositionScale(dataX),	plotY=this.yPositionScale(dataY);
		this.graph(baseAttributes,this.showPoints
				?{action:"circle",cx:plotX,cy:plotY,r:3}
				:{action:"rect",x:plotX-3,y:plotX-3,width:6,height:6});
		if(data.length==1) return;
	}
	let errors,points=[];
	data.forEach((row,x)=>{
		try{
			const dataX=row[0],dataY=row[y];
			if(dataX==null || dataY==null || isNaN(dataX) || isNaN(dataY)) {
				if(points.length>0) {
					this.graph(baseAttributes,{action:"polyline",points:points.join(" "),stroke:color});
					if(points.length==1 && !this.showPoints) 
						this.graph(baseAttributes,{action:"rect",
							x:this.xPositionScale(this.data[x-1][0])-3,
							y:this.scaleY(data[x-1][y])-3,
							width:6,height:6
						});
					points=[];
				}
				return;
			}
			points.push(this.xPositionScale(dataX)+","+this.yPositionScale(dataY));
		} catch (e) {
			errors += " x: " + dataX + " ( " + plotX + " ) " + " y: " + dataY + " ( " + plotY + " ) " + "\n" + e + "\n";
			this.graph(baseAttributes,{action:"polyline",points:points.join(" "),stroke:color});
			points=[];
		} 
	});
	if(points.length>0) {
		this.graph(baseAttributes,{action:"polyline",id:"polyline",points:points.join(" "),stroke:color});
		if(( points.length==1 || this.highlight=='last' ) && !this.showPoints) 
			this.graph(baseAttributes,{action:"rect",id:"rect",x:plotX-3,y:plotX-3,width:6,height:6});
	}  
	if(this.showPoints)
		data.forEach(row=>{
			dataY=this.yPositionScale(row[y]);
			if(dataY)
				this.graph(baseAttributes,{action:"circle",cx:this.xPositionScale(row[0]),cy:dataY,r:3});
		});
	if(errors) throw Error(errors);
};
IChart.prototype.plotSet=function(y, offset, data) {
	let points="";
	const axisXPosition=this.chart.axis.x.position;
	data.forEach((row,i)=>{
		const d=row[y];
		if(d){
			const xPos=axisXPosition+Math.floor((i)*this.tickIncrement)+(y-1)*this.barWidth;
			const yPos=this.yPosition(this.scaleY(d));
			points+= " "+xPos+","+yPos;
			if(this.showPoints)
				this.graph({action:"circle",cx:plotX,cy:plotY,r:3,stroke:color,"stroke-width":this.lineWidth,fill:color});
		}
	});
	this.graph({action:"polyline",id:"polyline",points:points,stroke:this.colors[y * offset],"stroke-width":this.lineWidth,fill:"none"});
};
IChart.prototype.polarToCartesian=function(centreX, centreY, radius, angleInDegrees) {
	const angleInRadians=(angleInDegrees-90)*Math.PI/180.0;
	return centreX+(radius*Math.cos(angleInRadians))+" "+centreY+(radius*Math.sin(angleInRadians));
};
IChart.prototype.processAxis=function(axis) {
	const axisSeries=axis+"Series", axisAxis=axis+"Axis";
	this[axisSeries]=[];
	if(!this[axisAxis]) throw Error(axis+"Axis not defined");
	const thisAxis=this[axisAxis];
	const series=axis.toUpperCase().split(',');
	series.forEach(c=>thisAxis.push(c));
	if(!axis.length) throw Error(axis+"Axis has no valid values for the database version, "+thisAxis+"Axis: "+this[axisSeries]);
};
IChart.prototype.processDelta=function() {
	if(!this.delta) return;
	const deltaArray=this.delta;
	deltaArray.push(this.chart.axis.x.column.name);
	deltaArray.forEach(columnName=>{
		const column=this.dataStore.columns[columnName];
		const i=column.offset;
		if(!column.isMeasure()) {
			if(j<deltaArray.length-1) throw Error("delta column "+columnName+" not numeric but "+this.baseTableData.columnsInfo.type[i]);
			remove=deltaArray.pop();				
		}
		this.deltaCol[i]=column.type;
	});
	this.xNormliseFactor=this.deltaNormaliser;
	if(this.dataStore.columns[this.columnIndex[0]].isTimestamp()){
		this.xNormliseFactor=this.xNormliseFactor**1000;
	}
};	
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
	this.setColumnIndexDetails("y");
};
IChart.prototype.processParameters=function(pageoptions) {
	this.setOptions(pageoptions);
	this.processAxis("y");
	if(this.zAxis) this.processAxis("z");
	this.check("highlight",['first','last','']);
	this.check("chart.legend.display",['show','hide']);
	this.check("slices",['row','column']);

	if(this.grouping!=null) 
		this.grouping=this.grouping.toUpperCase();
	else if(this.baseTableData.primaryKeys.length>0)
		this.grouping=this.baseTableData.primaryKeys.toString();
	if(Object.isString(this.scaleUpOnly)) this.scaleUpOnly=(this.scaleUpOnly=='true'); 
	if(Object.isString(this.scaleDownOnly)) this.scaleDownOnly=(this.scaleDownOnly=='true'); 
	if(this.delta) this.delta=this.delta.toUpperCase();
	switch (this.chart.type) {
	case 'bubble':
	case 'bubbleandline':
		this.checkExists(this.zAxis,'Missing parameter zAxis');
	case 'line':
	case 'pushline':
	case 'setline':
		this.checkExists(this.chart.axis.x.column.name,'Chart type: '+this.chart.type+' is missing parameter chart.axis.x.column.name');
	case 'stack':
	case 'bar':
	case 'pie':
	case 'events':
		this.checkExists(this.chart.axis.y.column.name,'Missing parameter chart.axis.y.column.name');
		break;
	default:
		throw Error('Unknown chart type: ' + this.chart.type);
	}
	if(this.isPieChart) {
		this.grouping=null;
		this.chart.axis.y.scale.type="NOAXIS";
	}
	this.chart.axis.y.scale.type=this.chart.axis.y.scale.type.toUpperCase();
};
IChart.prototype.refresh=function() {
	this.firstChartLoad=true;
	this.retrieveTableData();
};
IChart.prototype.renderTableData=function() {
	if(this.isPushline) {
		let points="";
		for(let i=0; i<this.data.length; i++) {
			const d=c[i][j]; //what is j???
			if(d==null) continue;
			const xPos=this.chart.axis.x.position+Math.floor((i)*this.tickIncrement)+(j-1)*this.barWidth;
			const yPos=this.yPositionScale(d);
			points+= " "+xPos+","+yPos;
			if(this.showPoints)	
				this.graph({action:"circle",cx:plotX,cy:plotY,r:3,stroke:color,"stroke-width":this.lineWidth,fill:color});
		}
		this.graph({action:"polygon",points:points,stroke:"black","stroke-width":this.lineWidth});
	};
	if(this.firstChartLoad && this.delta==null && this.autoDelta)
		this.delta=this.dataStore.structure.filter(c=>c.isAccumulation).map(c=>c.name).join();
	this.buildDataSet();
	this.chartSize();
};
IChart.prototype.resizeChart=function() {
	const paneSize=this.getPaneSize(),
		axisX=this.chart.axis.x,
		axisY=this.chart.axis.y,
		axisOffset= this.chart.axis.offset;
	this.chart.width=paneSize.width;
	this.chart.height=paneSize.height;
	const colY=this.columnIndexDetails.y;
	if(this.iFormat.isMeasure(this.dataType[0])) {
		if(this.columnIndex[0]==null) {
			this.dataMin[0]=0.5;
			this.dataMax[0]=1.5;
			// xTicks built whilst building data
		} else if(this.dataMin[0]==this.dataMax[0]) {
			this.dataMin[0]=this.dataMax[0]-1;
			this.dataMax[0]=this.dataMax[0]+1;
		} 
		axisX.position=axisOffset;
		this.xMax=this.chart.width-axisOffset-6;
		this.xRatio=this.xMax/(this.dataMax[0]-this.dataMin[0]);
		this.xOffset=this.chart.axis.x.position-this.scaleX(this.dataMin[0]);
		this.xTicks=this.calculateTicks(this.dataMax[0],this.dataMin[0],this.dataType[0],0);
	} else if(this.iFormat.isString(this.dataType[0]) && this.isCartezian) {
		axisX.position=axisOffset;
		this.xMax=this.chart.width-axisOffset;
	}
	axisY.position=this.chart.height-axisOffset;
	this.yMax=axisY.position-5;
	this.dataMinYAxis=axisY.lowerBound||this.isCartezian?0:this.dataMax[1];
	this.dataMaxYAxis=axisY.upperBound||this.isCartezian?0:this.dataMin[1];

	if(this.isLine) {
		for(let i=colY.start; i<colY.end; i++)
			if(this.dataMaxYAxis<this.dataMax[i]) this.dataMaxYAxis=this.dataMax[i];
		if(axisY.upperBound==null)
			this.dataMaxYAxis=this.dataMaxYAxis*1.1;
	} else if(this.isCartezian) {
		for(let i=colY.start; i<colY.end; i++) {
			if(this.dataMax[i]==null) continue;
			this.dataMaxYAxis+=this.dataMax[i];
		}
		if(axisY.upperBound==null)
			this.dataMaxYAxis=this.dataMaxYAxis*1.01;
	} else {
		for(let i=colY.start; i<colY.end; i++) {
			if(this.dataMaxYAxis<this.dataMax[i]) this.dataMaxYAxis=this.dataMax[i];
			if(this.dataMinYAxis>this.dataMin[i]) this.dataMinYAxis=this.dataMin[i];
		}
		if(!this.dataMaxYAxis) this.dataMaxYAxis=1;
		if(!this.dataMinYAxis) this.dataMinYAxis=0;
		if(this.dataMinYAxis==this.dataMaxYAxis && this.dataMaxYAxis==0)  this.dataMaxYAxis=1;
//		if(axisY.lowerBound==null) this.dataMinYAxis=this.dataMinYAxis*0.99;
//		if(axisY.upperBound==null) this.dataMaxYAxis=this.dataMaxYAxis*1.01;
	}

	if(this.zAxis) {
		var zDetails=this.columnIndexDetails.z;
		this.zDataMax=null;
		this.zDataMin=null;
		this.zRatioColumns=[];
		for(i=0;i<zDetails.dataMin.length;i++) {
			if(this.zDataMax<zDetails.dataMax[i]) this.zDataMax=zDetails.dataMax[i]; 
			if(this.zDataMin>zDetails.dataMin[i]) this.zDataMin=zDetails.dataMin[i];
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
			if(isNaN(ratio.zRatio)) throw "z ratio calculation error, charting width:"+ this.yMax + " max:"+ zDetails.dataMax[i] + " min:"+ zDetails.dataMin[i];
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
	switch (axisY.scale.type) {
	case "AUTO" :
		if(!this.scaleUpOnly || this.scaleUpOnly && axisY.scale.max<this.dataMaxYAxis)
			axisY.scale.max=this.dataMaxYAxis;
		if(!this.scaleDownOnly || this.scaleDownOnly && axisY.scale.min>this.dataMinYAxis)
			axisY.scale.min=this.dataMinYAxis;
	case "FIXED" :
		this.yRatio=this.yMax/(this.dataMaxYAxis-this.dataMinYAxis);
		if(this.yRatio==Infinity) this.yRatio=1
		if(isNaN(this.yRatio)) throw "y ratio calculation error, charting width:"+ this.yMax + " max:"+ this.dataMaxYAxis + " min:"+ this.dataMinYAxis;
		this.yOffset= axisY.position+this.scaleY(this.dataMinYAxis);
		if(isNaN(this.yOffset)) throw "y offset calculation error, start position:"+ axisY.position + " plot value:"+ this.dataMinYAxis + " ratio:"+ this.yRatio;
		this.yTicks=this.calculateTicks(this.dataMaxYAxis,this.dataMinYAxis,this.dataType[1],1);
		break;
	case "EXPONENTIAL" : // graphing zero and below in exponential doesn't work
		if(this.dataMaxYAxis<=0) this.dataMaxYAxis=1;
		if(this.dataMinYAxis<=0) {             
			this.dataMinYAxis=this.dataMaxYAxis;
			for(let row=0; row<this.data.length; row++) {
				for(let i=colY.start; i<colY.end; i++) {
					const y=(this.deltaIndex[this.columnIndex[i]]?this.deltaData[row][i]:this.data[row][i]);
					if((y||0)<=0 ) continue;
					if(y<this.dataMinYAxis) this.dataMinYAxis=y;
				}
			}
			this.dataMinYAxis=this.dataMinYAxis*0.9;
		}  
		this.yRatio=this.yMax/(Math.log(this.dataMaxYAxis) - Math.log(this.dataMinYAxis));
		if(this.yRatio==0) this.yRatio=1;
		this.yOffset= axisY.position+Math.floor(this.scaleY(this.dataMinYAxis));
		this.yTicks=[];
		let k=0;
		for(let i=20; i>-20 && k<8 ; i--) {
			const v=Math.pow(10,i);
			if(v>this.dataMaxYAxis || v<this.dataMinYAxis) continue;
			this.yTicks[k++]=(v/10)*10;
		} 
		if(k=0) {
			const mid=this.dataMinYAxis+(this.dataMaxYAxis-this.dataMinYAxis)/2;
			for(let i=20; i>-20; i--)
				if(Math.pow(10,i) > mid) continue;
			for(let j=1; j<10; j++) {
				if(Math.pow(10,i)*j<mid) continue;
				this.yTicks[0]=Math.pow(10,i)*j;
				break;
			}
		} 
		break;
	case "NOAXIS" :
		break; 
	default:
		throw "unknown y scaling: " + axisY.scale.type;
	}
};
IChart.prototype.scaleArray=function(a,r) {
	return a.map(c=>c.map((c0,i)=>c0*r[i]));
};
IChart.prototype.scaleNormalY=function(value){
	return value*this.yRatio;
};
IChart.prototype.scaleExponentialNormalY=function(value){
	return value>0?Math.log(value)*this.yRatio:value<=0?Math.log(this.dataMinYAxis*0.1)*this.yRatio:null;
};
IChart.prototype.scaleX=function(value) {
	return value*this.xRatio;
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
IChart.prototype.setColumnIndexDetails=function(axis) {
	var isYAxis=(axis=="y");
	if(this.columnIndexDetails==null) this.columnIndexDetails={};
	if(this.columnIndexDetails[axis]==null) 
		this.columnIndexDetails[axis]={
			columnIndex:[null]
			,dataType:[null]
			,dataStore:[null]
			,dataMin:[null]
			,dataMax:[null]
			,deltaData:[null]
			,deltaIndex:[null]
			,group:[null]
			,label:[null]
			,start: this.columnIndex.length
		};
	const columnIndexDetails=this.columnIndexDetails[axis];
	const series=this[axis+"Series"];
	if(isYAxis)
		series.forEach(c=>this.setColumnDetails(this.columnIndex.length,c))
	else
		series.forEach(c=>this.setColumnDetailsAxis(columnIndexDetails,c));
	columnIndexDetails.end=(axis=="y"?this.columnIndex.length:columnIndexDetails.columnIndex.length);
	columnIndexDetails.size=columnIndexDetails.end-columnIndexDetails.start;
	if(isYAxis && this.zAxis) this.setColumnIndexDetails("z");
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
	this.deltaIndex[column.offset]=( this.delta==null ? false : (this.deltaCol[index]!==undefined) );
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
	columnDetails.deltaIndex[i]=( this.delta==null ? false : (this.deltaCol[i]!=undefined) );
};
IChart.prototype.setColorPallet=function() {
	this.colorPallet=[];
	const delta=255/5;
	let x=0,i,j,k;
	for(i=0;i<5;i++)
		for(j=0;j<5;j++)
			for(k=0;k<5;k++)
				this.colorPallet[x++]='rgb(' + Math.floor(i*delta) + ',' + Math.floor(j*delta) + ','+ Math.floor(k*delta) +')';
};
IChart.prototype.setDefaultSettings=function() {
	const columns=this.dataStore.columns;
	this.ySeries=this.dataStore.structure.filter(c=>columns[c.name].isMeasure()).map(c=>c.name);
};
IChart.prototype.setData=function(tableData) {
	this.firstChartLoad=true;
	if(!this.ySeries) this.setDefaultSettings();
	this.localDataSet=this.dataStore.Data;
	if(this.flipDataSet)			
		this.localDataSet.reverse();
	this.renderTableData();
};
IChart.prototype.setDataAxis=function(axis,row,x,i) {
	const colDetails=this.columnIndexDetails[axis];
//	value=(row==null?null:this.iFormat.dataConversion(i,row[colDetails.columnIndex[i]]));
	const columnIndex=colDetails.columnIndex[i];
	const value=(row==null?null:row[columnIndex]);
	if(colDetails.dataStore[x]==null) {
		colDetails.dataStore[x]=[];
		colDetails.deltaData[x]=[];
	}
	colDetails.dataStore[x][i]=value;
	const xLast=x-1;
	if(colDetails.deltaIndex[columnIndex]) {
		if(i==0) {
			if(x) {
				const deltaData=colDetails.deltaData[xLast];
				deltaData[0]=value-colDetails.data[xLast][0];
				this.xNormaliser=deltaData[0]/this.xNormliseFactor;
			}
		} else { 
			if(x) {
				value=(value - colDetails.dataStore[xLast][i]) / this.xNormaliser;
				colDetails.deltaData[xLast][i]=value; 
			} else value=null;
		}
	}
	this.setMaxMin(colDetails, i, value);
};
IChart.prototype.setDataStore=function(dataStore) {
	this.dataStore=dataStore;
};
IChart.prototype.setGroupingValue=function(newGroupingValue) {
	if(this.groupValue.includes(newGroupingValue)) return;
//	this.group[0]=this.groupingValue;
	if(!this.groupValue.includes(this.groupingValue)){
		this.groupValue.push(this.groupingValue);
		this.setColumnIndexDetails("y");
	}
};	
IChart.prototype.setMenuOptions=function(menuArray=[]) {
	let options=[];
	switch (this.chart.type) {
	case 'pie':
		options.push(this.menuButton("Slice","slices","row","column"));
		break;
	case 'bubble':
	case 'bubbleandline':
	case 'line':
		options.push(this.menuButton("Y Scaling","chart.axis.y.scale.type","AUTO","EXPONENTIAL"));
		break;
	case 'pushline':
	case 'setline':
		options.push(this.menuButton("Chart Type","chart.type","setline","setline"));
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
IChart.prototype.setMaxMin=function(base,i,value) {
	if(base.dataMin[i]==null) {
		base.dataMin[i]=value;
		base.dataMax[i]=value;
	} else if(base.dataMin[i]>value)
		base.dataMin[i]=value;
	else if(base.dataMax[i]<value) 
		base.dataMax[i]=value;
};
IChart.prototype.setMetrics=function(select) {
	this.ySeries=select.options.filter(c=>c.selected).map(c=>c.value);
	this.chart.axis.y.column.name=this.ySeries.join();
	this.renderTableData();
};
IChart.prototype.setProperty=function(inputElement) {
	this[inputElement.name]=inputElement.children.filter(c=>c.selected).map(c=>c.value);
	this.renderTableData();
};
IChart.prototype.setParameter=function(element) {
	this[element.name]=element.value;
	switch (name) {
	case 'chart.legend.display': 
		this.chart.legend.display=element.value;
		this.legend.setStyle({'display': (this.chart.legend.display=="hide"?"none":"block")});
		elment.value (this.chart.legend.display=="hide"?"show":"hide");
	}
	this.chartSize();
	switch (element.name) {
	case 'slices': 
		element.value=(element.value=='row'?'column':'row');
		break;
	case 'chart.axis.y.scale.type':
		element.value=(element.value=='AUTO'?'EXPONENTIAL':'AUTO');
		break
	case 'chart.type': 
		switch (this.chart.type) {
		case 'bar': 
			element.value='stack';
			break;
		case 'stack':
			element.value='bar';
			break;
		case 'setline':
			element.value='pushline';
			break;
		case 'pushline':
			element.value='setline';
			break;
		}
	case 'display':  //?? change to button
		this.tableData.display();
	}
};
IChart.prototype.xPositionScale=function(value) {
	return (this.xOffset+value*this.xRatio);
};
IChart.prototype.xPosition=function(value) {
	return this.xOffset+value;
};
IChart.prototype.yPosition=function(value) {
	return value==null?this.chart.axis.y.position:value==Infinity?0:value==-Infinity?this.yOffset:this.yOffset-value;
};
IChart.prototype.yPositionScale=function(value) {
	return this.yPosition(this.scaleY(value));
};