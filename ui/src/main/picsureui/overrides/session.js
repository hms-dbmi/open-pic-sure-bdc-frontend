define(["picSure/tokenFunctions"],
    function (tokenFunctions) {
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
