var QRError;

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
    let positiveResponse = false;
    console.log("popup requested page scan");
    chrome.tabs.query({active: true}, (tabs) => {

        for (let tab of tabs) {
            console.log(tab.id);
            chrome.tabs.sendMessage(tab.id, 1, (response) => {
                if (!chrome.runtime.lastError) {
                    if (response.QRLink) {
                        console.log(response.QRLink);
                        positiveResponse = true;
                    }
                }
            });
        }
    });
}