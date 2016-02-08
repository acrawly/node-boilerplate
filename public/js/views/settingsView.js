window.SettingsView = Backbone.View.extend({

    initialize:function () {
        console.log('Initializing Settings View');
//        this.template = _.template(directory.utils.templateLoader.get('home'));
//        this.template = templates['Home'];
    },
    events: {
      "keyup #search": "search"
    },

    render:function () {
        $(this.el).html(this.template());
        return this;
    }

});