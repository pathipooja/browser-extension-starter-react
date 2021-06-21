export const workflow = {
    name: 'frames flow',
    steps: [
        {
            name: 'step1',
            content: 'Click on reports',
            iframes: [],
            selector:
                'body > div.desktop.container.forceStyle.oneOne.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.tablet > div.viewport > section > div.none.navexStandardManager > div.slds-no-print.oneAppNavContainer > one-appnav > div > one-app-nav-bar > nav > div > one-app-nav-bar-item-root:nth-child(7)',
            type: 'click',
        },
        {
            name: 'step2',
            content: 'Click on new report',
            iframes: [],
            selector:
                '#brandBand_2 > div > div > div.windowViewMode-normal.oneContent.active.lafPageHost > div > div.slds-page-header.slds-has-bottom-magnet > div > div.slds-col.slds-no-flex.slds-grid.slds-align-middle > span > ul > li:nth-child(1) > a',
            type: 'click',
        },
        {
            name: 'step3',
            content: 'Type your search keyword here',
            iframes: ['#brandBand_2 > div > div > div.windowViewMode-normal.oneContent.active.lafPageHost > iframe'],
            selector: '#modal-search-input',
            type: 'keypress',
        },
    ],
};

function listenAndRespondBackgroundMessaged(): void {
    chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
        if (message.type === 'request') {
        sendResponse(workflow);   
        }
        return true; // this indicates that we will send response asynchronously
    });
}

listenAndRespondBackgroundMessaged();
