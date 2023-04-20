import { Application, AndroidApplication } from "@nativescript/core";
Application.android.on(AndroidApplication.activityResumedEvent, (args) => {
    if (new String(args.activity.getIntent().getAction()).valueOf() ===
        new String(android.content.Intent.ACTION_VIEW).valueOf()) {
        const url = args.activity.getIntent().getData().toString();
        if (TnsOAuthClientAppDelegate._client) {
            TnsOAuthClientAppDelegate._client.resumeWithUrl(url);
        }
        console.log(args.activity.getIntent().getData());
    }
    else {
        if (TnsOAuthClientAppDelegate._client) {
            TnsOAuthClientAppDelegate._client.resumeWithUrl(null);
        }
    }
});
export class TnsOAuthClientAppDelegate {
    static setConfig(client, urlScheme) {
        this._client = client;
        this._urlScheme = urlScheme;
    }
    static doRegisterDelegates() {
    }
}
//# sourceMappingURL=index.android.js.map