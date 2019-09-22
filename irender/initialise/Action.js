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

Action.prototype.exec_fileReader = function (e) {
	    const action=this
	    	,request=new XMLHttpRequest();
	    request.onreadystatechange= function() {
	        if (request.readyState==4 && request.status==200) {
	            var regexp = /(?<=addRow\()(.*\n?)(?=\))/gi;      // (?<=beginningstringname)(.*\n?)(?=endstringname)
				var matches = xmlhttp.responseText.match(regexp);
	        }
	    }
	    request.onerror = function(progress){
	    	action.setCatchError(e,new Error("Load failed, check log for details"));
	    };
	    request.open("GET", "file:"+this.passing);
	    request.withCredentials = "true";
    	request.send();
	};
Action.prototype.exec_floatingPane = function (e,ev,p) {
	if(e.pane && e.pane.hasOwnProperty('dependants') && e.pane.dependants.hasOwnProperty(this.id)) {
		e.pane.dependants[this.id].open();
		return;
	}
	new PaneFloat(this.base,
		this.base.getPane(this.pane),  //paneProperties
		Object.assign({y:ev.pageY,x:ev.pageX},this.passing,p),  // options
		this.getTarget(e),
		this  // action
	);
};
Action.prototype.exec_folder = function (e) {
		if(e.isExpanded()) {
			e.setCollapsed();
		} else {
			e.setExpanded();
		}
};
Action.prototype.exec_httpGet = function (e) {
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
    	action.setCatchError(e,new Error("http get failed, check log for details"));
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
Action.prototype.exec_googleMap = function (e) {
		try{
		    const mapOption=coalesce(this.passing,{
			        center: new google.maps.LatLng(51.5, -0.12),
			        zoom: 10,
			        mapTypeId: google.maps.MapTypeId.HYBRID
			    });
			e.map = new google.maps.Map(e.element, mapOptions);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.exec_link = function (e) {
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
		e.setDetail(this.title,iframe);
	};
Action.prototype.exec_menu = function (e) {
		new Error("to be done");
	};
Action.prototype.exec_pane = function (e) {
		const p=new Pane(this.base,Object.assign({tab:false},this.base.getPane(this.pane)));
		e.setDetail(this.title,p.element);
		if(this.setDetail) this.setDetail.apply(e,[p]);
	};
Action.prototype.exec_states = function (e) {
		e.nextState(this);
	};
Action.prototype.exec_svg = function (e) {
		let svg=new Svg(this.base,this.passing).element,
			p=new Pane(this.base,Object.assign({tab:false},this.base.getPane(this.pane)),svg);
		e.setDetail(this.title,p.element);
		try{
			p.setDetail(svg);
		} catch(ex) {
			this.setCatchError(e,ex);
		}
	};
Action.prototype.exec_table = function (e) {
		const t=css.setClass(document.createElement("DIV"),"FullSize");
		new ITableDataRender(t,e.passing.url||this.url)
		e.setDetail(e.title||this.title,t);
		if(this.setDetail) this.setDetail.apply(e,[p]);
	};
Action.prototype.getTarget = function (e) {
		return (this.target||this.passing.target||e.getTarget?e.getTarget():null)
	};
Action.prototype.iframeLoad = function (ev) {
		if(ev.currentTarget.childElementCount>0) return;
		this.iframeError(ev);
	};
Action.prototype.iframeError = function (ev) {
		const base = ev.currentTarget.parentElement
		base.removeChild(base.firstChild);
		new TextArea("Load failed, check log for details",null,base); 
	};
Action.prototype.setCatchError = function (e,ex) {
		console.error("IRender action "+this.type+" error: "+ex+"\nStack: "+ex.stack);	
		e.setDetail(this.title,new TextArea(ex.toString()+"\nStack: "+ex.stack).element).setFullSize();
	};
