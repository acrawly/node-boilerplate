// Her we use a local, relative require path to require your
// client library. When you publish on NPM you should change
// it to the absolute module name

var vehicleAPI = require('../vehicle-api');

var prettyjson = require('prettyjson');

var client = vehicleAPI.createClient({
  key:'5V14FNV77L6BI5WNUUV4OZ8Q6',
  secret:'fvpueD+nOM36jPUzj+qb1gtLdewS3hhM6W408NHcrkA'
});

// Read all the things in the collection

client.getVehicles(function(err,things) {
  if(err){
    console.error(err);
  }else{
    console.log('Things collection has these items:');
    console.log(prettyjson.render(things));
  }
});

// Create a new thing in the collection

client.addVehicle(
  {
    myNameIs: 'what?'
  },
  function(err,thing) {
    if(err){
      console.error(err);
    }else{
      console.log('New vehcile created:');
      console.log(prettyjson.render(thing));
    }
  }
);