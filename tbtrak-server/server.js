/* jshint undef: true, unused: false */
/* globals require: true */


var express = require("express");
var bodyParser = require('body-parser');
var vehicleBroker = require("./vehicleBroker.js");

//var multer = require('multer'); 
var Harvest = require("harvest");

var harvest = new Harvest({
        subdomain: "crawfordworks",
        email: "andrew@crawford.works",
        password: "@ndr3W12"
    });
   




var app = express();



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data


//setup harvest connection for all requests
app.use(function(req,res,next){
    req.vehicleBroker = new vehicleBroker(
      {
        host: "localhost",
        user: "root",
        password: "password",
        database: "tbtrak",
        baseURI: "/vehicles"
      }
    );
    req.projects = harvest.Projects;

    next();
});



//routes

app.get('/projects', function(req, res) {
	//lists all projects
	
	req.projects.list( {} , function(err, data) {
		var result = "";
		
		if(err)
		{
			result = err;
		}
		else {
			result = data;
		}
		
		res.send(result);
	});
});

app.get('/projects/:id', function(req, res) {
	//list a project given the project id
	
	req.projects.get({id: req.params.id}, function(err, data) {
		var result = "";
		
		if(err)
		{
			result = err;
		}
		else {
			result = data;
		}
		
		res.send(result);
	});
});

app.get("/vehicles", function(req, res) {
	//returns list of all vehicles in SQLDB
	req.vehicleBroker.all(function(err, data) {
    if(err)
    {
      res.status(500);
      res.json({error: true, message: "Internal Server Error", http_code: 500});
    }
    else{
      res.json({error: false, vehicles: data});
    }
    
    req.vehicleBroker.closeBroker();
	});
	
	
});

app.get("/vehicles/:id", function(req, res) {
	
	req.vehicleBroker.getVehicleById(req.params.id, function(err, data) {
    if(err)
    {
      res.status(500);
      res.json({error: true, message: "Internal Server Error", http_code: 500});
    }
    else{
      res.json({error: false, vehicles: data});
    }
    
    req.vehicleBroker.closeBroker();
    //console.log("Broker closed");
	});
});

app.delete("/vehicles/:id", function(req, res) {
	
});

app.put("/vehicles/:id", function(req, res) {
	
});

app.get("/exhibits", function(req, res) {
	
});

app.get("/exhibits/:id", function(req, res) {
	
});

app.delete("/exhibits/:id", function(req, res) {
	
});

app.put("/exhibits/:id", function(req, res) {
	
});

	
//end of routes
	
	
	
app.listen(3000);

console.log("Server running on port 3000");
