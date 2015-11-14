var _ = require('underscore');
var mysql  = require('mysql');


//options.host, options.port, options.username, etc.
module.exports = function createBroker (options) {
  var connection = mysql.createConnection({
    host     : options.host,
    user     : options.user,
    password : options.password,
    database : options.database
  });
  
  var baseURI = options.baseURI; //api path passed into the broker so we can pass back the URL to find the vehicle object
  
  if(baseURI.charAt(baseURI.length-1) !== "/")
  {
    baseURI = baseURI + "/";
  }
  
  connection.connect();

  //helper functions
  function vehicleAsJSON(vehicle) {
    var resource = _.extend({
      URI: baseURI + vehicle.id
    },vehicle);
    return resource;
  }
  
  function errorAsJSON(errMsg)
  {
    var err = _.extend({
      error: 500,
      msg: errMsg
      //in future, add in new relic code here
    });
    return err;
  }

  function vehicleAsCollection(callback){
    
    //this needs to change to return all the vehicles in the DB. 
    var queryString = 'SELECT * FROM vehicles';
 
    connection.query(queryString, function(err, rows, fields) {
      
      if (err)
      {
         return callback(err, null);
      }
      else
      {
        callback(err, Object.keys(rows).map(function(id) {
          return vehicleAsJSON(rows[id]);
        }));
      }
      
      /*for (var i in rows) {
          console.log('Vehicle ID: ', rows[i].id);
      }*/
    });

  }
  
  function getVehicle(id, callback)
  {
    //returns vehicle specified by ID
    connection.query('SELECT * from vehicles WHERE id = ?', id,function(err, rows, fields) {
      if (err)
      {
        callback(err, null);
      }
      else
      {
        callback(err, Object.keys(rows).map(function(id) {
          return vehicleAsJSON(rows[id]);
        }));
      }
    });
    
  }
  
  function deleteVehicle(id, callback)
  {
    //deletes the vehcile given the ID and returns the deleted object
    connection.query('DELETE FROM vehicles WHERE id = ?', id, function (err, result) {
      
      if (err)
      {
         callback(err, null);
      }
      else if(result.affectedRows > 0)
      {
        //we good
        callback(err, {id: id});
        
      }
      else
      {
        callback("No vehicle found", null);
      }
    
      //console.log('deleted ' + result.affectedRows + ' rows');
    });
    
  }
  
  function saveVehicle(vehicle, callback)
  {
    //either creates or updates a veicle given the vehicle object and returns the newly created/updated object
    
    //1. determine if object already exists
    //
    
    if(vehicle.id)
    {
      console.log("GOT ID");
      
      //1. Pull out the ID of the vehicle
      //2. Update
      var id = vehicle.id;
      var updatedVehicle = _.omit(vehicle, 'id');
      
      connection.query('UPDATE vehicles SET ? WHERE id = ?', [updatedVehicle, id], function(err, result) {
        if(err)
        {
          callback(err, null);
          
        }
        else if(result.affectedRows > 0)
        {
          getVehicle(id, callback);
        }
        else
        {
          callback("No vehicle found");
        }
      });
      
      
    }
    else
    {
      connection.query('INSERT INTO vehicles SET ?',vehicle, function(err, result) {
        if(err)
        {
          callback(err, null);
        }
        else if(result.affectedRows > 0)
        {
          getVehicle(result.insertId, callback);
        }
        else
        {
          callback("Error adding vehicle, contact support");
        }
      });
    }
    
    
  }

  return {
    all: function(callback){
      vehicleAsCollection(callback);
    },
    getVehicleById: function(id, callback){
      getVehicle(id, callback);
    },
    deleteVehicleById: function(id, callback){
      deleteVehicle(id, callback);
    },
    saveVehicle: function(vehicle, callback) {
      saveVehicle(vehicle, callback);
      
    },
    closeBroker: function()
    {
      connection.end();
    }
  };
};