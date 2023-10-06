define(["header/goToAuthorized", "header/termsOfService", "common/modal"], function (goToAuthorized, termsOfService, modal) {
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

            // This is used in two places. The header is rendered before one of the locations
            // is available. By binding the click event to the document, we can ensure that
            // the event will be handled when the element is available.
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

            $(document).on('click', '#open-tos-modal', function (event) {
                modal.displayModal(
                    new termsOfService(),
                    "NHLBI BioData Catalyst® (BDC) Powered by Open PIC-SURE Terms of Use",
                    function () {
                        // Focus the help dropdown menu
                        $("#help-dropdown-toggle").focus();
                    },
                    {width: "90em", isHandleTabs: true});
            });
        }
    };
});