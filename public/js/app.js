

//event management
Backbone.pubSub = _.extend({}, Backbone.Events);


window.Router = Backbone.Router.extend({

    routes: {
        "": "home"
    },

    initialize: function () {

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
    }

});

templateLoader.load(["HomeView"],
    function () {
        app = new Router();
        Backbone.history.start();

    });