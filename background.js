var scanError;
var loginStatus = "UNLOGGED";

function getLoginStatus() {
    return loginStatus;
}

function processQR(QRLink) {
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
                    setTimeout(scanError, 2000);
                }
            });
        }

    });

}