function Action (b,p) {
	Object.assign(this,{passing:{}},p);
	this.base=b;
	const a=b.actions[p.id];
	try{
		this.exec=this["exec_"+this.type];
	} catch (e) {
		throw Error(this.type+" action not valid");	
	}
};
Action.prototype.exec_chart = function (node,ev,properties) {
	try{
		const chart=new IChart(this.base,this.passing,{loadDefer:true}),
			load={callFunction:chart.setData,object:chart,onError:chart.displayError},
			pane=new Pane(this.base,
				Object.assign({tab:false,title:node.title||""},this.base.getPane(this.pane||"_tabPane"),this.passing),
				chart.element
			),
//			floatingPane=this.exec_floatingPane(chart.element,{onCloseHide:true,initiallyHide:true},pane),
			floatingPane=this.exec_floatingPane(
				chart,	//base 
				ev,
				{onCloseHide:true,initiallyHide:true},
				{parent:pane}
			),
			table=this.exec_table(floatingPane.getPane(),
				Object.assign({onLoad:load},node.passing,this.passing)
			);
		chart.setDataStore(table);
		node.setDetail(this.title,pane.element);
		pane.setDetail(chart.element);
//		.addAction({id:"charDisplay",type:"floatingPane",function:floatingPane.show})

		pane.headerRow.addRight([{image:"tableIcon",callFunction:floatingPane.show,object:floatingPane}]);
//		pane.headerRow.addRight([{image:"tableIcon",action:"display",tableData:table}]);
		pane.headerRow.addRefresh({callFunction:chart.refresh,object:chart}); 
	} catch(ex) {
		this.setCatchError(node,ex);
	}
};
Action.prototype.exec_fileReader = function (node) {
	    const action=this
	    	,request=new XMLHttpRequest();
	    request.onreadystatechange= function() {
	        if (request.readyState==4 && request.status==200) {
	            var regexp = /(?<=addRow\()(.*\n?)(?=\))/gi;      // (?<=beginningstringname)(.*\n?)(?=endstringname)
				var matches = xmlhttp.responseText.match(regexp);
	        }
	    }
	    request.onerror = function(progress){
	    	action.setCatchError(node,new Error("Load failed, check log for details"));
	    };
	    request.open("GET", "file:"+this.passing);
	    request.withCredentials = "true";
    	request.send();
	};
