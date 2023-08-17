define(["jquery", "backbone", "handlebars", "text!header/goToAuthorized.hbs"], function($, BB, HBS, template){
    return BB.View.extend({
        initialize: function(opts){
            this.template = HBS.compile(template);
        },
        events: {
            "click #redirect-to-auth": "openAuthorized",
            "click #close-auth-modal": "closeModal"
        },
        closeModal: function(){
            // clicks the close button on the modal
            $('.close').click();
        },
        openAuthorized: function(event){
            // this is to get around an additional model opening when the user clicks the button
            event.stopPropagation();

            window.open("https://picsure.biodatacatalyst.nhlbi.nih.gov/psamaui/login", "_blank");
            this.closeModal();
        },
        render: function(){
            this.$el.html(this.template);
        }
    });
});