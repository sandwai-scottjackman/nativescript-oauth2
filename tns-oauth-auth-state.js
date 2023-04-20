export class TnsOAuthState {
    constructor(codeVerifier, isLogout, loginCompletion, urlScheme) {
        this._loginCompletion = loginCompletion;
        this._codeVerifier = codeVerifier;
        this._urlScheme = urlScheme;
        this._isLogout = isLogout;
    }
    get loginCompletion() {
        return this._loginCompletion;
    }
    get codeVerifier() {
        return this._codeVerifier;
    }
    get urlScheme() {
        return this._urlScheme;
    }
    get isLogout() {
        return this._isLogout;
    }
}
//# sourceMappingURL=tns-oauth-auth-state.js.map