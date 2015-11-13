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
         return callback(err, null);
      }
      else
      {
        callback(err, Object.keys(rows).map(function(id) {
          return vehicleAsJSON(rows[id]);
        }));
      }
    });
    
  }
  
  function deleteVehicle(id)
  {
    //deletes the vehcile given the ID and returns the deleted object
  }
  
  function saveVehicle(vehicle)
  {
    //either creates or updates a veicle given the vehicle object and returns the newly created/updated object
  }
  
  
  

  return {
    all: function(callback){
      vehicleAsCollection(callback);
    },
    getVehicleById: function(id, callback){
      getVehicle(id, callback);
    },
    deleteVehicleById: function(id, callback){
      
      
      delete vehicles[id];
    },
    saveVehicle: function(vehicle){
      
      
      
      var newRef = vehicles[newVehicle.id] = newVehicle;
      return vehicleAsResource(newRef);
    },
    closeBroker: function()
    {
      connection.end();
    }
  };
};