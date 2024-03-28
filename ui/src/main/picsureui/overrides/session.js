define(["picSure/tokenFunctions"],
    function (tokenFunctions) {
        let expired = function () {
            if (sessionStorage.session) {
                return new Date().getTime() / 1000 > JSON.parse(atob(JSON.parse(sessionStorage.session).token.split('.')[1])).exp;
            }
            //no session -> no token --> session has expired or does not exist.
            return true;
        };

        return {
            handleQueryTemplateAndMeResponseSuccess: function (queryTemplateResponse, meResponse) {
                let currentSession = JSON.parse(sessionStorage.getItem("session"));
                currentSession.queryTemplate = queryTemplateResponse[0].queryTemplate;
                currentSession.privileges = meResponse[0].privileges;
                currentSession.queryScopes = meResponse[0].queryScopes;
                currentSession.acceptedTOS = meResponse[0].acceptedTOS;
                currentSession.username = meResponse[0].email;

                sessionStorage.setItem("session", JSON.stringify(currentSession));
            },
            handleNotAuthorizedResponse: function () {
                // if the session has expired we will clear the session and reload the page
                sessionStorage.clear();
                window.location.reload();
            }
        };
    });
