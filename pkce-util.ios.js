const SHA256_DIGEST_LENGTH = 32;
export function getCodeVerifier() {
    const randomData = NSMutableData.dataWithLength(SHA256_DIGEST_LENGTH);
    const result = SecRandomCopyBytes(kSecRandomDefault, randomData.length, randomData.mutableBytes);
    if (result !== 0) {
        return null;
    }
    else {
        return encodeBase64urlNoPadding(randomData);
    }
}
export function sha256base64encoded(inputString) {
    const verifierData = NSString.stringWithString(inputString).dataUsingEncoding(NSUTF8StringEncoding);
    const sha256Verifier = NSMutableData.dataWithLength(SHA256_DIGEST_LENGTH);
    CC_SHA256(verifierData.bytes, verifierData.length, sha256Verifier.mutableBytes);
    return encodeBase64urlNoPadding(sha256Verifier);
}
function encodeBase64urlNoPadding(data) {
    let base64string = data.base64EncodedStringWithOptions(0);
    base64string = base64string.replace(/\+/g, "-");
    base64string = base64string.replace(/\//g, "_");
    base64string = base64string.replace(/=/g, "");
    return base64string;
}
//# sourceMappingURL=pkce-util.ios.js.map