import { scanError, scanSuccess, ScanError } from './popup.js';
import { Hotp } from './jsOTP.js';

const hotp = new Hotp();

function browser() {
    return { storage: {
        local: {
            async get(keys) {
                return await new Promise((resolve, _) => {
                    chrome.storage.local.get(keys, x => resolve(x));
                });
            },
            async set(obj) {
                await new Promise((resolve, _) => {
                    chrome.storage.local.set(obj, resolve);
                });
            }
        }
    },
        tabs: {
            async query(attrs) {
                return await new Promise((resolve, reject) => {
                    chrome.tabs.query(attrs, tabs => resolve(tabs));
                });
            },
            async sendMessage(id, msg) {
                return await new Promise((resolve, reject) => {
                    chrome.tabs.sendMessage(id, msg, resp => {
                        if (!chrome.runtime.lastError)
                            resolve(resp);
                        else
                            reject(chrome.runtime.lastError);
                    });
                });
            }
        }
    }
};

export async function generateHOTP() {
    let storage = await browser().storage.local.get(["key", "count"]);

    if (Object.keys(storage).length == 0) {
        return -1;
    }

    let { key, count } = storage;

    count++;

    browser().storage.local.set({ count });

    return [hotp.getOtp(key, count), count];
}

export async function processQR(QRLink) {
    const QRUrl = new URL(QRLink),
        query = new URLSearchParams(QRUrl.search),
        value = query.get("value"),
        data = decodeURIComponent(value),
        split = data.split("-");
    
    if (!split) {
        return 1;
    }
    console.log(QRLink);
    let code = split[0];
    let hostb64 = split[1];

    code = code.replace("duo://", "");
    const host = atob(hostb64 + "=".repeat((((-(hostb64.length)) % 4) + 4) % 4));
    console.log(code);
    console.log(host);

    const activation_url = `https://${host}/push/v2/activation/${code}`;
    console.log(activation_url);

    const activate = await fetch(activation_url, {method: 'POST'});
    const activationData = await activate.json();

    console.log(activationData);

    if (activationData["stat"] === "FAIL" ||
        !activationData["response"]["hotp_secret"]) {
        scanError(ScanError.INV_QR);
        return;
    }

    const secret = activationData["response"]["hotp_secret"];
    console.log(secret);

    if (!secret) {
        scanError(ScanError.INV_QR);
        return;
    }

    await browser().storage.local.set({"key": secret, "count": 0});
    scanSuccess();
}

export async function requestScan() {
    let positiveResponse = false
    let tabs = await browser().tabs.query({active: true});

    for (let tab of tabs) {
        try {
            let response = await browser().tabs.sendMessage(tab.id, {"request": "QR_REQUEST"});
            if (response.QRLink) {
                processQR(response.QRLink);
            }
        } catch (e) {
            console.error("scan error: ", e);
            setTimeout(() => scanError(ScanError.NO_QR), 2000);
        }
    }
}

export async function attemptAutofill(code) {
    let tabs = await browser().tabs.query({active: true}); 

    for (let tab of tabs) {
        try {
            let response = await browser().tabs.sendMessage(tab.id, {"request": "AUTOFILL", code});
            console.log(response)
        } catch (e) {
            console.error(e);
        }
    }
}
