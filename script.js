/*
git add . && git commit -m "initial commit" && git push
*/
const stopCondition = document.getElementById("stop-condition");
const printCommand = document.getElementById("print-command");
const funcCommand = document.getElementById("func-command");
const playButton = document.getElementsByClassName("play-button")[0];
const resumeButton = document.getElementsByClassName("resume-button")[0];
const pauseButton = document.getElementsByClassName("pause-button")[0];
const stopButton = document.getElementsByClassName("stop-button")[0];
let functionContainer = null;
let commandsContainer = null; 
const viewArea = document.getElementById("view-area");
const terminal = document.getElementById("footer");
const storage = document.getElementById("storage");
let CURR_RESOLVE;
let COMMANDS_INTERVAL = 2000;

function insertFunctionContainerToDOM(){
    const sfc = storage.getElementsByClassName("storage-function-container")[0];
    functionContainer = sfc.cloneNode(true);
    functionContainer.classList.remove("storage-function-container");
    functionContainer.classList.add("function-container");
    commandsContainer = functionContainer.getElementsByClassName("commands-container")[0];
    commandsContainer.addEventListener("dragover", onDragOver);
    commandsContainer.addEventListener("drop", onDrop);

    viewArea.replaceChildren(functionContainer);
}


function sleep() {
    return new Promise(resolve => {
        const interval = COMMANDS_INTERVAL;
        CURR_RESOLVE = resolve;
        const checkIfIntervalChanged = ()=>{
            // check if nothing changed during the sleep!
            if(interval ==  COMMANDS_INTERVAL)
                resolve();
            else
                // if the interval has changed during the timeout than sleep again
                CURR_TIMEOUT = setTimeout(resolve,COMMANDS_INTERVAL);
        }
        CURR_TIMEOUT = setTimeout(checkIfIntervalChanged, interval);
    });
}

async function executePrint(){
    const line = document.createElement("p");
    line.style.fontWeight = "700";
    line.innerText = this.x;
    line.style.scrollMargin = "50px";
    line.style.width = "20px";
    line.style.fontSize = "20px";
    line.classList.add("terminal-text-appearance");
    terminal.appendChild(line);
    line.scrollIntoView({block:"end"});
};

function clearCommandHighlights(){
    const commands = this.getElementsByClassName("command");
    for(let i = 0 ; i < commands.length; i++)
    {
        commands[i].classList.remove("command-highlight");
    }
};

function setFunctionHighlight(){
    const functionSignature = this.getElementsByClassName("function-signature")[0];
    functionSignature.classList.add("function-container-highlight");
}

async function executeFunc(){
    return new Promise(async resolve=>{
        //await sleep(2000);
        const newFunctionContainer = this.cloneNode(true);
        newFunctionContainer.x = this.x - 1;
        setRecursionSignature.call(newFunctionContainer);
        clearCommandHighlights.call(newFunctionContainer);
        setFunctionHighlight.call(newFunctionContainer);
        viewArea.appendChild(newFunctionContainer);
        await sleep(2000);
        await executeFunctionContainer.call(newFunctionContainer);
        resolve();
    });
};

async function greyFunctionContainer(time=2000){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            console.log("NEED TO ITERATE OVER ALL HIERARCHY AND changing attributes ");
            this.getElementsByClassName("function-signature")[0].classList.add("function-disabled");
            this.getElementsByClassName("commands-container")[0].classList.add("function-disabled");
            [].forEach.call(this.getElementsByClassName("command"),ele=>
                {
                    ele.classList.add("function-disabled");
                    ele.classList.remove("command-highlight");
                });
            resolve();
        },time);
    });
}

async function executeStopCondition(){
    if(this.x === 0)
        this.functionRunning = false;
};

const executionTable = {
    "print-command":executePrint,
    "func-command": executeFunc,
    "stop-condition": executeStopCondition,
};

function addDropit()
{
    if(commandsContainer.children.length === 0)
        {
            const img = document.createElement("img");
            img.classList.add('dropit');
            commandsContainer.appendChild(img);
        }
}

function removeDropit()
{
    const dropit = commandsContainer.getElementsByTagName("img")[0];
    if(dropit != null)
        commandsContainer.removeChild(dropit);
}

const onDragStart = (event)=>{
    event.dataTransfer.setData("text",event.target.id);

    // set red background to function container
    //addDropit();
};

const onDragOver = (event)=>{
    event.preventDefault();
};



