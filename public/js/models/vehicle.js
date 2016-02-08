window.Vehicle = Backbone.Model.extend({

    urlRoot:"http://localhost:3000/vehicles",

    initialize:function () {
        //this.reports = new VehicleCollection(); this was for who the employees manager was lol
        //this.reports.url = 'http://localhost:3000/vehicles/' + this.id; this was for who the employee's manager was. Not needed for us. 
    },
    
    parse: function(response, options) {
      //because a collection already has "fixed the issue of nesting the data under the vehicles key
      if(response.vehicles)
      {
        return response.vehicles[0];
      }
      else
      {
        return response;
      }
    }

});

window.VehicleCollection = Backbone.Collection.extend({

    model: Vehicle,

    url:"http://localhost:3000/vehicles",
    
    initialize: function() {
      //this.fetch();
      
    },
    
    parse : function(response, options) {
        return response.vehicles;
    }
/*
    findByName:function (key) {
        var url = (key == '') ? '../api/employees' : "../api/employees/search/" + key;
        console.log('findByName: ' + key);
        var self = this;
        $.ajax({
            url:url,
            dataType:"json",
            success:function (data) {
                console.log("search success: " + data.length);
                self.reset(data);
            }
        });
    }
*/

});


