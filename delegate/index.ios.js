import * as applicationModule from '@nativescript/core/application';
function setup() {
    class TnsOAuthClientAppDelegate {
        static setConfig(client, urlScheme) {
            this._client = client;
            this._urlScheme = urlScheme;
        }
        static getAppDelegate() {
            if (!!applicationModule.ensureNativeApplication) {
                applicationModule.ensureNativeApplication();
            }
            if (applicationModule.ios.delegate === undefined) {
                var UIApplicationDelegateImpl = /** @class */ (function (_super) {
    __extends(UIApplicationDelegateImpl, _super);
    function UIApplicationDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UIApplicationDelegateImpl.ObjCProtocols = [UIApplicationDelegate];
    return UIApplicationDelegateImpl;
}(UIResponder));
                applicationModule.ios.delegate = UIApplicationDelegateImpl;
            }
            return applicationModule.ios.delegate;
        }
        static doRegisterDelegates() {
            this.addAppDelegateMethods(this.getAppDelegate());
        }
        static handleIncomingUrl(url) {
            if (!TnsOAuthClientAppDelegate._client ||
                !TnsOAuthClientAppDelegate._urlScheme) {
                console.log("IMPORTANT: Could not complete login flow.");
                return false;
            }
            if (url.scheme.toLowerCase() === TnsOAuthClientAppDelegate._urlScheme) {
                TnsOAuthClientAppDelegate._client.resumeWithUrl(url.absoluteString);
                return true;
            }
            else {
                return false;
            }
        }
    }
    TnsOAuthClientAppDelegate.addAppDelegateMethods = appDelegate => {
        appDelegate.prototype.applicationOpenURLOptions = (application, url, options) => {
            TnsOAuthClientAppDelegate.handleIncomingUrl(url);
        };
        appDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = (application, url, sourceApplication, annotation) => {
            TnsOAuthClientAppDelegate.handleIncomingUrl(url);
        };
    };
    return TnsOAuthClientAppDelegate;
}
export const TnsOAuthClientAppDelegate = setup();
//# sourceMappingURL=index.ios.js.map