const img = document.querySelector(".qr-entry-submit-icon");
const input = document.querySelector(".qr-entry-input");

img.addEventListener("mouseover", () => {
    img.setAttribute("src", "arrow-green.png");
});

img.addEventListener("mouseout", () => {
    img.setAttribute("src", "arrow-white.png");
});

function catchQRError(error) {
    if (error == 1) {
        input.style.borderColor = "red";
        let invalidLinkMessage = document.querySelector("#incorrect-qr-url");
        invalidLinkMessage.removeAttribute("hidden");
    }
}

async function sendToBackground(QRLink) {
    let backgroundWindow = await browser.runtime.getBackgroundPage();
    backgroundWindow.QRError = catchQRError;
    backgroundWindow.validateQR(QRLink);
}

img.addEventListener("click", async () => {
    let QRLink = document.querySelector(".qr-entry-input").value;
    sendToBackground(QRLink);
});

input.addEventListener("keydown", (key) => {
    if (key.keyCode == 13) {
        let QRLink = document.querySelector(".qr-entry-input").value;
        sendToBackground(QRLink);
    }
});





