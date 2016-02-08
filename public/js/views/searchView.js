window.SearchView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Search View');
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },
    events: {
      "keyup #search": "search"
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    },
    
    search: function() {
      //TO-DO: determine which view is currently in use (vehicles vs exhibits vs settings)
      
      Backbone.pubSub.trigger('search');
      
    }

});