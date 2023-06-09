import * as querystring from "querystring";
import * as UrlLib from "url";
function addCustomQueryParams(params, provider) {
    const customQueryParams = provider.options.customQueryParams;
    if (customQueryParams) {
        for (const paramName of Object.keys(customQueryParams)) {
            params[paramName] = customQueryParams[paramName];
        }
    }
}
export function getAuthUrlStr(provider, codeChallenge) {
    if (provider.getAuthUrlStr) {
        return provider.getAuthUrlStr();
    }
    const params = {};
    params["client_id"] = provider.options.clientId;
    params["response_type"] = "code";
    params["redirect_uri"] = provider.options.redirectUri;
    params["scope"] =
        provider.options.scopes && provider.options.scopes.join(" ");
    params["response_mode"] = "query";
    params["state"] = "abcd";
    if (codeChallenge) {
        params["code_challenge"] = codeChallenge;
        params["code_challenge_method"] = "S256";
    }
    addCustomQueryParams(params, provider);
    const pararmsStr = querystring.stringify(params);
    const retAuthUrlStr = provider.authority + provider.authorizeEndpoint + "?" + pararmsStr;
    return retAuthUrlStr;
}
export function getLogoutUrlStr(provider, client) {
    if (provider.getLogoutUrlStr) {
        return provider.getLogoutUrlStr();
    }
    if (!client || !client.tokenResult) {
        return null;
    }
    const params = {};
    params["id_token_hint"] = client.tokenResult.idToken;
    params["post_logout_redirect_uri"] = provider.options.redirectUri;
    addCustomQueryParams(params, provider);
    const pararmsStr = querystring.stringify(params);
    const retAuthUrlStr = provider.authority + provider.endSessionEndpoint + "?" + pararmsStr;
    return retAuthUrlStr;
}
export function authorizationCodeFromRedirectUrl(url) {
    let authorizationCode = null;
    if (url) {
        let parsedRetStr = UrlLib.parse(url);
        let qsObj = querystring.parse(parsedRetStr.query);
        authorizationCode = qsObj["code"];
    }
    return authorizationCode;
}
export function getAccessTokenUrlStr(provider) {
    let retStr = "";
    if (provider.tokenEndpointBase && provider.tokenEndpointBase !== "") {
        retStr = provider.tokenEndpointBase + provider.tokenEndpoint;
    }
    else {
        retStr = provider.authority + provider.tokenEndpoint;
    }
    return retStr;
}
export function getAccessTokenUrlWithCodeStr(provider, authCode) {
    if (provider.getAccessTokenUrlWithCodeStr) {
        return provider.getAccessTokenUrlWithCodeStr(authCode);
    }
    const params = {};
    params["code"] = authCode;
    params["client_id"] = provider.options.clientId;
    params["client_secret"] = provider.options.clientSecret;
    params["scope"] =
        provider.options.scopes && provider.options.scopes.join(" ");
    params["state"] = "abcd";
    addCustomQueryParams(params, provider);
    const pararmsStr = querystring.stringify(params);
    const paramsWithRedirectStr = pararmsStr + "&redirect_uri=" + provider.options.redirectUri;
    const retAccessTokenWithCodeUrlStr = getAccessTokenUrlStr(provider) + "?" + paramsWithRedirectStr;
    return retAccessTokenWithCodeUrlStr;
}
export function newUUID(a, b) {
    for (b = a = ""; a++ < 36; b +=
        (a * 51) & 52
            ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
            : "-")
        ;
    return b;
}
export function getAuthHeaderFromCredentials(provider) {
    let customAuthHeader;
    if (provider["basicAuthHeader"]) {
        customAuthHeader = { Authorization: provider["basicAuthHeader"] };
    }
    return customAuthHeader;
}
export function nsArrayToJSArray(a) {
    const arr = [];
    if ("undefined" !== typeof a) {
        const count = a.count;
        for (let i = 0; i < count; i++) {
            arr.push(a.objectAtIndex(i));
        }
    }
    return arr;
}
export function jsArrayToNSArray(str) {
    return NSArray.arrayWithArray(str);
}
export function httpResponseToToken(response) {
    let results;
    try {
        results = response.content.toJSON();
    }
    catch (e) {
        results = querystring.parse(response.content.toString());
    }
    let access_token = results["access_token"];
    let refresh_token = results["refresh_token"];
    let id_token = results["id_token"];
    let expires_in = results["expires_in"];
    delete results["refresh_token"];
    let expSecs = Math.floor(parseFloat(expires_in));
    let expDate = new Date();
    expDate.setSeconds(expDate.getSeconds() + expSecs);
    return {
        accessToken: access_token,
        refreshToken: refresh_token,
        idToken: id_token,
        accessTokenExpiration: expDate,
        refreshTokenExpiration: expDate,
        idTokenExpiration: expDate,
    };
}
//# sourceMappingURL=tns-oauth-utils.js.map