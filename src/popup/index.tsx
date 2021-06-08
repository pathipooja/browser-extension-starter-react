import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import ButtonComponent from './button/button.component';
import { sendMessageToContentScript } from "./utils/chrome.message"
require('./index.scss');

function App() {
    const [selector_status, setSelectorStatus] = useState(false)
    const [marker_status, setMarkerStatus] = useState(false)
    useEffect( ()=> {
        chrome.storage.local.get(function (records) {
            if ('selector_status' in records) {
                //fetch the previously stored status before refresh and set the selector
                setSelectorStatus(records['selector_status']);
            } else {
                //if not stored....initially it will be set to false in the store
                chrome.storage.local.set({ selector_status });
            }
            if ('marker_status' in records) {
                //fetch the previously stored status before refresh and set the marker
                setMarkerStatus(records['marker_status']);
            } else {
                //if not stored....initially it will be set to false in the store
                chrome.storage.local.set({ marker_status });
            }
        });
    }, []);

    useEffect(
         ()=> {
             console.log("Selector status: "+selector_status)
            chrome.storage.local.set({ selector_status });
            sendMessageToContentScript({ selector_status });
        },
        [selector_status],
    );
    useEffect(
         ()=> {
             console.log("Marker Status: "+marker_status)
            chrome.storage.local.set({ marker_status });
            sendMessageToContentScript({ marker_status });
        },
        [marker_status],
    );
    return (
        <div className="main">
            <h3>Selector</h3>
            <input type="checkbox" checked={selector_status} onChange={() => setSelectorStatus(!selector_status)}>
            </input><br /><br />
            <h3>Marker</h3>
            <input type="checkbox" checked={marker_status} onChange={() => setMarkerStatus(!marker_status)}>
            </input>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
