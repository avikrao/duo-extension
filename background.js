var scanError, scanSuccess;
var loginStatus = "UNLOGGED";
var hotp;

async function getLoginStatus() {

    hotp = new jsOTP.hotp();

    const waitForStorage = new Promise((resolve, reject) => {
        chrome.storage.local.get(["key", "count"], (items) => {
            if (!Object.keys(items).length) {
                loginStatus = "UNLOGGED";
            } else {
                console.log("LOGGED!");
                loginStatus = "LOGGED";
            }
            resolve();
        });
    });

    await waitForStorage;
    return loginStatus;
}

async function processQR(QRLink) {
    // console.log(QRLink);
    const QRUrl = new URL(QRLink),
        query = new URLSearchParams(QRUrl.search),
        value = query.get("value"),
        data = decodeURIComponent(value),
        split = data.split("-");
    
    if (!split) {
        return 1;
    }
    console.log(QRLink);
    code = split[0];
    hostb64 = split[1];

    code = code.replace("duo://", "");
    host = atob(hostb64 + "=".repeat((((-(hostb64.length)) % 4) + 4) % 4));
    console.log(code);
    console.log(host);

    activation_url = `https://${host}/push/v2/activation/${code}`;
    console.log(activation_url);

    const activate = await fetch(activation_url, {method: 'POST'});
    const activationData = await activate.json();

    console.log(activationData);

    if (activationData["stat"] === "FAIL" ||
        !activationData["response"]["hotp_secret"]) {
        loginStatus = "UNLOGGED";
        scanError("INV_QR");
        return;
    }

    const secret = activationData["response"]["hotp_secret"];
    console.log(secret);

    if (!secret) {
        loginStatus = "UNLOGGED";
        scanError("INV_QR");
        return;
    }

    chrome.storage.local.set({"key": secret, "count": 0}, () => {
        loginStatus = "LOGGED";
        scanSuccess();
    });

}

function requestScan() {
    let positiveResponse = false
    loginStatus = "LOADING";
    chrome.tabs.query({active: true}, (tabs) => {

        for (let tab of tabs) {
            chrome.tabs.sendMessage(tab.id, "QR_REQUEST", (response) => {
                if (!chrome.runtime.lastError) {
                    if (response.QRLink) {
                        positiveResponse = true;
                        processQR(response.QRLink);
                    }
                }

                if (!positiveResponse) {
                    console.log("scan error");
                    loginStatus = "UNLOGGED";
                    setTimeout(() => scanError("NO_QR"), 2000);
                }
            });
        }

    });

}