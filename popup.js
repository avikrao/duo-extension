const setupButton = document.querySelector(".setup-instr-button");
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

import { LoginStatus, getLoginStatus, generateHOTP, attemptAutofill, requestScan } from './background.js';

export const ScanError = {
    'NO_QR': 1,
    'INV_QR': 2
}

export const scanError = (error) => {
    loadingDiv.style.display = "none";
    switch (error) {
        case ScanError.NO_QR:
            scanErrorText.textContent = "No Duo QR link detected on the page.";
            break;
        case ScanError.INV_QR:
            scanErrorText.textContent = "QR link on page is invalid or expired.";
            break;
    }
    scanErrorText.removeAttribute("hidden");
}

export const scanSuccess = () => {
    loadingDiv.style.display = "none";
    entranceBox.style.display = "none";
    completeScreen.style.display = "block";
}

(async () => {
    if (generatedCode === null)
        return;

    await (async() => {
        const hotpCode = await generateHOTP();

        if (hotpCode === -1) {
            loadingDiv.style.display = "none";
            return;
        }

        let [code, count] = hotpCode;

        generatedCode.textContent = code.toString();
        countText.textContent = count.toString();

        loadingDiv.style.display = "none";
        entranceBox.style.display = "none";
        generationScreen.style.display = "block";

        await attemptAutofill(code);
    })();

    setupButton.addEventListener("click", () => {
        chrome.tabs.create({
            url: "https://github.com/AvikRao/duo-extension/wiki/Setup-and-Usage"
        });
    });

    scanButton.addEventListener("click", async () => {
        loadingDiv.style.display = "block";
        await requestScan();
    });

    generatedCode.addEventListener("click", () => {
        navigator.clipboard.writeText(generatedCode.textContent);
        copyConfirmation.removeAttribute("hidden");
    });

    generateButton.addEventListener("click", async () => {

        generationScreen.style.display = "none";
        loadingDiv.style.display = "block";

        const hotpCode = await generateHOTP();

        if (hotpCode === -1) {
            loadingDiv.style.display = "none";
            entranceBox.style.display = "block";
            return;
        }

        let [code, count] = hotpCode;

        generatedCode.textContent = code.toString();
        countText.textContent = count.toString();

        loadingDiv.style.display = "none";
        entranceBox.style.display = "none";
        generationScreen.style.display = "block";
    });

})();
