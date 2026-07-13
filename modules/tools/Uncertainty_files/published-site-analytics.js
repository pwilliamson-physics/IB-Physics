(function () {
    var _bkvisit = {
        checkTracking: function () {
            const request = this.createRequest();
            const payload = this.getPayload();
            const cookieWarningEnabled = window.bk_cookie_warning_enabled && window.bk_cookie_warning_enabled === true;
            const hasOptedIn = window.localStorage?.getItem('bk-cookie-warning-analytics') === '1';

            if (!cookieWarningEnabled || hasOptedIn) {
                this.send(request, payload);
                return;
            }

            document.getElementById('js-cookie-consent-event').addEventListener(
                'cookieConsentEvent', this.checkTracking
            );
        },

        createRequest: function () {
            if (window.XMLHttpRequest) {
                return new XMLHttpRequest();
            }
            return new ActiveXObject("Microsoft.XMLHTTP");
        },

        getPayload: function () {
            const p = [
                'siteRef=' + encodeURIComponent(App.session.get('siteRef')),
                'timestamp=' + encodeURIComponent(Math.floor(this.getTimestamp() / 1000)),
                'path=' + encodeURIComponent(window.location.pathname),
                'referrer=' + encodeURIComponent(document.referrer),
                'userAgent=' + encodeURIComponent(navigator.userAgent)
            ];
            return p.join('&');
        },

        getTimestamp: function () {
            if (!Date.now) {
                return new Date().getTime();
            }
            return Date.now();
        },

        send: function (request, payload) {
            request.open('POST', '/_bk/track', true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(payload);
        }
    };
    _bkvisit.checkTracking();
})();
