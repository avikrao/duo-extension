const scanButton = document.querySelector(".scan-button");
const loadingDiv = document.querySelector(".loading");
const scanErrorText = document.querySelector(".scan-error");
var backgroundPage;

chrome.runtime.getBackgroundPage((backgroundPage) => {

    backgroundPage.scanError = () => {
        loadingDiv.style.display = "none";
        scanErrorText.removeAttribute("hidden");
    }

    var loginStatus = backgroundPage.getLoginStatus();

    if (loginStatus === 'UNLOGGED') {
        loadingDiv.style.display = "none";
    }

    scanButton.addEventListener("click", async () => {
        loadingDiv.style.display = "block";
        backgroundPage.requestScan();
    });

    function catchQRError(error) {
        if (error == 1) {
            input.style.borderColor = "red";
            let invalidLinkMessage = document.querySelector("#incorrect-qr-url");
            invalidLinkMessage.removeAttribute("hidden");
        }
    }

    async function sendToBackground(QRLink) {
        let backgroundWindow = await chrome.runtime.getBackgroundPage();
        backgroundWindow.QRError = catchQRError;
        backgroundWindow.validateQR(QRLink);
    }

});

