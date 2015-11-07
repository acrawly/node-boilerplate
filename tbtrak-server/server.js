var express = require("express");
var bodyParser = require('body-parser');

//var multer = require('multer'); 
var Harvest = require("harvest");

var harvest = new Harvest({
        subdomain: "crawfordworks",
        email: "andrew@crawford.works",
        password: "@ndr3W12"
    });
   




var app = express();

//TO-DO put mysql access here



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(multer()); // for parsing multipart/form-data


//setup harvest connection for all requests
app.use(function(req,res,next){
    //req.db = db;
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
	
	connection.connect();

	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;
	
	  console.log('The solution is: ', rows[0].solution);
	});
	
	connection.end();
});

app.get("/vehicles/:id", function(req, res) {
	
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





    
app.get('/api/invoices/:daysOver',function(req,res) {
	//This method grabs a list of invoices given the amount of days since it has been sent (we'll likely be using 30)
    if(req.query.password != "tweety")
    {
	    res.status(403).send('{"error": "Auth required"}');
    }
    else
    {
	    var FreshBooks = require('freshbooks');
	
		/* FreshBooks() initiates your connection to the FreshBooks API.
		This requires your "API URL" and "Authentication Token". To get these variables 
		open FreshBooks and goto My Account > FreshBooks API. */
		
		var api_url = "https://myitops.freshbooks.com/api/2.1/xml-in"
		  , api_token = "77f17cdc273543664826d5fdb1162fce";
		
		var freshbooks = new FreshBooks(api_url, api_token);
		
		//var invoice = new freshbooks.Invoice();
		
		var invoiceCollection = new freshbooks.Invoice();
		var result = [];
		//var date = new Date();
		//console.log("Starting Logic at "+ date);
		
		function getInvoices(page, callback)
		{
			var daysOver = parseInt(req.params.daysOver);
			if(typeof daysOver !== 'number')
			{
				console.log("Error: variable must be a number");
			}
			else
			{
				var now = new Date();
				now.setDate(now.getDate() - daysOver);
				//console.log();
				var date = now.getFullYear() + "-";
				if((parseInt(now.getMonth())+1) < 10)
				{
					date = date + "0" + (parseInt(now.getMonth())+1);
				}
				else
				{
					date = date + (parseInt(now.getMonth())+1);
				}
				
				date = date + "-";
				
				if(now.getDate() < 10)
				{
					date = date + "0" + now.getDate();
				}
				else
				{
					date = date + now.getDate();
				}
				
				//console.log(date);
				invoiceCollection.list({per_page: 100, page: page, status:"unpaid",date_to:date}, function(err, invoices, options) {
					if(err)
					{
						console.log("Error: " + err);
					}
					else
					{
						
						invoices.forEach(function(invoice) {
							//console.log(typeof invoice.client_id);
							//console.log(invoice.client_id);

							if(invoice.amount > 0 && isInArray(parseInt(invoice.client_id),AVC_IDS))
							{
						    	result.push(invoice);
							}
						});
						callback(result, options);
					}
				});
			}
		}

		function getComments(callback)
		{
			var db = req.db;
		    var comments = db.get('comments');
		    comments.find({},{},function(e,data){
		        if(!e)
	        	{
	        		callback(data);
	        	}
	        	else
	        	{
	        		console.log("Error: Unable to get avc status from mongo db");
	        		console.log(e);
	        	}
		    
	    	});
		}
			
			
		getInvoices(1,function (result,options) {
			console.log(options);
			if(options.pages > 1)
			{
				//there are more pages, let's make another call. 
				
				getInvoices(2, function(result,options) {
					console.log("Second page...");
					console.log(options);
					
					
					finalChecks(result);
				});
			}
			else
			{
				finalChecks(result);
				
			}
		});
			
		function finalChecks(result) {

			var arrayOfInvoiceIDs = [];
			result.forEach(function(invoice){
				arrayOfInvoiceIDs.push(invoice.invoice_id);
			});
			//okay let's iterate over the array and get the info from mongo and add it to the array. 
			getComments(function(comments){
				//console.log(comments);
				comments.forEach(function(comment) {
					//console.log(comment);
					if(isInArray(comment.invoice_id, arrayOfInvoiceIDs))
					{
						//okay the invoice_id for a comment we have exists in our result set, let's add it to our result set
						//console.log(comment.comment); //lol comment.comment, i know. :(
						//ok found it, just need to update the array somehow. 

						//Okay both arrays will have an index, let's use that. 

						var index = arrayOfInvoiceIDs.indexOf(comment.invoice_id);
						result[index].avc = comment.comment;
						

					}
				});

				res.send(result);
			});
		}
			
			
		function isInArray(value, array) {
		  return array.indexOf(value) > -1;
		}
	}//end of password if
		
	});
	
	app.post('/api/avc/:invoice_id', function(req,res) {
		//This method either adds or updates a record for a invoice ID with the new comment. 
		//Expecting the payload in JSON format. Example {"invoice_id":"12345", "comment": "2"}
		//response will be {"status":"error|success"}
		//Kind of dumb but I need to first get the _id of the record with our invoice_id then update the record using _id
		var invoice_id = req.params.invoice_id;
		console.log(typeof invoice_id);
		var comment = req.body.comment;
		//console.log(req.body.comment);
		if(!invoice_id || !comment)
		{
			//console.log(invoice_id);
			res.status(400).send('{"error": "Invoice ID and comment required"}');

		}
		else
		{
			var db = req.db;
		    var comments = db.get('comments');



		    comments.findAndModify(
			{
			        query: { "invoice_id": invoice_id },
			        update: { "$set": { 
			            "comment": comment,
			            "invoice_id": invoice_id
			        }},
			        options : {"new": true, "upsert": false},
			},
			    function(err,doc) {
			        if (err) 
		        	{
		        		throw err;
		        	}
		        	else
		        	{
		        		if( doc == null)
		        		{
		        			console.log("need to do insert...");
		        			comments.insert({"comment": comment, "invoice_id": invoice_id},function(err, result) {
		        				if(!err)
		        				{
		        					var result = {};
		        					result.success = true;
		        					res.json(result);
		        				}
		        				else
		        				{
		        					console.log("Error: " + err);
		        					res.send('{"error": "'+err+'"}');
	        					}
		        			});
		        		}
		        		else
		        		{
		        			//console.log("Updated successfully");
		        			//console.log( doc );
		        			var result = {};
        					result.success = true;
        					res.json(result);
		        		}
		        	}  
        		});

		    

		    /*
		    comments.find({invoice_id: invoice_id},{},function(e,data){
		        if(!e)
	        	{
	        		//ok we got some data
	        		console.log(data);
	        		//res.send(data);

	        		//ok we got our ID.
	        		comments.save({_id:data._id, comment:comment},{w:1}, function(err, result){
	        			if(err)
	        			{
	        				//well that sucks
	        				console.log("well that sucks");
	        			}
	        			else
	        			{
	        				console.log("success m8!");
	        			}
	        		});
	        	}
	        	else
	        	{
	        		console.log("Error: Unable to get avc status from mongo db");
	        		console.log(e);
	        	}
		    	
	    	});*/
	    }

	});

	app.get('/api/client',function(req,res) {
		//this method returns all the clients in the list. 
		var FreshBooks = require('freshbooks');
	
		/* FreshBooks() initiates your connection to the FreshBooks API.
		This requires your "API URL" and "Authentication Token". To get these variables 
		open FreshBooks and goto My Account > FreshBooks API. */
		
		var api_url = "https://myitops.freshbooks.com/api/2.1/xml-in"
		  , api_token = "77f17cdc273543664826d5fdb1162fce";
		
		var freshbooks = new FreshBooks(api_url, api_token);

		var clients = new freshbooks.Client();

		var totalResults = [];

		function processNext(i) {
			getClients(i,function(result, options){
				totalResults = totalResults.concat(result);
				if(i < options.pages)
				{
					processNext(++i);
				}
				else
				{
					totalResults.sort(function(a, b) {
						if(a.organization < b.organization) return -1;
						if(a.organization > b.organization) return 1;
						return 0;
					});
					res.json(totalResults);
				}
			});
		}

		processNext(1);

		function getClients(page, callback)
		{
			//function gets the clients and adds them to an array. The array is passed back in the callback.
			//We return true when we find results and false when we dont.
			console.log("getClients: " + page);
			
			clients.list({per_page: 50, page: page}, function(err, clients, options) {
			if(err)
			{
				console.log("Error: " + err);
			}
			else
			{
				//need to check if we didn't return anything
				var result = [];
				if(clients.length > 0)
				{
					clients.forEach(function(client) {
						//console.log(typeof invoice.client_id);
						//console.log(invoice.client_id);
						result.push(client);
						
					});
					callback(result, options);
					//console.log(result.length);
					return true;
				}	
				else
				{
					//no results
					console.log(result.length);
					return false;
				}
			}
		});
	}		
});

//end of routes
	
	
	
app.listen(3000);

console.log("Server running on port 3000");
