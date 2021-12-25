const scanButton = document.querySelector(".scan-button");
const loadingDiv = document.querySelector(".loading");
const scanErrorText = document.querySelector(".scan-error");
const entranceBox = document.querySelector(".entrance-box");
const generatedCode = document.querySelector(".generated-code");
const copyConfirmation = document.querySelector(".copy-confirmation");

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

    if (loginStatus === "UNLOGGED" ) {
        loadingDiv.style.display = "none";
    } else if (loginStatus === "LOGGED") {
        loadingDiv.style.display = "none";
        entranceBox.style.display = "none";
    }

    scanButton.addEventListener("click", async () => {
        loadingDiv.style.display = "block";
        backgroundPage.requestScan();
    });

    generatedCode.addEventListener("click", () => {
        navigator.clipboard.writeText(generatedCode.innerHTML);
        copyConfirmation.removeAttribute("hidden");
    });

});

