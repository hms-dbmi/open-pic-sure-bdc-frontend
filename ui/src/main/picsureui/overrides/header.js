define(["header/goToAuthorized", "common/modal"], function (goToAuthorized, modal) {
    return {
        /*
         * The path to a logo image incase you don't want the default PrecisionLink one.
         *
         * This should be a String value.
         */
        logoPath: undefined,

        /*
         * This is used to add extra logic after the main header has rendered
         */
        renderExt: function () {
            console.log("renderExt called");


            $(document).on('click', '.authorized-access-btn', function (event) {
                event.preventDefault();

                modal.displayModal(
                    new goToAuthorized(),
                    "You are about to go to Authorized PIC-SURE",
                    function () {
                        // refocus on the authorized access button
                        event.target.focus();
                    },
                    {width: "45em", isHandleTabs: true});
            });
        }
    };
});