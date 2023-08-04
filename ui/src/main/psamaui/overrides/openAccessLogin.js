define(['picSure/settings', 'jquery', 'handlebars', 'text!login/fence_login.hbs',
        'common/session', '../../picsureui/common/cookieManager'],
    function (settings, $, HBS, loginTemplate,
              session, cookieManager) {
        return {
            doLogin: function () {
                // 1. Check if the user is already logged in
                if (sessionStorage.getItem('token')) {
                    // The user is already logged in, so we can just redirect them to the landing page.
                    console.log("Session token found, redirecting to landing page.");
                } else {
                    let cookiesEnabled = cookieManager.areCookiesEnabled();
                    let uuid;
                    if (!cookiesEnabled) {
                        // try to get the UUID from the Cookie
                        uuid = cookieManager.readCookie('OPEN_ACCESS_UUID');
                    }

                    // userId is essentially optional, so we can just continue with the login process if it's not set.
                    $.ajax({
                        url: '/psama/open/authentication',
                        type: 'post',
                        data: JSON.stringify({
                            UUID: uuid
                        }),
                        contentType: 'application/json',
                        success: function (data) {
                            // we need to set the UUID cookie here, because the backend will not do it for us.
                            cookieManager.createCookie('OPEN_ACCESS_UUID', data.UUID, 365);

                            session.sessionInit(data);
                        },
                        error: function (data) {
                            // handle error
                            console.log(data);
                        }
                    });
                }
            }
        };
    }
);
