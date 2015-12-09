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
    },
    events: {
      "click .btn-save": "saveVehicle",
      "click .btn-delete": "deleteVehicle"
    },
    saveVehicle: function(e) {
      e.preventDefault();
      
      
      var form = $(this.el).find('.form-vehicle');
      
      
      this.vehicle.set({
        year : Number(form.find('#vehicle-year').val()),
        make : form.find('#vehicle-make').val(),
        model : form.find('#vehicle-model').val(),
        inspect: form.find('#vehicle-inspect').val(),
        vin: form.find('#vehicle-vin').val(),
        owner: form.find('#vehicle-owner').val(),
        driver: form.find('#vehicle-driver').val(),
        passenger: form.find('#vehicle-passenger').val(),
        comments: form.find('#vehicle-comments').val(),
        project_id: form.find("#vehicle-project").select2('data')[0].id,
        project_code: form.find("#vehicle-project").select2('data')[0].text
        
      });
      
      this.vehicle.save();
      $(this.el).find('.alert-success').removeClass('hidden');
      return false;
      
      
    },
    deleteVehicle: function(e) {
      e.preventDefault();
      console.log("Delete hit");
      var r = confirm("Are you sure?");
      if(r === true)
      {
        this.vehicle.destroy();
        Backbone.pubSub.trigger('refresh');
        window.location.href = "#vehicles";
        
      }
    }

});