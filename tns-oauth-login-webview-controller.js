import { Application, Page, GridLayout, NavigationButton, WebView, } from "@nativescript/core";
import { TnsOAuthLoginSubController, } from "./tns-oauth-login-sub-controller";
const SOFT_INPUT_ADJUST_RESIZE = 16;
export class TnsOAuthLoginWebViewController {
    constructor() {
        this.loginController = null;
    }
    static initWithClient(client) {
        const instance = new TnsOAuthLoginWebViewController();
        if (instance) {
            instance.loginController = new TnsOAuthLoginSubController(client);
        }
        return instance;
    }
    loginWithParametersFrameCompletion(parameters, frame, urlScheme, completion) {
        const fullUrl = this.loginController.preLoginSetup(frame, urlScheme, completion);
        console.log('------------------------ loginWithParametersFrameCompletion -----------------------------');
        console.log(fullUrl);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    }
    logoutWithParametersFrameCompletion(parameters, frame, urlScheme, completion) {
        const fullUrl = this.loginController.preLogoutSetup(frame, urlScheme, completion);
        this.openUrlWithParametersCompletion(fullUrl, frame);
    }
    openUrlWithParametersCompletion(fullUrl, frame) {
        console.log('----------------------------- openUrlWithParametersCompletion -----------------------------')
        console.dir(fullUrl);
        this.goToWebViewPage(frame, fullUrl);
    }
    goToWebViewPage(frame, url) {
        frame.navigate(() => this.createWebViewPage(url));
    }
    createWebViewPage(url) {
        const webView = this.createWebView(url, this.pageLoadStarted.bind(this), this.pageLoadFinished.bind(this));
        const grid = new GridLayout();
        grid.addChild(webView);
        const page = new Page();
        page.content = grid;
        if (global.isAndroid) {
            page.actionBarHidden = true;
            page.on("navigatedTo", () => {
                this.setAndroidSoftInputModeToResize();
                webView.android.getSettings().setDomStorageEnabled(true);
                webView.android.getSettings().setBuiltInZoomControls(false);
            });
            page.on("navigatingFrom", () => {
                this.restoreAndroidSoftInputMode();
            });
        }
        else {
            const navBtn = new NavigationButton();
            navBtn.text = "";
            page.actionBar.navigationButton = navBtn;
        }
        const onCancel = () => {
            this.loginController.completeLoginWithTokenResponseError(null, new Error("User cancelled."));
        };
        page.on("navigatedFrom", onCancel);
        this.unbindCancelEvent = () => page.off("navigatedFrom", onCancel);
        return page;
    }
    createWebView(url, loadStarted, loadFinished) {
        const webView = new WebView();
        webView.on("loadStarted", loadStarted);
        webView.on("loadFinished", loadFinished);
        webView.src = url;
        return webView;
    }
    resumeWithUrl(url) {
        return this.loginController.resumeWithUrl(url, (tokenResult, error) => {
            this.loginController.completeLoginWithTokenResponseError(tokenResult, error);
            if (this.unbindCancelEvent) {
                this.unbindCancelEvent();
            }
            this.loginController.frame.goBack();
        });
    }
    pageLoadStarted(args) {
        console.log("WebView loadStarted " + args.url);
        if (args.url.startsWith(this.loginController.client.provider.options.redirectUri)) {
            if (global.isAndroid && args.object && args.object["stopLoading"]) {
                args.object.parent.style.visibility = 'collapse'; // this page is meant to stop loading, but seems to still show an android url scheme error page, so lets just hide it with css! SCOTT

                args.object["stopLoading"]();
            }
            this.resumeWithUrl(args.url);
        }
    }
    pageLoadFinished(args) {
        console.log("WebView loadFinished " + args.url);
        if (args.url.startsWith(this.loginController.client.provider.options.redirectUri)) {
            if (global.isAndroid && args.object && args.object["stopLoading"]) {
                args.object.parent.style.visibility = 'collapse'; // this page is meant to stop loading, but seems to still show an android url scheme error page, so lets just hide it with css! SCOTT

                args.object["stopLoading"]();
            }
            this.resumeWithUrl(args.url);
        }

    }
    setAndroidSoftInputModeToResize() {
        const window = Application.android.foregroundActivity.getWindow();
        this.originalSoftInputMode = window.getAttributes().softInputMode;
        window.setSoftInputMode(SOFT_INPUT_ADJUST_RESIZE);
    }
    restoreAndroidSoftInputMode() {
        const window = Application.android.foregroundActivity.getWindow();
        window.setSoftInputMode(this.originalSoftInputMode);
    }
}
//# sourceMappingURL=tns-oauth-login-webview-controller.js.map