const onDrop = (event)=>{
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const origNode = document.getElementById(id);
    const newNode = origNode.cloneNode(true);
    newNode.setAttribute("draggable", false);
    newNode.removeAttribute("id");
    newNode.removeEventListener("drop", onDrop);
    newNode.classList.remove("draggable");
    event.currentTarget.appendChild(newNode);

    playButton.classList.remove("button-disabled");
    playButton.removeAttribute("disabled");
};

function onMouseEnter(){
    addDropit();
}

function onMouseLeave(){
    removeDropit();
}
insertFunctionContainerToDOM();

stopCondition.addEventListener("dragstart", onDragStart);
stopCondition.addEventListener("mouseenter", onMouseEnter);
stopCondition.addEventListener("mouseleave", onMouseLeave);


printCommand.addEventListener("dragstart",onDragStart);
printCommand.addEventListener("mouseenter", onMouseEnter);
printCommand.addEventListener("mouseleave", onMouseLeave);

funcCommand.addEventListener("dragstart",onDragStart);
funcCommand.addEventListener("mouseenter", onMouseEnter);
funcCommand.addEventListener("mouseleave", onMouseLeave);



function getCommandType(command){
    for(let i = 0; i < command.classList.length; i++)
    {
        if(command.classList[i] in executionTable )
            return command.classList[i];
    }
};

function addObserverForFunctionContainerRemoval(){
    const mutationObserver = new MutationObserver((mutations)=>{
        mutations.forEach(mutation => {
            if(Array.from(mutation.removedNodes).includes(this))
                this.functionRunning = false;
        });
    });
    mutationObserver.observe(this.parentElement,{childList:true});
}

async function executeFunctionContainer(){

    addObserverForFunctionContainerRemoval.call(this);

    this.functionRunning = true;
    const x = this.x;
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    for(let i = 0; this.functionRunning === true && i < commandsContainer.children.length; i++)
    {
        const command = commandsContainer.children[i];

        const commandType = getCommandType(command);
        command.classList.add("command-highlight");
        await executionTable[commandType].call(this);
        await sleep(COMMANDS_INTERVAL);
        command.classList.remove("command-highlight");
    }
    await greyFunctionContainer.call(this,0);
}

async function setParameterVal(){
    return new Promise((resolve)=>{
        const functionSignature = this.getElementsByClassName("function-signature")[0];
        const inputElement = functionSignature.getElementsByTagName("input")[0];
        this.x = inputElement.value;
    });
};

function setRecursionSignature(){
    const functionSignature = this.getElementsByClassName("function-signature")[0];
    functionSignature.replaceChildren("func("+this.x+")");
};

function disableDragability(){
    [].forEach.call(document.getElementsByClassName("draggable"), ele=>ele.setAttribute("draggable", false));
}
function enableDragability(){
    [].forEach.call(document.getElementsByClassName("draggable"), ele=>ele.setAttribute("draggable", true));
}

function activateStopButton(){
    stopButton.classList.remove("button-disabled");
}

function changePlayToPause(){
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    pauseButton.classList.remove("button-disabled");
}

function changeResumeToPause(){
    resumeButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
}

function changePauseToResume(){
    playButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
    resumeButton.classList.remove("hidden");
}

const onPlayClick = async (event)=>{
    changePlayToPause();
    stopButton.removeAttribute("disabled");
    setParameterVal.call(functionContainer);
    disableDragability();
    activateStopButton();
    setRecursionSignature.call(functionContainer);
    await sleep(2000);
    await executeFunctionContainer.call(functionContainer);
};

const onResumeClick = (event)=>{
    CURR_RESOLVE();
    COMMANDS_INTERVAL = 2000;
    changeResumeToPause();
};

const activatePlayButton = ()=>{
    resumeButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
    playButton.classList.remove("hidden"); 
};

const onStopClick = ()=>{
    // 
    insertFunctionContainerToDOM();
    enableDragability();

    activatePlayButton();
    stopButton.classList.add("button-disabled");
    stopButton.setAttribute("disabled",true);
}

const onPauseClick = ()=>{
    console.log(COMMANDS_INTERVAL);
    COMMANDS_INTERVAL = 2000000000;
    console.log(COMMANDS_INTERVAL);

    changePauseToResume();
}
playButton.addEventListener("click", onPlayClick);
resumeButton.addEventListener("click", onResumeClick);
pauseButton.addEventListener("click", onPauseClick);
stopButton.addEventListener("click", onStopClick);

