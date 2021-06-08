import { doc } from "prettier";
import unique from "unique-selector"
import { bottom, createPopper } from '@popperjs/core';
console.log('this is content script');

interface MessageWithResponse {
    name: string;
}
//Type of records used in local storage
interface Records {
    [key: string]: string[];
}

//global variable to store marker status
//It can be used outside the onMessage listener to add outline
var cur_marker_status = false;

//function to add the style tag to head 
function addStyleToHead() {
    const style_tag = document.createElement('style');
    style_tag.innerHTML = '.highlight{outline:5px dashed green} .hoverstyle{outline:5px dashed blue}';
    document.getElementsByTagName('head')[0].appendChild(style_tag);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function listenToMessages(): void {
    chrome.runtime.onMessage.addListener((message) => {
        //adding listeners when selector is checked
        if ('selector_status' in message) {
            if (message['selector_status'] === true) {

                console.log("Selector activated");
                //listener to handle mouse event:onclick
                document?.addEventListener("click", handleMouseClick);

                //listener to handle mouse event:mouseover
                document?.addEventListener("mouseover", handleMouseOver);
            }

            //removing listeners when selector is unchecked
            else {
                console.log("Selector deactivated");
                document?.removeEventListener("click", handleMouseClick);
                document?.removeEventListener("mouseover", handleMouseOver);
            }
        }
        if ('marker_status' in message) {
            //setting the marker status to true when marker is checked
            if (message['marker_status'] === true) {
                console.log("Marker activated");
                cur_marker_status = true;
                //function call to add outline
                highlight_elements();
            }

            //setting the marker status to false when marker is unchecked
            else {
                console.log("Marker deactivated");
                cur_marker_status = false;
                //function call to remove outline
                remove_highlight();
            }
        }
    })
}

/*
function listenAndRespond() {
    chrome.runtime.onMessage.addListener((message: MessageWithResponse, _sender, sendResponse) => {
        console.log('Got message from CS');
        //sending response to popup
        setTimeout(() => {
            sendResponse(`Hello, ${message.name}`);
        }, 1000);
        return true; // this indicates that we will send response asynchronously
    });
}
*/

//function to change the background of elements on mouseover after sending message
function handleMouseOver(e: MouseEvent) {
    const target = <HTMLElement>e.target;
    target.classList.add('hoverstyle');
    //on mouseout...remove the outline
    target.addEventListener("mouseout", function () {
        target.classList.remove('hoverstyle');
    })
}

//function to store the elements on mouse click when the selector mode is ON
async function handleMouseClick(e: MouseEvent) {
    e.preventDefault();
    const target = <HTMLElement>e.target;
    //generating the unique selectors by excluding the classes added for outlines
    //to make sure that the selectors wont match with each other
    const cur_element = <string>unique(target, { excludeRegex: RegExp('highlight|hoverstyle') });
    addElementToStore(cur_element);
    addPopper(cur_element,)
}

function addElementToStore(cur_element: string) {
    const key = window.location.href;
    chrome.storage.local.get(function (records) {
        //console.log(records);
        let element_list: Records = {};
        if ('element_list' in records) {
            element_list = records['element_list'];
        }
        let elements_in_current_page: string[] = [];
        if (key in element_list) elements_in_current_page = element_list[key];
        //checking if the element already exists...if not adding it to the store
        if (!(elements_in_current_page.includes(cur_element))) {
            console.log("Added new element to store");
            elements_in_current_page.push(cur_element);
            element_list[key] = elements_in_current_page;
            //if marker is turned on while clicking the element
            //add the outline after storing
            if (cur_marker_status) {
                document.querySelector(cur_element)?.classList.add('highlight');
            }
        }
        //in case of existing element
        else {
            console.log("Element already exists in store");
        }
        //updating the list after adding new element
        chrome.storage.local.set({ element_list: element_list });
        console.log(element_list);
    }
    )
}

//returns all the marked elements in current page
function get_marked_elements(): Promise<string[]> {
    return new Promise<string[]>(function (response) {
        const key = window.location.href;
        chrome.storage.local.get(function (records) {
            let element_list: Records = {};
            if ('element_list' in records) {
                element_list = records['element_list'];
            }
            let elements_in_current_page: string[] = [];
            if (key in element_list)
                elements_in_current_page = element_list[key];
            return response(elements_in_current_page);
        })
    })
}

//adding the outline when maker status is ON
async function highlight_elements() {
    const elements_in_current_page = await get_marked_elements();
    elements_in_current_page.forEach(element => {
        const ele = <HTMLElement>document.querySelector(element);
        ele?.classList.add('highlight');
    });
}

//removing the outline when maker status is OFF
async function remove_highlight() {
    const elements_in_current_page = await get_marked_elements();
    elements_in_current_page.forEach(element => {
        const ele = <HTMLElement>document.querySelector(element);
        ele?.classList.remove('highlight');
    });
}
function addPopper(target: string) {
    const cur_target = <HTMLElement>document.querySelector(target)
    const target_btn = <HTMLElement>document.querySelector('#popper')
    if (cur_target && target_btn) {
        target_btn.innerHTML = cur_target?.tagName
        createPopper(cur_target, target_btn, {
            placement: bottom
        });
    }
}
function createButton() {
    const button_to_be_attached = document.createElement('button')
    button_to_be_attached.id = 'popper'
    document.body.appendChild(button_to_be_attached)
}
listenToMessages();
window.onload = function () {
    addStyleToHead();
    createButton();
}
//listenAndRespond();

//calling title change func after 5 seconds
/*setTimeout(()=>{
    console.log("calling function to change title of the page");
    changeTitle();
},5000)
*/

//calling changeBackground() after 3 seconds to change background color of 1st div element
/*setTimeout(() => {
    console.log("calling function to change the background color of  web page");
    changeBackground()
}, 3000)
*/

/*
//function to add <p> tags with the element being clicked after sending message
function handleMouseClick(e: MouseEvent) {
    let new_defn = document.createElement("DIV")
    let child = document.createElement("P")
    child.textContent = "You just clicked" + e.target
    new_defn.appendChild(child)
    document?.body?.prepend(new_defn)
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
*/
/*
   //The value for the selected key got overridden each time when a new element is clicked....MISTAKE
   //Instead use an array to push new elements
chrome.storage.local.set({key:cur_ele}, () => {
  console.log('Stored name: ' +key+" "+ cur_ele)
});
*/