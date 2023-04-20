import { Frame } from "@nativescript/core";
import { TnsOAuthClientAppDelegate } from "./delegate";
import { TnsOAuthLoginNativeViewController } from "./tns-oauth-native-view-controller";
import { TnsOAuthLoginWebViewController } from "./tns-oauth-login-webview-controller";
import { TnsOAuthClientConnection } from "./tns-oauth-client-connection";
import { nsArrayToJSArray, jsArrayToNSArray, httpResponseToToken, } from "./tns-oauth-utils";
export class TnsOAuthClient {
    constructor(providerType, pkce = true) {
        this.pkce = pkce;
        this.provider = null;
        this.provider = tnsOauthProviderMap.providerMap.get(providerType);
        if (this.provider) {
            switch (this.provider.options.openIdSupport) {
                case "oid-full":
                    TnsOAuthClientAppDelegate.setConfig(this, this.provider.options.urlScheme);
                    this.loginController = TnsOAuthLoginNativeViewController.initWithClient(this);
                    break;
                case "oid-none":
                    this.loginController = TnsOAuthLoginWebViewController.initWithClient(this);
                    break;
                default:
                    this.loginController = TnsOAuthLoginWebViewController.initWithClient(this);
                    break;
            }
        }
    }
    loginWithCompletion(completion) {
        if (this.provider) {
            this.loginController.loginWithParametersFrameCompletion(null, Frame.topmost(), this.provider.options.urlScheme, completion);
        }
        else {
            completion(null, "Provider is not configured");
        }
    }
    logoutWithCompletion(completion) {
        if (this.provider) {
            this.loginController.logoutWithParametersFrameCompletion(null, Frame.topmost(), this.provider.options.urlScheme, completion);
        }
        else {
            completion("Provider is not configured");
        }
    }
    refreshTokenWithCompletion(completion) {
        if (this.provider) {
            this.callRefreshEndpointWithCompletion(completion);
        }
        else {
            completion(null, "Provider is not configured");
        }
    }
    logout() {
        this.callRevokeEndpoint();
        this.removeCookies();
        this.removeToken();
    }
    resumeWithUrl(url) {
        this.loginController.resumeWithUrl(url);
    }
    removeCookies() {
        if (global.isIOS) {
            let cookieArr = nsArrayToJSArray(NSHTTPCookieStorage.sharedHTTPCookieStorage.cookies);
            for (let i = 0; i < cookieArr.length; i++) {
                const cookie = cookieArr[i];
                for (let j = 0; j < this.provider.cookieDomains.length; j++) {
                    if (cookie.domain.endsWith(this.provider.cookieDomains[j])) {
                        NSHTTPCookieStorage.sharedHTTPCookieStorage.deleteCookie(cookie);
                    }
                }
            }
            const dataStore = WKWebsiteDataStore.defaultDataStore();
            dataStore.fetchDataRecordsOfTypesCompletionHandler(WKWebsiteDataStore.allWebsiteDataTypes(), (records) => {
                const cookieArr = nsArrayToJSArray(records);
                for (let k = 0; k < cookieArr.length; k++) {
                    const cookieRecord = cookieArr[k];
                    for (let l = 0; l < this.provider.cookieDomains.length; l++) {
                        if (cookieRecord.displayName.endsWith(this.provider.cookieDomains[l])) {
                            dataStore.removeDataOfTypesForDataRecordsCompletionHandler(cookieRecord.dataTypes, jsArrayToNSArray([cookieRecord]), () => {
                                console.log(`Cookies for ${cookieRecord.displayName} deleted successfully`);
                            });
                        }
                    }
                }
            });
        }
        else if (global.isAndroid) {
            let cookieManager = android.webkit.CookieManager.getInstance();
            if (cookieManager.removeAllCookies) {
                let cm23 = cookieManager;
                cm23.removeAllCookies(null);
                cm23.flush();
            }
            else if (cookieManager.removeAllCookie) {
                cookieManager.removeAllCookie();
                cookieManager.removeSessionCookie();
            }
        }
    }
    removeToken() {
        this.tokenResult = null;
    }
    callRevokeEndpoint() {
        if (!this.provider.revokeEndpoint) {
            return;
        }
        let responseCompletion = (data, response, responseError) => {
            if (!responseError) {
                if (response.statusCode === 200) {
                }
                else {
                }
            }
        };
        const connection = TnsOAuthClientConnection.initWithRequestClientCompletion(this, responseCompletion);
        connection.startTokenRevocation();
    }
    callRefreshEndpointWithCompletion(completion) {
        if (!this.provider.tokenEndpoint) {
            return completion(null, 'Provider End-point token is missing');
        }
        if (!this.tokenResult) {
            return completion(null, 'Token Result is missing');
        }
        const connection = TnsOAuthClientConnection.initWithRequestClientCompletion(this, (data, result, error) => {
            if (result) {
                const tokenResult = httpResponseToToken(result);
                if (!tokenResult.refreshToken && this.tokenResult) {
                    tokenResult.refreshToken = this.tokenResult.refreshToken;
                    tokenResult.refreshTokenExpiration = this.tokenResult.refreshTokenExpiration;
                }
                this.tokenResult = tokenResult;
            }
            completion(this.tokenResult, error);
        });
        connection.startTokenRefresh();
    }
}
export class TnsOauthProviderMap {
    constructor() {
        this.providerMap = new Map();
    }
    addProvider(providerType, provider) {
        this.providerMap.set(providerType, provider);
    }
}
export const tnsOauthProviderMap = new TnsOauthProviderMap();
export function configureTnsOAuth(providers) {
    if (global.isIOS) {
        if (providers.some((p) => p.options.openIdSupport === "oid-full")) {
            TnsOAuthClientAppDelegate.doRegisterDelegates();
        }
    }
    for (let i = 0; i < providers.length; ++i) {
        tnsOauthProviderMap.addProvider(providers[i].providerType, providers[i]);
    }
}
//# sourceMappingURL=oauth.js.map