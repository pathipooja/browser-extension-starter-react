console.log('this is background script');

interface Message {
    type: 'http';
}

function httpRequest() {
    return fetch('https://jsonplaceholder.typicode.com/todos');
}

function listenAndRespondBackgroundMessaged(): void {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
        if (message.type === 'http') {
            httpRequest().then((res) => {
                res.json().then((data) => {
                    sendResponse(data);
                });
            });
        }
        return true; // this indicates that we will send response asynchronously
    });
}

listenAndRespondBackgroundMessaged();
