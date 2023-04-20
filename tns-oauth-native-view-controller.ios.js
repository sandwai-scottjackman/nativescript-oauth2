import { TnsOAuthLoginSubController, } from "./tns-oauth-login-sub-controller";
function setup() {
    var TnsOAuthLoginNativeViewController = /** @class */ (function (_super) {
    __extends(TnsOAuthLoginNativeViewController, _super);
    function TnsOAuthLoginNativeViewController() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loginController = null;
        return _this;
    }
    TnsOAuthLoginNativeViewController.initWithClient = function (client) {
        var instance = new TnsOAuthLoginNativeViewController();
        if (instance) {
            instance.loginController = new TnsOAuthLoginSubController(client);
        }
        return instance;
    };
    TnsOAuthLoginNativeViewController.prototype.loginWithParametersFrameCompletion = function (parameters, frame, urlScheme, completion) {
        var fullUrl = this.loginController.preLoginSetup(frame, urlScheme, completion);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    };
    TnsOAuthLoginNativeViewController.prototype.logoutWithParametersFrameCompletion = function (parameters, frame, urlScheme, completion) {
        var fullUrl = this.loginController.preLogoutSetup(frame, urlScheme, completion);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    };
    TnsOAuthLoginNativeViewController.prototype.openUrlWithParametersCompletion = function (fullUrl, frame) {
        this.safariViewController = SFSafariViewController.alloc().initWithURLEntersReaderIfAvailable(NSURL.URLWithString(fullUrl), false);
        this.safariViewController.delegate = this;
        if (frame.parent) {
            var topmostParent = frame.parent;
            while (topmostParent.parent) {
                topmostParent = topmostParent.parent;
            }
            topmostParent.viewController.presentViewControllerAnimatedCompletion(this.safariViewController, true, null);
        }
        else {
            frame.ios.controller.presentViewControllerAnimatedCompletion(this.safariViewController, true, null);
        }
    };
    TnsOAuthLoginNativeViewController.prototype.resumeWithUrl = function (url) {
        var _this = this;
        return this.loginController.resumeWithUrl(url, function (tokenResult, error) {
            if (_this.safariViewController) {
                _this.safariViewController.dismissViewControllerAnimatedCompletion(true, function () {
                    _this.loginController.completeLoginWithTokenResponseError(tokenResult, error);
                });
            }
            else {
                _this.loginController.completeLoginWithTokenResponseError(tokenResult, error);
            }
        });
    };
    // SFSafariViewControllerDelegate delegate members
    TnsOAuthLoginNativeViewController.prototype.safariViewControllerDidFinish = function (controller) {
        if (controller !== this.safariViewController) {
            // Ignore this call if safari view controller doesn't match
            return;
        }
        if (!this.loginController.authState) {
            // Ignore this call if there is no pending login flow
            return;
        }
        var er = "The login operation was canceled.";
        this.loginController.completeLoginWithTokenResponseError(null, er);
    };
    TnsOAuthLoginNativeViewController.ObjCProtocols = [SFSafariViewControllerDelegate];
    return TnsOAuthLoginNativeViewController;
}(NSObject));
    return TnsOAuthLoginNativeViewController;
}
export const TnsOAuthLoginNativeViewController = setup();
//# sourceMappingURL=tns-oauth-native-view-controller.ios.js.map