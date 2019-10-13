function Loading (f) {
	let loading=this;
	this.head0=document.getElementsByTagName('head')[0];
	this.callOnLoaded=f;
	this.count=1
	this.scriptNode = document.currentScript;
	this.finished=function () {
		loading.count--;
		console.log('loaded, remaining '+loading.count);
		if(loading.count>0) return;
		if(loading.callOnLoaded) loading.callOnLoaded.call;
		if(loading.scriptNode.dataset.execute) {
			console.log('intial script '+loading.scriptNode.dataset.execute+' to be loaded');
			const e=document.createElement('script');
			e.type='text/javascript';
			e.src = loading.scriptNode.dataset.execute;
			loading.head0.appendChild(e);
		}
		delete loading;
	}
	this.loadJs=function (include) {
		this.count++;
		const e=document.createElement('script');
		e.type='text/javascript';
		e.src=include;
		e.onload = this.finished;
		this.head0.appendChild(e);
		console.log("load issued for: "+include);
	}
	this.loadLink=function (include) {
		var e=document.createElement('link');
		e.type='text/css';
		e.rel='stylesheet';
		e.href=include;
		this.head0.appendChild(e);
		console.log("load issued for: "+include);
	}
}
const loading=new Loading();
(function() {
	loading.loadJs("https://unpkg.com/vis-network@latest/dist/vis-network.min.js");
	loading.loadLink("https://unpkg.com/vis-network@latest/dist/vis-network.min.css");
	loading.loadJs("https://visjs.github.io/vis-timeline/dist/vis-timeline-graph2d.min.js");
	loading.loadLink("https://visjs.github.io/vis-timeline/dist/vis-timeline-graph2d.min.css");
//	loading.loadJs("https://unpkg.com/vis-graph3d@latest");
})()
loading.finished();
