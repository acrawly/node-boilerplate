window.VehicleListView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Vehicle List View');
        Backbone.pubSub.on('search', this.search, this);
        
        
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },
    
    render:function (collection) {
        if(!this.collection)
          this.collection = collection;
        $(this.el).html(this.template({vehicles: collection.toJSON()}));
        return this;
    },
    search: function() {
      var q = $("#search").val();
      
      var array = q.split(" ");

      search_results = this.collection.filter(function(model) {
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