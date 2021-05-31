console.log('this is content script');

interface MessageWithResponse {
    name: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenToMessages(): void {
    chrome.runtime.onMessage.addListener((message) => {
        console.log(message);
    });
}

function listenAndRespond() {
    chrome.runtime.onMessage.addListener((message: MessageWithResponse, _sender, sendResponse) => {
        console.log('Got message from CS');
        setTimeout(() => {
            sendResponse(`Hello, ${message.name}`);
        }, 1000);
        return true; // this indicates that we will send response asynchronously
    });
}

// listenToMessages();
listenAndRespond();
