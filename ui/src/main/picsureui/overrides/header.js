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
                        // refocus on the authorized access button
                        event.target.focus();
                    },
                    {width: "45em", isHandleTabs: true});
            });
        }
    };
});