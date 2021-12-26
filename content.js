let qr = document.querySelector(".qr");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (qr && qr.currentSrc && message.request && message.request === "QR_REQUEST") {
        sendResponse({QRLink: qr.currentSrc});
    } else if (message.request && message.code && message.request === "AUTOFILL"){
        let enterButton = document.querySelector("#passcode");
        if (!enterButton) {
            sendResponse({error: 2});
            return;
        } 
        enterButton.click();
        let codeInput = document.querySelector(".passcode-input");
        if (!codeInput) {
            sendResponse({error: 3});
            return;
        }
        codeInput.value = message.code.toString();
        enterButton = document.querySelector("#passcode");
        if (!enterButton) {
            sendResponse({error: 4});
            return;
        }
        enterButton.click();
        sendResponse("success!");
    } else {
        sendResponse({error: 1});
    }
    // return true;
})
