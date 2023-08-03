define(["picSure/settings", "psamaui/overrides/openAccessLogin"], function(settings, openAccessLogin){
	return {
		/*
		 * This allows you to build any authorization logic you wish.
		 *
		 * This should be a function that takes the output of common/searchParser/parseQueryString
		 * and returns either true or false based on the values of the query string.
		 *
		 */
		authorization : undefined,
		client_id : settings.client_id,
		/*
		 * This allows you to modify the DOM rendered on the login screen.
		 */
		postRender: function() {

		},

        /*
         * This override allows to configure custom not_authorized page for stack.
         *
         * Example configuration: provide custom not_authorized.hbs template in overrides folder and render it similar manner
         * as login.displayNotAuthorized() function.
         */
        displayNotAuthorized: undefined,
		waitingMessage: undefined,
		showLoginPage: openAccessLogin.doLogin,
	};
});
