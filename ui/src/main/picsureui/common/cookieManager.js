define(['underscore', 'backbone'], function(_, Backbone) {
    const CookieManager = Backbone.Model.extend({
        createCookie: function (name, value, days) {
            let expires;

            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },

        readCookie: function (name) {
            let nameEQ = encodeURIComponent(name) + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },

        removeCookie: function (name) {
            this.createCookie(name, "", -1);
        },

        areCookiesEnabled: function () {
            this.createCookie("testCookie", "testValue");
            if (this.readCookie("testCookie") != null) {
                this.removeCookie("testCookie");
                return true;
            }
            return false;
        }
    });

    return new CookieManager();
});
