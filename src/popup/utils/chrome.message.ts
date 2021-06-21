
export function sendChromeMessage<T, R>(message: T): Promise<R> {
    return new Promise<R>((res) => {
        chrome.runtime.sendMessage(message, (resp) => {
            res(resp);
        });
    });
}
