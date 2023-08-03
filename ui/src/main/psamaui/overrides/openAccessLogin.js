define(['picSure/settings', 'jquery', 'handlebars', 'text!login/fence_login.hbs',
        'common/session'],
    function (settings, $, HBS, loginTemplate,
              session) {
        return {
            doLogin: function () {
                // 1. Check if the user is already logged in
                if (sessionStorage.getItem('token')) {
                    // The user is already logged in, so we can just redirect them to the landing page.
                    console.log("Session token found, redirecting to landing page.");
                } else {
                    // 2. If not, check if the user has an existing cookie that contains a valid user ID.
                    const uuid = $.cookie('OPEN_ACCESS_UUID');

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
                            $.cookie('OPEN_ACCESS_UUID', data.UUID, {expires: 365, path: '/'});
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
