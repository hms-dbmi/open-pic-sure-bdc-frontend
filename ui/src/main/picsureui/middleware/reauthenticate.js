define(["backbone", "common/session"], function (Backbone, session) {
    let tokenState = {
        isRefreshing: false,
        subscribers: [],
        queueRequest: function (ajaxOptions) {
            this.subscribers.push(ajaxOptions);
        },
        processQueue: function () {
            this.subscribers.forEach((ajaxOptions) => {
                $.ajax(ajaxOptions);
            });
            this.subscribers = [];
        }
    };

    function expired(marginOfError = 0) {
        if (sessionStorage.session) {
            let sessionData = JSON.parse(sessionStorage.session);
            let decodedToken = JSON.parse(atob(sessionData.token.split('.')[1]));
            return new Date().getTime() / 1000 > decodedToken.exp - marginOfError;
        }
        return true;
    }

    // nearly expired. 5 minutes before expiration.
    // We do this to ensure we don't accidentally make a request with an expired token
    // and have to refresh it in the middle of the request.
    // This is a bit of a hack, but it should work for now.
    function nearlyExpired() {
        return expired(300);
    }

    function refreshToken() {
        if (!tokenState.isRefreshing) {
            tokenState.isRefreshing = true;
            return new Promise((resolve, reject) => {
                let uuid = JSON.parse(localStorage.getItem('OPEN_ACCESS_UUID'));
                if (uuid) {
                    $.ajax({
                        url: '/psama/open/authentication',
                        type: 'POST',
                        data: JSON.stringify({ UUID: uuid }),
                        contentType: 'application/json',
                        success: function (data) {
                            session.sessionInit(data);
                            tokenState.isRefreshing = false;
                            tokenState.processQueue();
                            resolve();
                        },
                        error: function (error) {
                            console.error("Failed to refresh token", error);
                            tokenState.isRefreshing = false;
                            reject(error);
                        }
                    });
                } else {
                    tokenState.isRefreshing = false;
                    reject("UUID not found");
                }
            });
        } else {
            return new Promise((resolve) => {
                tokenState.subscribers.push({
                    success: resolve,
                    error: resolve // Resolve the queue even if refresh fails to prevent deadlock
                });
            });
        }
    }

    return Backbone.View.extend({
        initialize: function () {
            $.ajaxPrefilter((options, originalOptions, jqXHR) => {
                if (options.crossDomain || options.url.includes("psamaui") || options.url.includes("psama")) {
                    return;
                }

                if (expired() || nearlyExpired()) {
                    jqXHR.abort();
                    refreshToken().then(() => {
                        $.ajax(originalOptions);
                    });
                } else {
                    originalOptions.beforeSend = (jqXHR) => {
                        jqXHR.setRequestHeader("Authorization", "Bearer " + JSON.parse(sessionStorage.session).token);
                    };
                }
            });
        },
        render: function () {
            return this;
        }
    });
});
