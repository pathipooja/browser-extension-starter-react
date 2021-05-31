import React, { useState } from 'react';
import {
    sendChromeMessage,
    sendMessageToContentScript,
    sendMessageToContentScriptWithResponse,
} from '../utils/chrome.message';

interface List {
    title: string;
}

function ButtonComponent(): JSX.Element {
    const [state, setState] = useState('');

    const [response, setResponse] = useState('');

    const [list, setList] = useState<List[]>([]);

    function sendMessage() {
        sendMessageToContentScript({ name: state });
    }

    async function sendMessageWithResponse() {
        const resp = await sendMessageToContentScriptWithResponse<unknown, string>({ name: state });
        setResponse(resp);
    }

    async function getDataFromBackgroundScript(): Promise<void> {
        const listResp = await sendChromeMessage<unknown, List[]>({ type: 'http' });
        setList(listResp);
    }

    return (
        <div>
            <p>When You click on button, you will see alert in host page, this is with chrome messages</p>
            <input
                onChange={(e) => setState(e.target.value)}
                value={state}
                placeholder="enter message for alert"
                type="text"
                name="message"
                id="message"
            />
            <button onClick={sendMessage}> sendMessage </button>
            <button onClick={sendMessageWithResponse}>sendMessageWithResponse</button>
            <p>Response is: {response}</p>
            <button onClick={getDataFromBackgroundScript}>getResponseFromBackgroundScript</button>
            <p>List from Background script </p>
            {list.map((l) => (
                <p key={l.title}>title is :{l.title}</p>
            ))}
        </div>
    );
}

export default ButtonComponent;
