var scanError;
var loginStatus = "UNLOGGED";

function getLoginStatus() {
    return loginStatus;
}

function validateQR(QRLink) {
    try {
        const QRUrl = new URL(QRLink);
    } catch (e) {
        console.log(QRLink);
        console.log(e);
        QRError(1);
    }
}

function requestScan() {
    let positiveResponse = false
    console.log("popup requested page scan");
    loginStatus = "LOADING";

    chrome.tabs.query({active: true}, (tabs) => {

        for (let tab of tabs) {
            console.log(tab.id);
            chrome.tabs.sendMessage(tab.id, "QR_REQUEST", (response) => {
                if (!chrome.runtime.lastError) {
                    if (response.QRLink) {
                        console.log(response.QRLink);
                        positiveResponse = true;
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