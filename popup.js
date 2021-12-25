const scanButton = document.querySelector(".scan-button");
const loadingDiv = document.querySelector(".loading");
const scanErrorText = document.querySelector(".scan-error");
var backgroundPage;

chrome.runtime.getBackgroundPage(async (backgroundPage) => {

    backgroundPage.scanError = (error) => {
        loadingDiv.style.display = "none";
        switch (error) {
            case "NO_QR" :
                scanErrorText.innerHTML = "No Duo QR link detected on the page.";
                break;
            case "INV_QR" :
                scanErrorText.innerHTML = "QR link on page is invalid or expired.";
                break;
        }
        scanErrorText.removeAttribute("hidden");
    }

    backgroundPage.scanSuccess = () => {
        loadingDiv.style.display = "none";
    }

    var loginStatus = await backgroundPage.getLoginStatus();

    if (loginStatus === "UNLOGGED" || loginStatus === "LOGGED") {
        loadingDiv.style.display = "none";
    }

    scanButton.addEventListener("click", async () => {
        loadingDiv.style.display = "block";
        backgroundPage.requestScan();
    });

});

