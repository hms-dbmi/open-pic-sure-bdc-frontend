define(["backbone", "common/session"], function (Backbone, session) {
    // Create a middleware that first checks if the session is expired or will expire soon (2 minutes)
    // If the session is going to expire soon or the session is expired, refresh the user's session by re-authenticating them
    let expired = function (marginOfError = 0) {
        if (sessionStorage.session) {
            return new Date().getTime() / 1000 > JSON.parse(atob(JSON.parse(sessionStorage.session).token.split('.')[1])).exp - marginOfError;
        }
        //no session -> no token --> session has expired or does not exist.
        return true;
    };

    let expireSoon = function () {
        return expired(120);
    };

    return Backbone.View.extend({
        initialize: function () {
            $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
                // Check if the token is expired
                if (expired() || expireSoon()) {
                    // We will re-authenticate the user
                    let uuid = JSON.parse(localStorage.getItem('OPEN_ACCESS_UUID'));
                    if (uuid) {
                        $.ajax({
                            url: '/psamaui/reauthenticate',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({uuid: uuid}),
                            success: function (data) {
                                // Update the session
                                session.init(data);
                            },
                            error: function (data) {
                                // handle error
                                console.log(data);
                            }
                        });
                    }
                }

                // set the authorization header for the request.
                // This is because the session was updated, but the request was made before the session was updated
                jqXHR.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.session).token);
            });
        },
        render: function () {
            return this;
        }
    });
})