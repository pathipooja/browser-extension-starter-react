export function sendMessageToContentScript<T>(message: T): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs?.[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    });
}

export function sendMessageToContentScriptWithResponse<T, R>(message: T): Promise<R> {
    return new Promise<R>((res) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs?.[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                    return res(response);
                });
            }
        });
    });
}

export function sendChromeMessage<T, R>(message: T): Promise<R> {
    return new Promise<R>((res) => {
        chrome.runtime.sendMessage(message, (resp) => {
            res(resp);
        });
    });
}
