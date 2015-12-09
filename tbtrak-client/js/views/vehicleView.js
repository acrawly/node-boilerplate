window.VehicleView = Backbone.View.extend({

    initialize:function (options) {
        console.log('Initializing Vehicle View');
        this.vehicle = options.model;
        //console.log(this.vehicle.toJSON());
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];

      
    },
    render:function () {
        
      $(this.el).html(this.template({vehicle: this.vehicle.toJSON()}));
      //since this is a modal, I'll also call my function to open modal
      
      return this;
    }

});