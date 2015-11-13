var uuid = require('uuid');
var _ = require('underscore');

module.exports = function createDatabase (options) {

  var baseHref = options.baseHref;

  var vehicles = {};

  function vehicleAsResource(vehicle){
    var resource = _.extend({
      href: baseHref + vehicle.id
    },vehicle);
    delete resource.id;
    return resource;
  }

  function vehiclesAsCollection(){
    return Object.keys(vehicles).map(function(id){
      return vehicleAsResource(vehicles[id]);
    });
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
    createVehicle: function(vehicle){
      var newVehicle = _.extend({
        id: uuid()
      },vehicle);
      var newRef = vehicles[newVehicle.id] = newVehicle;
      return vehicleAsResource(newRef);
    }
  };
};