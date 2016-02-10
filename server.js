/* jshint undef: true, unused: false */
/* globals require: true */


var express = require("express");
var bodyParser = require('body-parser');
var vehicleBroker = require("./vehicleBroker.js");
var _ = require('underscore');



//helper functions

function isJSON(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//end of helper functions


var app = express();



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(function(req,res,next){
  
    console.log("Time: " + Date() + ". Request Type: " + req.method + ". Request URL: " + req.originalUrl);
    
    
    res.setHeader("Access-Control-Allow-Origin", "http://localhost");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
});




//routes

app.get('*', function(req, res) {
   res.send("Hello World"); 
});

//everything below here needs to be reworked -Andrew
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
      res.json({error: true, message: err, http_code: 500});
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
      res.json({error: true, message: err, http_code: 500});
    }
    else{
      res.json({error: false, vehicles: data});
    }
    
    req.vehicleBroker.closeBroker();
	});
});

app.delete("/vehicles/:id", function(req, res) {
	req.vehicleBroker.deleteVehicleById(req.params.id, function(err, data) {
    if(err)
    {
      res.status(500);
      res.json({error: true, message: err, http_code: 500});
    }
    else{
      res.json({error: false, vehicles: data});
    }
    
    req.vehicleBroker.closeBroker();
	});
});


//the ? makes the part before it optional so the ID is not needed to hit this route
app.put("/vehicles/:id?", function(req, res) {
  //console.log(req.body);
  if(!_.isEmpty(req.body))
  {
    if(req.params.id)
    {
      req.body.id = req.params.id;
    }
    
    req.vehicleBroker.saveVehicle(req.body, function(err, data) {
      if(err)
      {
        res.status(500);
        res.json({error: true, message: err, http_code: 500});
      }
      else
      {
        res.json({error: false, vehicles: data});
      }
    
      req.vehicleBroker.closeBroker();
    });
  }
  else
  {
    res.status(400);
    res.json({error: true, message: "Vehicle information in JSON format required"});
  }

});

app.get("/exhibits", function(req, res) {
  res.sendStatus(501);
});

app.get("/exhibits/:id", function(req, res) {
  res.sendStatus(501);
});

app.delete("/exhibits/:id", function(req, res) {
  res.sendStatus(501);
});

app.put("/exhibits/:id", function(req, res) {
  res.sendStatus(501);
	
});

app.use(function(req, res){
  res.status(401);
  res.json({error: true, message: "Unauthoirzed"});
});

	
//end of routes
	
	
	
app.listen(3000);

console.log("Server running on port 3000");

