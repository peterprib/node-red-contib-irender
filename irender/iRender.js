const Logger = require("node-red-contrib-logger");
const logger = new Logger("iRender");
logger.sendInfo("Copyright 2020 Jaroslav Peter Prib");

const nodeLabel="iRender";

const fs=require('fs'),
	path=require('path'),
	mustache = require("mustache"),
	initialPath=path.join(__dirname,"initialise"),
	cookieParser = require("cookie-parser"),
	express=require("express");
let isSetup,urls={};
if(logger.active) logger.send({label:"initialise: ",files:initialPath});
function getInitial() {
	let data="";
	fs.readdirSync(path.join(__dirname,"initialise")).forEach(filename => {
//		if(logger.active) logger.send({label:"loading: ",filename:filename});
		data+=fs.readFileSync(path.join(initialPath,filename));
	});
	return data;
}
let initial=getInitial();
function setUpURL(RED,node,data,type,id) {
	const url="/"+nodeLabel+"/"+(id||"initialise");
	if(id in urls) {
		node.log("override url "+url);
		urls[id]=data;
		return;
	}
	urls[id]=data;
	node.log("establish url "+url);
	RED.httpNode.get(url,
			cookieParser(),
			(req,res,next)=>{ next(); }, //httpMiddleware
			(req,res,next)=>{ next(); }, //corsHandler,
			(req,res,next)=>{ next(); }, // metricsHandler,
			(req,res)=>{  //callback
				res.setHeader("Content-Type", type||"text/javascript");
				res.write(urls[id]);
				res.statusCode = 200;
				res.end()
			},
			(err,req,res,next)=>{ //errorHandler
				res.sendStatus(500);
			}
	);
}
const tableTemplate=fs.readFileSync(path.join(__dirname,"table.template"));
const windowTemplate=fs.readFileSync(path.join(__dirname,"window.template"));

module.exports = function (RED) {
    function redNode(config) {
        RED.nodes.createNode(this, config);
        let node=Object.assign(this,config);
        node.baseURL=nodeLabel;
        if(!isSetup) {
        	isSetup=true;
        	setUpURL(RED,node,initial);
        	node.log("establish url "+"/"+nodeLabel+"/images");
        	RED.httpNode.use("/"+nodeLabel+"/images",express.static(path.join(__dirname, 'images')));
        }
        const mainWindow = mustache.render(windowTemplate.toString(), node);
        setUpURL(RED,node,mainWindow,"text/HTML","index");
    }
    RED.nodes.registerType(nodeLabel,redNode);
};
