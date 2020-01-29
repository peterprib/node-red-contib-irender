/*
 * options:
 * max
 * min
 */

function Axis(options){
	Object.assign(this,{
			direction:"horizontal",
			bound:{lower:null,upper:null},
			line:{action:"line",width:1,stroke:"black","stroke-width":1},
			offset:20,
			position:0,
			scaling:{
				type:"Fixed",
				down:true,
				up:true
			},
			scaleUpOnly:false,
			scaleDownOnly:false,
			text:{action:"text","text-anchor":"end","font-size":10,size:10},
			tick:{increment:5,count:10},
			type:"number"
		},
		options
	);
	if(this.column) {
		this.type=this.column.type;
	};
	this.draw=this.direction=="vertical"?this.drawVertical:this.drawHorizontal;
	if(this.getMin()==this.getMax()) {
		if(this.max==0) {
			this.max=1;
		} else {
			this.min*=0.99;
			this.max*=1.01;
		}
	}
	this.setType(this.type||"number");
}
Axis.prototype.drawHorizontal=function(){
	this.setPositionAjustment=this.setPositionAjustmentHorizontal;
	this.chart.range=this.chart.width - this.chart.offset;
	this.position=this.chart.height-this.chart.offset;
	this.setScaling();
	this.chart.graph({
			x1:this.chart.offset,y1:this.position,
			x2:this.chart.width,y2:this.position
		},
		this.line
	);
	const tickBase=Object.assign({y1:this.position-5,y2:this.position+5},this.line);
	const tickTextBase=Object.assign({y:this.position+7+this.text["font-size"]/2},this.text);
	this.getTicks().forEach(tick=>this.drawTickHorizontal(tick,tickBase,tickTextBase));
};
Axis.prototype.drawVertical=function(){
	this.setPositionAjustment=this.setPositionAjustmentVertical;
	this.chart.range=this.chart.height - this.chart.offset;
	this.position=this.chart.offset;
	this.setScaling();
	this.ratio=-this.ratio
	this.chart.graph({
			x1:this.position,y1:this.chart.height-this.chart.offset,
			x2:this.position,y2:0
		},
		this.line
	);
	const tickBase=Object.assign({x1:this.chart.offset-5,x2:this.chart.offset+5},this.line);
	const tickTextBase=Object.assign({x:this.chart.offset-5},this.text);
	this.getTicks().forEach(tick=>this.drawTickVertical(tick,tickBase,tickTextBase));
};
Axis.prototype.drawTickHorizontal=function(tick,tickBase,tickTextBase) {
	const x=this.getPosition(tick),
		label=this.column.getAbbreviatedValue(tick);
	this.chart.graph({x1:x,x2:x},tickBase);
	if(label!==null)
		this.chart.graph({x:x,children:[label]},tickTextBase);
};
Axis.prototype.drawTickVertical=function(tick,tickBase,tickTextBase) {
	const y=this.getPosition(tick),
		label=this.column.getAbbreviatedValue(tick)
	this.chart.graph({y1:y,y2:y},tickBase);
	if(!(label==null))
		this.chart.graph({y:y+5,children:[label]},tickTextBase);
};
Axis.prototype.getAbbreviatedValue = function(value) {
	if(this.formatAbbreviateFunction===undefined) this.formatAbbreviate=iFormat.getFormatAbbreviatedFunction(this.type)
	return this.formatAbbreviateFunction(value,this.precision);
};
Axis.prototype.getCount = function() {
	if(this.count==null)
		this.count=this.column.getCount();
	return this.count;
};
Axis.prototype.getMax = function() {
	if(this.max==null)
		this.max=this.columns
			?this.columns.reduce((a,c)=>Math.max(c.getMax(),a),null)
			:this.column.getMax();
	return this.max;
};
Axis.prototype.getMin = function() {
	if(this.min==null)
		this.min=this.columns
			?this.columns.reduce((a,c)=>Math.min(c.getMin(),a),null)
			:this.column.getMin();
	return this.min;
};
Axis.prototype.getPosition = function(value) {
	return this.positionAjustment+this.scale(value);
};
Axis.prototype.getRange=function() {
	if(this.range==undefined) this.range=this.getMax()-this.getMin();
	return this.range;
};
Axis.prototype.getRatio = function() {
	if(this.ratio==null)
		this.ratio=this.getMax()/this.getRange();
	return this.ratio;
};

Axis.prototype.getTicksMeasure=function(metric) {
	this.tick.positions=[];
	this.tick.span=this.getRange()/this.tick.count;
	let value=this.min;
	while (value<=this.max) {
		this.tick.positions.push(value);
		value+=this.tick.span;
	}
	this.setPositionAjustment(this.tick.positions[0]);
	return this.tick.positions;
};
Axis.prototype.scaleExponential=function(value){
	const ratio=this.ratio||this.getRatio();
	return value==0
		?0
		:value>0
			?Math.log(value*ratio)
			:-Math.log(-value*ratio);
};
Axis.prototype.scaleFixed = function(value) {
	return value*(this.ratio||this.getRatio());
};
Axis.prototype.scale=Axis.prototype.scaleFixed;

Axis.prototype.setScaling = function() {
	this["setScaling"+this.scaling.type]();
};
Axis.prototype.setScalingAuto = function() {
//	if(this.scaling.up)
//		this.max=this.dataMaxaxisY;
//	if(this.scaling.down)
//		this.min=this.dataMinaxisY;
	this.setScalingFixed();
};
Axis.prototype.setScalingFixed = function() {
	this.scale=this.scaleFixed;
	this.ratio=this.chart.range/this.getRange();
	if(this.ratio==Infinity) this.ratio=1
	if(isNaN(this.ratio)) throw "ratio calculation error, charting size :"+ this.chart.range + " max:"+ this.max+ " min:"+ this.min;
};
Axis.prototype.setScalingExponential = function() {
	this.scale=this.scaleExponential;
	this.getPosition=this.getPositionExponential;
	this.ratio=this.chart.range/(Math.log(this.min) - Math.log(this.max));
	if(this.ratio==0) this.ratio=1;
};
Axis.prototype.setTickCount=function(count) {
	this.this.tick.count=count;
	if(this.tick.count>10) {
		this.tick.count=10;
	} else if(this.tick.count<1) {
		this.tick.count=1;
	}
	return this;
};
Axis.prototype.setPositionAjustmentHorizontal = function(value) {
	this.positionAjustment=this.offset-this.scale(value);
};
Axis.prototype.setPositionAjustmentVertical = function(value) {
	this.positionAjustment=this.chart.height-this.offset-this.scale(value);
};
Axis.prototype.setType=function(type) {
	if(type) this.type=type;
	if(iFormat.isMeasure(type)) {
		this.getTicks=this.getTicksMeasure;
	} else {
		throw 'Unknown type: "'+type+'" for axis tick creation, check types are numeric';
	}
	return this;
};
