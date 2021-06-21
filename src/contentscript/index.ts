import { sendChromeMessage } from '../popup/utils/chrome.message'








if (window.top === window) {
    var workflow;
    async function fetch_workflows() {
        var message = { type: 'request' };
         workflow = await sendChromeMessage(message);
        var start_workflow = document.createElement('button');
        start_workflow.innerHTML = "click me to start the workflow";
        start_workflow.style.cssText="z-index:500;position:fixed";
        document.body.prepend(start_workflow);
        start_workflow.addEventListener('click',initiateWorkflow);
        // console.log(workflow);
    }
    function add_css_to_popper(){
        var popper_style=document.createElement('style');
        popper_style.innerHTML=`.popper_div {
            z-index: 6;
            position: fixed;
            top: 100px;
            left: 300px;
            will-change: transform;
            display: flex;
            align-items: center;
            font-family: Roboto;
            background: #a5bcff;
            min-height: 32px;
            min-width: calc(260px - 100px);
            max-width: calc(260px + 50px);
            padding: 5px 15px;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            word-wrap: break-word;
            cursor: default;
            -webkit-box-shadow: 0 2px 10px 0 rgb(0 0 0 / 10%);
            -moz-box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 10px 0 rgb(0 0 0 / 10%);
            transition: box-shadow 0.6s ease;
            hyphens: none;
        }

        .popper_div::after {
            content: "";
            display: block;
            position: absolute;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            pointer-events: none;
            border-width: 5px;
            right: 100%;
            border-right-color: #a5bcff;
        }`;
        document.head.appendChild(popper_style);
    }
    function add_popper(){
        var popper=document.createElement('div');
        popper.setAttribute('class','popper_div');
        popper.setAttribute('id','popper');
        //popper.style.cssText='z-index:500;position:fixed';
        document.body.append(popper);
    }
    window.onload = function () {
        fetch_workflows();
        add_popper();
        add_css_to_popper();
        var mutation_observer=new MutationObserver(function (records){
            var isValid=true;
            for (const mutation of records) {
                if(mutation.target.id==='popper'){
                    isValid=false;
                    break;
                }
                else{
                    // console.log(cur_step_index);
                    var message = { type: 'step', step: workflow.steps[cur_step_index] }
                    postMessageToAllFrames(message);
                }
            }
        })
        mutation_observer.observe(document.body,{
            childList:true,
            attributes:true,
            subtree:true,
        })
    }
    
    var cur_step_index = -1;
    var framePosition = {};
    var cur_target_element;
    function initiateWorkflow() {
        cur_step_index = 0;
        var message = { type: 'step', step: workflow.steps[cur_step_index] }
        postMessageToAllFrames(message);
    }
    function sendMessage(event) {
        var current_input = document.getElementById("main-frame-div1-inp1");
        var message = { type: 'msg', message: current_input.value };
        postMessageToAllFrames(message);
    }
    function postMessageToAllFrames(message) {
        window.postMessage(message, '*');
        var iframes = document.getElementsByTagName('iframe');
        for (const cur_iframe of iframes) {
            cur_iframe.contentWindow.postMessage(message, '*');
        }
    }
    window.addEventListener('message', function (event) {
        // console.log(event.data);
        if (event.data.type === 'step' && event.data.step.iframes.length === 0) {
            cur_target_element = document.querySelector(event.data.step.selector);
            // console.log(cur_target_element,event.data.step.selector);
            if(cur_target_element){
                // console.log("inside if");
                display_step(event.data);
            }
        }
        else if (event.data.type === 'msg') {
            display_msg(event.data)
        }
        else if (event.data.type === 'post_msg') {
            // console.log('starting step');
            var message = { type: 'msg', message: event.data.message }
            postMessageToAllFrames(message);
        }
        else if (event.data.type === 'move_forward') {
            // console.log('moving to next step');
            goToNextStep();
        }
        else if(event.data.type==='readdstep'){
            var message = { type: 'step', step: workflow.steps[cur_step_index] }
        postMessageToAllFrames(message);
            
        }
        else if (event.data.type === 'dimens') {
            var cur_step = workflow.steps[cur_step_index];
            if (cur_step.iframes.length !== 0) {
                var iframe = document.querySelector(cur_step.iframes[0]);
                framePosition = (iframe && iframe.getBoundingClientRect())
            }
            if (framePosition && framePosition.left > 0) {
                event.data.coordinates = {
                    width: event.data.coordinates.width,
                    height: event.data.coordinates.height,
                    left: event.data.coordinates.left + framePosition.left,
                    top: event.data.coordinates.top + framePosition.top,
                }
            }
            console.log(this.document.getElementById('popper')?.getBoundingClientRect());
            update_popper_position(workflow.steps[cur_step_index], event.data.coordinates, framePosition)
            framePosition = {};
        }
    });
    function handleParentScroll(target) {
        var cur_window = target.parentElement;
        if (cur_window)
            cur_window.addEventListener('scroll', fetch_position)
    }
    function fetch_position(event) {
       // console.log(event)
        if (event.target) {
            if (cur_step_index > -1) {
                var coordinates = cur_target_element.getBoundingClientRect();
                // console.log(coordinates.left + " " + coordinates.top);
                var message = { type: 'dimens', coordinates: coordinates };
                postMessageToAllFrames(message);
            }
        }
    }
    function display_step(data) {
        if (cur_step_index >= workflow.steps.length) {
            return;
        }
        var target = document.querySelector(data.step.selector);
        // console.log("In display",target);
        handleParentScroll(target)
        if (target) {

            target.addEventListener(data.step.type, goToNextStep);
            var coordinates = target.getBoundingClientRect();
            // console.log(coordinates);
            if (coordinates.left > 0) {
                update_popper_position(data.step, coordinates,framePosition)
            }
        }
    }
    function display_msg(data) {
        var target_div = document.getElementById("main-frame-messages");
        var element = document.createElement('div');
        element.innerHTML = event.data.message;
        if (event.data.message !== undefined) {
            target_div.appendChild(element);
        }
    }
    function update_popper_position(step, coordinates, framePosition) {
        var popper = document.getElementById('popper');
        // console.log(coordinates.top);
        popper.innerHTML = step.content;
        if (framePosition) {
            console.log(coordinates.left,coordinates.top);
            console.log(framePosition.left,framePosition.top);
            if (coordinates.top - framePosition.top <= 0) {
                // console.log('hiding');
                popper.style.visibility = "hidden";
            }
            else {
                popper.style.visibility = "visible";
            }
        }
        else {
            if (coordinates.top <= 0) {
                // console.log('hiding');
                popper.style.visibility = "hidden";
            }
            else {
                popper.style.visibility = "visible";
            }
        }
        
        //popper.style.top = coordinates.top + coordinates.height / 2 - popper.offsetHeight / 2 + 'px';
        popper.style.top=coordinates.top - (coordinates.height / 3) + 10 + 'px';
        popper.style.left = coordinates.left + coordinates.width + 10 + 'px'
        console.log(popper?.getBoundingClientRect());
    }


    function goToNextStep(event) {
        if (workflow.steps[cur_step_index].iframes.length === 0) {
            if (event.target.parentElement) {
                // console.log(event.target.parentElement)
                event.target.parentElement.removeEventListener('scroll', fetch_position);
            }
            event.target.removeEventListener(event.type, goToNextStep);
        }
        cur_step_index = cur_step_index + 1;
        if (cur_step_index >= workflow.steps.length) {
            alert('flow completed');
            document.getElementById('popper').style.display = "none";
            return;
        }
        var message = { type: 'step', step: workflow.steps[cur_step_index] };
        postMessageToAllFrames(message)
    }
}
else{
    window.onload=function(){
    var mutation_observer=new MutationObserver(function (records){
        var isValid=true;
        for (const mutation of records) {
                // console.log(cur_step_index);
                var message = { type: 'readdstep'}
                window.top.postMessage(message,'*');
        }
    })
    mutation_observer.observe(document.body,{
        childList:true,
        attributes:true,
        subtree:true,
    })
}
    var target_element;
    function sendMessage(event){
        var current_input=document.getElementById("iframe1-div1-inp1");
        var current_data=current_input.value;
        var message={type:'post_msg',message: current_data};
        window.top.postMessage(message,'*');
    }
    function goToNextStep(event){
        // console.log("Removing Listener");
        event.target.parentElement.removeEventListener('scroll',fetch_position);
        event.target.removeEventListener(event.type,goToNextStep)
        var message={type:'move_forward'}
        window.top.postMessage(message);           
    }
    function handleParentScroll(target){
        var cur_window=target.parentElement;
        // console.log(cur_window);
    cur_window.addEventListener('scroll',fetch_position)
}
function fetch_position(){
    if(target_element){
        var coordinates=target_element.getBoundingClientRect();
        // console.log(coordinates.top)
        var message={type:'dimens',coordinates:coordinates};
        window.top.postMessage(message);
    }
}
    function display_step(data) {
        var element = document.querySelector(data.step.selector);
          if (element) {
            //   console.log(element);
            handleParentScroll(element);
              element.addEventListener(data.step.type,goToNextStep)
            var coordinates = element.getBoundingClientRect();
            if (coordinates.left > 0) {
              var message = {type:'dimens', coordinates:coordinates};
              window.top.postMessage(message, '*')
            }
          }
    }
    function calculate_position(step_data){
        var element=document.querySelector(step_data.selector);
        var coordinates = element.getBoundingClientRect();
            if (coordinates.left > 0) {
              var message = {type:'dimens', coordinates:coordinates};
              window.top.postMessage(message, '*')
            }
    }
    function display_msg(data) {
        var target_div=document.getElementById("iframe1-messages");
        var element=document.createElement('div');
          element.innerHTML=data.message;
          target_div.appendChild(element)
    }
    window.addEventListener('message',function(event){
        if(event.data.type==='msg'){
            display_msg(event.data);
        }
        if(event.data.type==='step' && event.data.step.iframes[0] === '#brandBand_2 > div > div > div.windowViewMode-normal.oneContent.active.lafPageHost > iframe') {
            // console.log(event.data);
            target_element=  document.querySelector(event.data.step.selector);
          display_step(event.data);
        }
        if(event.data.type==='fetch_position_from_iframe' && event.data.step.iframes[0] === '#iframe1'){
            calculate_position(event.data.step);
        }
    });
}