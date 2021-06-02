import { doc } from "prettier";

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
            //listener to handle mouse event:onclick
            document?.addEventListener("click", handleMouseClick)

            //listener to handle mouse event:mouseover
            document?.addEventListener("mouseover", handleMouseOver)

            //sending response to popup
            sendResponse(`Hello, ${message.name}`);
        }, 1000);
        return true; // this indicates that we will send response asynchronously
    });
}



//function to change the background of 1st div element in the page
function changeBackground() {
    let element = document.querySelector("div");
    if (element !== null)
        element.style.backgroundColor = "cyan"
}

//function to change the title of the page
function changeTitle() {
    let element = document.querySelector("head > title");
    if (element !== null)
        element.textContent = "This is your new Title"
}

//function to change the background of elements on mouseover after sending message
function handleMouseOver(e: MouseEvent) {
    const target = e.target! as any
    const items = target.children
    for (let i of items) {
        if (i.style.backgroundColor !== "yellow") {
            console.log(i + "got changed to yellow")
            i.style.backgroundColor = "yellow"
        }
        else {
            console.log(i + "got changed to pink")
            i.style.backgroundColor = "pink"
        }
    }
}

//function to add <p> tags with the element being clicked after sending message
function handleMouseClick(e: MouseEvent) {
    let new_defn = document.createElement("DIV")
    let child = document.createElement("P")
    child.textContent = "You just clicked" + e.target
    new_defn.appendChild(child)
    document?.body?.prepend(new_defn)
}

// listenToMessages();
listenAndRespond();

//calling title change func after 5 seconds
/*setTimeout(()=>{
    console.log("calling function to change title of the page");
    changeTitle();
},5000)
*/

//calling changeBackground() after 3 seconds to change background color of 1st div element
setTimeout(() => {
    console.log("calling function to change the background color of  web page");
    changeBackground()
}, 3000)