Action.prototype.exec_floatingPane = function (node,ev,properties,target) {
	if(node.pane && node.pane.openDependant(this.id)){
		return;
	}
	return new PaneFloat(this.base,
		Object.assign({},this.base.getPane(this.pane||"_tabPane"),this.passing,properties),  //paneProperties
		Object.assign({y:ev.pageY,x:ev.pageX},this.passing,properties),  // options
		target||this.getTarget(node),
		this,  // action
		target.parent.element //floatHandle
	);
};
Action.prototype.exec_folder = function (node) {
	return node.toggle();
};
Action.prototype.exec_function = function (node,ev,properties) {
	const targetNode=node.getTarget();
	targetNode[this.name].apply(targetNode,[node,ev,properties]);
};
Action.prototype.exec_httpGet = function (node) {
	let action=this,
		httpRequest = new XMLHttpRequest();
	if (!httpRequest) throw Error("Failed to get http request");
/*
	httpRequest.onreadystatechange = function() {
		try{
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
		        if (httpRequest.status === 200) {
		        	action.setDetail(httpRequest.responseText);
		        } else {
		        	action.error.apply.('There was a problem with the request.');
		        }
		      }
		}
	};
*/
    request.onerror = function(progress){
    	action.setCatchError(node,new Error("http get failed, check log for details"));
    };
/*   
    httpRequest.addEventListener('loadstart', handleEvent);
    httpRequest.addEventListener('load', handleEvent);
    httpRequest.addEventListener('loadend', handleEvent);
    httpRequest.addEventListener('progress', handleEvent);    // function (event) 
    httpRequest.addEventListener('error', handleEvent);
    httpRequest.addEventListener('abort', handleEvent);
    httpRequest.addEventListener('timeout', handleEvent);
*/   
     
	httpRequest.open('GET', this.url);
	httpRequest.ontimeout = () => {
	    console.error('Timeout!!')
	};

	
/*
XMLHttpRequest.onprogress = function (event) {
  event.loaded;
  event.total;
};
 */
	httpRequest.timeout = action.timeout||10000; // time in milliseconds

	httpRequest.onload = function () {
		action.setDetail(httpRequest.responseText);
	};

	xhr.ontimeout = function (e) {
		if(action.ontimeout) {
			this.ontimout.apply(this.getTarget(e),[e]);
			return;
		}
    	action.setCatchError(e,new Error("timed out, check log for details"));
	};
    request.withCredentials = "true";
	httpRequest.send();
};
Action.prototype.exec_googleMap = function (node) {
	try{
	    const mapOption=coalesce(this.passing,{
		        center: new google.maps.LatLng(51.5, -0.12),
		        zoom: 10,
		        mapTypeId: google.maps.MapTypeId.HYBRID
		    });
		e.map = new google.maps.Map(node.element, mapOptions);
	} catch(ex) {
		this.setCatchError(node,ex);
	}
};
Action.prototype.exec_link = function (node) {
	console.log("Action exec_Link");
	if(this.target==null) {
		window.open(this.url);
		return;
	}
	if(this.target=='_blank') {
		window.open(this.url, '_blank').focus();
		return;
	}
	const iframe=css.setClass(document.createElement("IFRAME"),"FullLeft");
	iframe.sandbox="allow-same-origin allow-scripts allow-popups allow-forms";
	iframe.addEventListener('load', this.iframeLoad.bind(this), false);	
	iframe.addEventListener('error', this.iframeError.bind(this), false);	
	iframe.referrerPolicy = "unsafe-url";
	iframe.src=this.url;
	iframe.style="display: inline;";
	iframe.scrolling="auto";
	node.setDetail(this.title,iframe);
};
Action.prototype.exec_menu = function (node) {
	new Error("to be done");
};
Action.prototype.exec_pane = function (node) {
	const p=new Pane(this.base,Object.assign({tab:false},this.base.getPane(this.pane)));
	node.setDetail(this.title,p.element);
	if(this.setDetail) this.setDetail.apply(node,[p]);
};
Action.prototype.exec_states = function (node) {
	node.nextState(this);
};
Action.prototype.exec_svg = function (node) {
	let svg=new Svg(this.base,this.passing).element,
		p=new Pane(this.base,Object.assign({tab:false},this.base.getPane(this.pane)),svg);
	node.setDetail(this.title,p.element);
	try{
		p.setDetail(svg);
	} catch(ex) {
		this.setCatchError(node,ex);
	}
};
Action.prototype.exec_table = function (node,p) {
	const div=css.setClass(document.createElement("DIV"),"FullSize");
	div.IRender=node;
	const tableData=new ITableDataRender(div,
		Object.assign({}, p, {url: ((node.passing||{}).url||p.url||this.url) })
	);
	node.setDetail(node.title||this.title,div);
	if(this.setDetail) this.setDetail.apply(node,[p]);
	return tableData;
};
Action.prototype.getTarget = function (node) {
	return (this.target||this.passing.target||node.getTarget?node.getTarget():null)
};
Action.prototype.iframeLoad = function (ev) {
	if(ev.currentTarget.childElementCount>0) return;
	this.iframeError(ev);
};
Action.prototype.isPane = ((node) => {
	return node instanceof Pane;
});
Action.prototype.iframeError = function (ev) {
	const base = ev.currentTarget.parentElement
	base.removeChild(base.firstChild);
	new TextArea("Load failed, check log for details",null,base); 
};
Action.prototype.setCatchError = function (node,ex) {
	console.error("IRender action "+this.type+" error: "+ex+"\nStack: "+ex.stack);	
	node.setDetail(this.title,new TextArea(ex.toString()+"\nStack: "+ex.stack).element).setFullSize();
};