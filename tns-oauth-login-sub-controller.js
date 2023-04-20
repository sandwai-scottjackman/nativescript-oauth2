import { getCodeVerifier, sha256base64encoded } from "./pkce-util";
import { TnsOAuthState } from "./tns-oauth-auth-state";
import { TnsOAuthClientConnection } from "./tns-oauth-client-connection";
import { authorizationCodeFromRedirectUrl, getAccessTokenUrlWithCodeStr, getAuthUrlStr, getLogoutUrlStr, } from "./tns-oauth-utils";
export class TnsOAuthLoginSubController {
    constructor(client) {
        this.client = client;
    }
    preLoginSetup(frame, urlScheme, completion) {
        this.frame = frame;
        if (this.authState) {
            const error = "Login failed because another login operation in progress.";
            completion(null, error);
        }
        let codeChallenge;
        if (this.client.pkce) {
            this.client.codeVerifier = getCodeVerifier();
            codeChallenge = sha256base64encoded(this.client.codeVerifier);
        }
        this.authState = new TnsOAuthState(this.client.codeVerifier, false, completion);
        return getAuthUrlStr(this.client.provider, codeChallenge);
    }
    preLogoutSetup(frame, urlScheme, completion) {
        this.frame = frame;
        if (this.authState) {
            const error = "Logout failed because another logout operation is in progress.";
            completion(error);
        }
        this.authState = new TnsOAuthState(this.client.codeVerifier, true, completion);
        return getLogoutUrlStr(this.client.provider, this.client);
    }
    resumeWithUrl(url, completion) {
        if (this.authState) {
            if (this.authState.isLogout) {
                if (url === this.client.provider.options.redirectUri) {
                    this.client.logout();
                    completion(undefined);
                    return true;
                }
                else {
                    completion(`incomplete`);
                    return false;
                }
            }
            else {
                const codeExchangeRequestUrl = this.codeExchangeRequestUrlFromRedirectUrl(url);
                if (codeExchangeRequestUrl) {
                    this.codeExchangeWithUrlCompletion(codeExchangeRequestUrl, completion);
                    return true;
                }
                else {
                    completion(undefined, `incomplete`);
                }
            }
        }
        return false;
    }
    codeExchangeRequestUrlFromRedirectUrl(url) {
        let codeExchangeUrl = null;
        const isRedirectUrlValid = true;
        if (isRedirectUrlValid) {
            const authorizationCode = authorizationCodeFromRedirectUrl(url);
            if (authorizationCode) {
                this.authState.authCode = authorizationCode;
                codeExchangeUrl = getAccessTokenUrlWithCodeStr(this.client.provider, authorizationCode);
            }
        }
        return codeExchangeUrl;
    }
    codeExchangeWithUrlCompletion(url, completion) {
        let responseCompletion;
        if (completion) {
            responseCompletion = (data, response, responseError) => {
                if ((response.statusCode === 200 || (data && data.accessToken)) &&
                    !responseError) {
                    const tokenResult = this.client.provider.parseTokenResult(data);
                    this.client.tokenResult = tokenResult;
                    completion(tokenResult, null);
                }
                else {
                    const msg = `${response ? response.statusCode : ""} ERROR Occurred`;
                    console.error(msg);
                    completion(null, responseError ? responseError : new Error(msg));
                }
            };
        }
        const connection = TnsOAuthClientConnection.initWithRequestClientCompletion(this.client, responseCompletion);
        connection.startGetTokenFromCode(this.authState.authCode);
    }
    completeLoginWithTokenResponseError(tokenResult, responseError) {
        if (this.authState) {
            const loginCompletion = this.authState
                .loginCompletion;
            this.authState = null;
            loginCompletion(tokenResult, responseError);
        }
    }
}
//# sourceMappingURL=tns-oauth-login-sub-controller.js.map