define(['picSure/settings', 'jquery', 'handlebars', 'text!login/fence_login.hbs',
        'common/session'],
    function (settings, $, HBS, loginTemplate,
              session) {
        return {
            doLogin: function () {
                // 1. Check if the user is already logged in
                let sessionData = sessionStorage.getItem('session');
                sessionData = sessionData ? JSON.parse(sessionData) : null;

                if (sessionData && sessionData?.token) {
                    // The user is already logged in, so we can just redirect them to the landing page.
                    window.location = '/picsureui/';
                } else {
                    let uuid = localStorage.getItem('OPEN_ACCESS_UUID');

                    $.ajax({
                        url: '/psama/open/authentication',
                        type: 'post',
                        data: JSON.stringify({
                            UUID: uuid
                        }),
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.uuid) {
                                // we need to set the UUID cookie here, because the backend will not do it for us.
                                localStorage.setItem('OPEN_ACCESS_UUID', JSON.stringify(data.uuid));
                            }

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
