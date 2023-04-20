export class TnsOaProviderMicrosoft {
    constructor(options) {
        this.openIdSupport = "oid-full";
        this.providerType = "microsoft";
        this.authority = "https://login.microsoftonline.com/common";
        this.tokenEndpointBase = "https://login.microsoftonline.com/common";
        this.authorizeEndpoint = "/oauth2/v2.0/authorize";
        this.tokenEndpoint = "/oauth2/v2.0/token";
        this.endSessionEndpoint = '/oauth2/v2.0/logout';
        this.cookieDomains = ["login.microsoftonline.com", "live.com"];
        this.options = options;
    }
    parseTokenResult(jsonData) {
        return jsonData;
    }
}
export class TnsOaProviderGoogle {
    constructor(options) {
        this.openIdSupport = "oid-full";
        this.providerType = "google";
        this.authority = "https://accounts.google.com/o";
        this.tokenEndpointBase = "https://accounts.google.com/o";
        this.authorizeEndpoint = "/oauth2/auth";
        this.tokenEndpoint = "/oauth2/token";
        this.cookieDomains = ["google.com"];
        this.options = options;
    }
    parseTokenResult(jsonData) {
        return jsonData;
    }
    getLogoutUrlStr() {
        return `https://www.google.com/accounts/Logout`;
    }
}
export class TnsOaProviderFacebook {
    constructor(options) {
        this.openIdSupport = "oid-none";
        this.providerType = "facebook";
        this.authority = "https://www.facebook.com/v3.1/dialog";
        this.tokenEndpointBase = "https://graph.facebook.com";
        this.authorizeEndpoint = "/oauth";
        this.tokenEndpoint = "/v3.1/oauth/access_token";
        this.cookieDomains = ["facebook.com"];
        this.options = options;
    }
    parseTokenResult(jsonData) {
        return jsonData;
    }
}
export class TnsOaProviderLinkedIn {
    constructor(options) {
        this.openIdSupport = "oid-none";
        this.providerType = "linkedIn";
        this.authority = "https://www.linkedin.com";
        this.tokenEndpointBase = "https://www.linkedin.com";
        this.authorizeEndpoint = "/oauth/v2/authorization";
        this.tokenEndpoint = "/oauth/v2/accessToken";
        this.cookieDomains = ["linkedin.com"];
        this.options = options;
    }
    parseTokenResult(jsonData) {
        return jsonData;
    }
}
export class TnsOaProviderIdentityServer {
    constructor(options) {
        this.openIdSupport = 'oid-full';
        this.providerType = 'identityServer';
        this.authorizeEndpoint = '/connect/authorize';
        this.tokenEndpoint = '/connect/token';
        this.revokeEndpoint = '/connect/revocation';
        this.endSessionEndpoint = '/connect/endsession';
        this.options = options;
        this.authority = options.issuerUrl;
        this.tokenEndpointBase = options.issuerUrl;
        const match = /^https:\/\/(.*?)$/.exec(options.issuerUrl);
        if (match) {
            this.cookieDomains = [match[1].toString()];
        }
    }
    parseTokenResult(jsonData) {
        return jsonData;
    }
}
//# sourceMappingURL=index.js.map