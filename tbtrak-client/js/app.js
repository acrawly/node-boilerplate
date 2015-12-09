//event management
Backbone.pubSub = _.extend({}, Backbone.Events);


window.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "vehicles": "vehicles",
        "vehicles/:id": "vehicleDetails",
        "exhibits": "exhibits",
        "exhibits/:id": "exhibitDetails",
        "settings" : "settings"
    },

    initialize: function () {
        this.searchView = new SearchView();
        $('.search').html(this.searchView.render().el);

        // Close the search dropdown on click anywhere in the UI
        /*$('body').click(function () {
            $('.dropdown').removeClass("open");
        });*/
        
        
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
        if (!this.homeView) {
            this.homeView = new HomeView();
            this.homeView.render();
        } else {
            this.homeView.delegateEvents(); // delegate events when the view is recycled
            //^^ the above is required because when we switch views, any events bound to any DOM elements are removed
            //so when we look at the view again, we must push all events back onto the DOM elements.
            //http://stackoverflow.com/questions/11073877/delegateevents-in-backbone-js
        }
        $("#content").html(this.homeView.el);
        //this.headerView.select('home-menu');
    },

    vehicles: function () {
        if (!this.vehicleListView) {
            var self = this; //fix scope issues
            this.vehicleListView = new VehicleListView();
            
            this.vehicleCollection = new VehicleCollection();
        
            this.vehicleCollection.fetch(
            {
              success: function() {
                self.vehicleListView.render(self.vehicleCollection);
                //console.log(self.vehicleCollection);
              },
              error: function() {
                alert("There was an issue loading the vehicles");
              }
            });
        }
        
        $('#content').html(this.vehicleListView.el);
    },

    vehicleDetails: function (id) {
        var vehicle = new Vehicle({id: id});
        vehicle.fetch({
            success: function (data) {
              // Note that we could also 'recycle' the same instance of EmployeeFullView
              // instead of creating new instances
              
              //$('#modal').html(); new VehicleView({model: data}).render.el;
              //console.log(new VehicleView({model: data}).render().el);
              
              var vehicleView = new VehicleView({model: data});
              vehicleView.render();
              
              $("#content").html(vehicleView.el);
              
            }
        });
    },
    exhibits: function() {
      if (!this.exhibitsListView) {
            var self = this; //fix scope issues
            this.exhibitsListView = new ExhibitsListView();
            
            //this.vehicleCollection = new VehicleCollection();
            this.exhibitsListView.render();
            /*this.vehicleCollection.fetch({success: function() {
              self.vehicleListView.render(self.vehicleCollection);
              //console.log(self.vehicleCollection);
            }});*/
        }
        
        $('#content').html(this.exhibitsListView.el);
    },
    settings: function() {
      if(!this.settingsView) {
            this.settingsView = new SettingsView();
            
            //this.vehicleCollection = new VehicleCollection();
            this.settingsView.render();
            /*this.vehicleCollection.fetch({success: function() {
              self.vehicleListView.render(self.vehicleCollection);
              //console.log(self.vehicleCollection);
            }});*/
        }
        
        $('#content').html(this.settingsView.el);
    }

});

templateLoader.load(["HomeView", "VehicleView", "VehicleListView", "SearchView", "ExhibitsListView", "SettingsView"],
    function () {
        app = new Router();
        Backbone.history.start();

    });