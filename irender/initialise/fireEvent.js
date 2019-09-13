function fireEvent(node, eventName) {
    var doc;
    if(node.ownerDocument) {
        doc = node.ownerDocument;  // ownerDocument from the provided node to avoid cross-window problems
    } else if(node.nodeType == 9){
        doc = node; // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
    } else {
        throw new Error("Invalid node passed to fireEvent: " + node.id);
    }
    if(node.dispatchEvent) {
        // Gecko-style approach (now the standard) but takes more work
        var event = doc.createEvent(this.getEventClass(eventName));
        event.initEvent(eventName, true, true); // All events created as bubbling and can be cancelled.
        event.synthetic = true; // allow detection of synthetic events
        node.dispatchEvent(event, true); // The second parameter says go ahead with the default action
    } else  if(node.fireEvent) { // IE-old school style - IE8 and lower
        var event = doc.createEventObject();
        event.synthetic = true; // allow detection of synthetic events
        node.fireEvent("on" + eventName, event);
    }
};
fireEvent.prototype.eventClasses = {
		MouseEvents: ["click", "mousedown","mouseup"]
		,HTMLEvents: ["focus","change","blur","select"]
	};
fireEvent.prototype.getEventClass = function (e) {
		for(var c in this.eventClasses) {
			for(var p in this.eventClasses[c]) {
				if(e==this.eventClasses[c][p]) return c;
			}
		}
		throw Error("fireEvent: Couldn't find an event class for event '" + eventName + "'.");
	};