var _a;
import { Application, Color } from "@nativescript/core";
import { TnsOAuthLoginSubController, } from "./tns-oauth-login-sub-controller";
function useAndroidX() {
    return global.androidx && global.androidx.appcompat;
}
const customtabs = useAndroidX()
    ? (_a = androidx.browser) === null || _a === void 0 ? void 0 : _a.customtabs : android.support.customtabs;
export class TnsOAuthLoginNativeViewController {
    constructor() {
        this.loginController = null;
    }
    static initWithClient(client) {
        const instance = new TnsOAuthLoginNativeViewController();
        if (instance) {
            instance.loginController = new TnsOAuthLoginSubController(client);
        }
        return instance;
    }
    loginWithParametersFrameCompletion(parameters, frame, urlScheme, completion) {
        const fullUrl = this.loginController.preLoginSetup(frame, urlScheme, completion);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    }
    logoutWithParametersFrameCompletion(parameters, frame, urlScheme, completion) {
        const fullUrl = this.loginController.preLogoutSetup(frame, urlScheme, completion);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    }
    openUrlWithParametersCompletion(fullUrl, frame) {
        const builder = new customtabs.CustomTabsIntent.Builder();
        builder.setToolbarColor(new Color("#335da0").android);
        builder.setShowTitle(true);
        const customTabsIntent = builder.build();
        customTabsIntent.launchUrl(Application.android.startActivity, android.net.Uri.parse(fullUrl));
    }
    resumeWithUrl(url) {
        if (!!url) {
            return this.loginController.resumeWithUrl(url, (tokenResult, error) => {
                this.loginController.completeLoginWithTokenResponseError(tokenResult, error);
            });
        }
        else {
            const er = "The login operation was canceled.";
            this.loginController.completeLoginWithTokenResponseError(null, er);
            return true;
        }
    }
}
//# sourceMappingURL=tns-oauth-native-view-controller.android.js.map