define(["jquery", "backbone", "handlebars", "text!landing/landing.hbs"],
    function ($, BB, HBS, landingTemplate) {
        return BB.View.extend({
            initialize: function (user) {
                this.template = HBS.compile(landingTemplate);
            },
            events: {},
            render: function () {
                this.$el.html(this.template());
                return this;
            }
        });
    });

