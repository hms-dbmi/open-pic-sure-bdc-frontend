define([], function(){
    return {
        handleQueryTemplateAndMeResponseSuccess: function(queryTemplateResponse, meResponse){
            var currentSession = JSON.parse(sessionStorage.getItem("session"));
            currentSession.queryTemplate = queryTemplateResponse[0].queryTemplate;
            currentSession.privileges = meResponse[0].privileges;
            currentSession.queryScopes = meResponse[0].queryScopes;
            currentSession.acceptedTOS = meResponse[0].acceptedTOS;
            currentSession.username = meResponse[0].email;

            sessionStorage.setItem("session", JSON.stringify(currentSession));

            // window.location = "/picsureui/";
        },
        handleNotAuthorizedResponse: function() {
            try {
                if (new Date().getTime()/1000 > JSON.parse(atob(JSON.parse(sessionStorage.session).token.split('.')[1])).exp) {
                    history.pushState({}, "", "/psamaui/logout");
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