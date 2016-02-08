window.VehicleListView = Backbone.View.extend({

    initialize:function (options) {
        console.log('Initializing Vehicle List View');
        this.vehicles = options.collection;
        Backbone.pubSub.on('search', this.search, this);
        Backbone.pubSub.on('refresh', this.render, this);
        
        
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },
    
    render:function (collection) {
      if(collection)
      {
        $(this.el).html(this.template({vehicles: collection.toJSON()}));
      }
      else
      {
        $(this.el).html(this.template({vehicles: this.vehicles.toJSON()}));
      }
        
      return this;
    },
    search: function() {
      var q = $("#search").val();
      
      var array = q.split(" ");

      search_results = this.vehicles.filter(function(model) {
        //here is where we need to put both search terms
        return _.every(array, function(searchTerm) {
          return _.any(model.attributes, function(val, attr) {
            // do your comparison of the value here, whatever you need
            
            if( ~attr.indexOf("project_id") || 
                ~attr.indexOf("id") ||
                ~attr.indexOf("URI") )
            {
              return false; 
            }
            
            if(val !== null && val !==  undefined)
            {
              if(!_.isString(val))
              {
                val = val.toString();
              }
              //convert both options to uppercase just in case
              val = val.toUpperCase();
              searchTerm = searchTerm.toUpperCase();
              
              return ~val.indexOf(searchTerm);
            }
            else
            {
              return false;
            }
            
          });
        });
      });
     
     
      this.render(new VehicleCollection(search_results));
      
    }
    

});