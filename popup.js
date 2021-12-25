const scanButton = document.querySelector(".scan-button");
const loadingDiv = document.querySelector(".loading");
const scanErrorText = document.querySelector(".scan-error");
const entranceBox = document.querySelector(".entrance-box");
const generationScreen = document.querySelector(".generation-screen");
const generatedCode = document.querySelector(".generated-code");
const copyConfirmation = document.querySelector(".copy-confirmation");
const countText = document.querySelector(".count");
const generateButton = document.querySelector(".generate-button");
const completeScreen = document.querySelector(".scan-complete-screen");

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
        entranceBox.style.display = "none";
        completeScreen.style.display = "block";
    }

    var loginStatus = await backgroundPage.getLoginStatus();

    if (loginStatus === "UNLOGGED" ) {
        loadingDiv.style.display = "none";
    } else if (loginStatus === "LOGGED") {

        let hotpCode = await backgroundPage.generateHOTP();

        if (hotpCode === -1) {
            loadingDiv.style.display = "none";
            return;
        }

        generatedCode.innerHTML = hotpCode[0].toString();
        countText.innerHTML = hotpCode[1].toString();

        loadingDiv.style.display = "none";
        entranceBox.style.display = "none";
        generationScreen.style.display = "block";

        backgroundPage.attemptAutofill(hotpCode[0]);

    }

    scanButton.addEventListener("click", async () => {
        loadingDiv.style.display = "block";
        backgroundPage.requestScan();
    });

    generatedCode.addEventListener("click", () => {
        navigator.clipboard.writeText(generatedCode.innerHTML);
        copyConfirmation.removeAttribute("hidden");
    });

    generateButton.addEventListener("click", async () => {

        generationScreen.style.display = "none";
        loadingDiv.style.display = "block";

        let hotpCode = await backgroundPage.generateHOTP();

        if (hotpCode === -1) {
            loadingDiv.style.display = "none";
            entranceBox.style.display = "block";
            return;
        }

        generatedCode.innerHTML = hotpCode[0].toString();
        countText.innerHTML = hotpCode[1].toString();

        loadingDiv.style.display = "none";
        entranceBox.style.display = "none";
        generationScreen.style.display = "block";
    });

});

