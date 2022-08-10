VERIFY_CLICK_TIMEOUT = 250;

function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.request && message.request === "QR_REQUEST") {
        let qr = document.querySelector(".qr");
        qr = qr ? qr : document.querySelector("[data-testid='qr-code']");
        if (qr && qr.currentSrc) {
            sendResponse({QRLink: qr.currentSrc});
        }
    } else if (message.request && message.code && message.request === "AUTOFILL"){
        let enterButton = document.querySelector("#passcode");
        let verifyButton = document.querySelector(".verify-button");
        let otherOptionsButton = Array.from(document.querySelectorAll(".button--link, .action-link")).find(elem => 
            elem.textContent === "Other options"
        );
        if (enterButton) {
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
        } else if (verifyButton) {
            waitForElm(".passcode-input").then(codeInput => {
                codeInput.value = message.code.toString();
                codeInput.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => {
                    verifyButton.click();
                    sendResponse("success!");
                }, VERIFY_CLICK_TIMEOUT);
            });
        } else if (otherOptionsButton) {
            otherOptionsButton.click(); 
            waitForElm("[data-testid='test-id-mobile-otp']").then(authButtonDiv => {
                let authButton = authButtonDiv.children[0];
                if (!authButton) {
                    sendResponse({error: 6});
                    return;
                }
                authButton.click();
                waitForElm(".passcode-input").then(codeInput => {
                    let verifyButton = document.querySelector(".verify-button");
                    if (!verifyButton) {
                        sendResponse({error: 7});
                        return;
                    }
                    codeInput.value = message.code.toString();
                    codeInput.dispatchEvent(new Event('input', { bubbles: true }));
                    setTimeout(() => {
                        verifyButton.click();
                        sendResponse("success!");
                    }, VERIFY_CLICK_TIMEOUT);
                });
            })
        } else {
            sendResponse({error: 2});
            return;
        } 
    } else {
        sendResponse({error: 1});
    }
})
