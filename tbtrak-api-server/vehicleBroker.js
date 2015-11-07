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
  
  

  //helper functions
  function vehicleAsJSON(vehicle) {
    var resource = _.extend({
      URI: baseURI + vehicle.id
    },vehicle);
    return resource;
  }

  function vehicleAsCollection(){
    
    //this needs to change to return all the vehicles in the DB. 
    
    return Object.keys(vehicles).map(function(id){
      return vehicleAsResource(vehicles[id]);
    });
  }
  
  function getVehicle(id)
  {
    //returns vehicle specified by ID
    
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
    all: function(){
      return vehiclesAsCollection();
    },
    getVehicleById: function(id){
      
      
      var vehicle = vehicles[id];
      return vehicle ? vehicleAsResource(vehicle) : vehicle;
    },
    deleteVehicleById: function(id){
      
      
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