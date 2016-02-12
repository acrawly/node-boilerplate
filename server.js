/* jshint undef: true, unused: false */
/* globals require: true */


var express = require('express'); //call express
var app = express(); //define our app using express
var bodyParser = require('body-parser'); //get body-parser
var morgan = require('morgan'); //used to see requests
var path = require('path');
var config = require('./app/config/config.js');
var bookshelf = require('./app/config/bookshelf')(config);





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



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use(function(req,res,next) {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
});

//log all requests to the console
app.use(morgan(config.env));

//expose public directory
app.use(express.static(__dirname + '/public'));



//ROUTES for API
//============================================

//API ROUTES ---------------------------------
var apiRoutes = require('./app/routes/api.js')(app, express);
app.use('/api', apiRoutes);


//MAIN CATCHALL ROUTE -----------------
//SEND USERS TO FRONTEND --------------
//has to be registered after API ROUTES
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

//START THE SERVER
//=================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);


//***** EVERYTHING FROM HERE DOWN IS OLD AND MUST GO, PLEASE ONLY USE FOR REFERENCE
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

