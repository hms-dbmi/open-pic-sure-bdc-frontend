define([], function () {
    let expired = function() {
        if (sessionStorage.session){
            return new Date().getTime()/1000 > JSON.parse(atob(JSON.parse(sessionStorage.session).token.split('.')[1])).exp;
        }
        //no session -> no token --> session has expired or does not exist.
        return true;
    };

    return {
        handleQueryTemplateAndMeResponseSuccess: function (queryTemplateResponse, meResponse) {
            var currentSession = JSON.parse(sessionStorage.getItem("session"));
            currentSession.queryTemplate = queryTemplateResponse[0].queryTemplate;
            currentSession.privileges = meResponse[0].privileges;
            currentSession.queryScopes = meResponse[0].queryScopes;
            currentSession.acceptedTOS = meResponse[0].acceptedTOS;
            currentSession.username = meResponse[0].email;

            sessionStorage.setItem("session", JSON.stringify(currentSession));

            window.location = '/picsureui/';
        },
        handleNotAuthorizedResponse: function () {
            try {
                if (expired()) {
                    // We just need to clear the session and get a new token.
                    sessionStorage.removeItem("session");
                    window.location = '/psamaui/login';
                } else {
                    history.pushState({}, "", "/psamaui/not_authorized");
                }
            } catch (e) {
                console.log("Error determining token expiry");
                history.pushState({}, "", "/psamaui/not_authorized");
            }
        }
    };
});
