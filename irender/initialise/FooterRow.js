function FooterRow(b,p,n,o) {
	this.element=createElement("TR",(o&&o.style?o.style:"Footer"),n);
	this.center=createElement("TD",(o&&o.style?o.style:"Footer")+"Cell",this.element);
	this.center.appendChild(createNode(p.footer||"No Title Set"));
}