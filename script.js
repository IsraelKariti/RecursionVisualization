/*
git add . && git commit -m "initial commit" && git push
*/
const stopCondition = document.getElementById("stop-condition");
const stopCondition1 = document.getElementById("stop-condition-1");
const printCommand = document.getElementById("print-command");
const printYCommand = document.getElementById("print-y-command");
const printCommandFreeText = document.getElementById("print-command-free-text");
const funcCommand = document.getElementById("func-command");
const returnFuncCommand = document.getElementById("return-func-command");
const returnXY = document.getElementById("return-x-y");

const playButton = document.getElementsByClassName("play-button")[0];
const resumeButton = document.getElementsByClassName("resume-button")[0];
const pauseButton = document.getElementsByClassName("pause-button")[0];
const replayButton = document.getElementsByClassName("replay-button")[0];
const stopButton = document.getElementsByClassName("stop-button")[0];
let functionContainer = null;
let commandsContainer = null; 
const viewArea = document.getElementById("view-area");
const terminal = document.getElementById("footer");
const storage = document.getElementById("storage");
let CURR_RESOLVE;
let COMMANDS_INTERVAL = 2000;

function expressionParser(str){
    while(str.includes("func")){
        const funcIndex = str.indexOf("func");
        const openBracketsIndex = str.indexOf("(");
        const closeBracketsIndex = str.indexOf(")");
        
        const funcParamExpression = str.slice(openBracketsIndex+1,closeBracketsIndex);
        const funcParamExpressionEvaluation = expressionParser(funcParamExpression);
        const funcEvaluation = func(funcParamExpressionEvaluation);

        str = str.slice(0,funcIndex) + funcEvaluation + str.slice(closeBracketsIndex+1);
    }
    
    const evaluation = [];
    let word = "";
    for(const c of str){
        if("*/+-".includes(c))
        {
            evaluation.push(word);
            word = "";
            evaluation.push(c);
        }
        else{
            word += c;
        }
    }
    evaluation.push(word);

    const getOperandValue = (str)=>{
        if(str in this)
            return this[str];
        return Number(str);
    }

    while(evaluation.includes("*")){
        const index = evaluation.indexOf("*");
        const leftOperand = getOperandValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandValue.call(this,evaluation[index+1]);
        const res = leftOperand * rightOperand;
        evaluation.splice(index-1,3,res);
    }
    while(evaluation.includes("/")){
        const index = evaluation.indexOf("/");
        const leftOperand = getOperandValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandValue.call(this,evaluation[index+1]);
        const res = ~~( leftOperand / rightOperand);
        evaluation.splice(index-1,3,res);
    }
    
    while(evaluation.includes("-")){
        const index = evaluation.indexOf("-");
        const leftOperand = getOperandValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandValue.call(this,evaluation[index+1]);
        const res = leftOperand - rightOperand;
        evaluation.splice(index-1,3,res);
    }
    while(evaluation.includes("+")){
        const index = evaluation.indexOf("+");
        const leftOperand = getOperandValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandValue.call(this,evaluation[index+1]);
        const res = leftOperand + rightOperand;
        evaluation.splice(index-1,3,res);
    }
    if(evaluation[0] in this)
        return this[evaluation[0]];
    return evaluation[0];
}

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
async function executePrintY(){
    const line = document.createElement("p");
    line.style.fontWeight = "700";
    line.innerText = this.y;
    line.style.scrollMargin = "50px";
    line.style.width = "20px";
    line.style.fontSize = "20px";
    line.classList.add("terminal-text-appearance");
    terminal.appendChild(line);
    line.scrollIntoView({block:"end"});
};
function getValueFromPrintFreeText(command){
    const txt = command.getElementsByTagName("button")[0].innerText;
    const openBracketsIndex = txt.indexOf("(");
    const closeBracketsIndex = txt.indexOf(")");
    const parameterExpression = txt.slice(openBracketsIndex+1,closeBracketsIndex);
    const val = expressionParser.call(this,parameterExpression);
    return val;
}
async function executePrintFreeText(command){
    const line = document.createElement("p");
    line.style.fontWeight = "700";
    line.innerText = getValueFromPrintFreeText.call(this,command);
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
        commands[i].classList.remove("command-execution");

    }
};

function setFunctionHighlight(){
    const functionSignature = this.getElementsByClassName("function-signature")[0];
    functionSignature.classList.add("function-container-highlight");
}

async function executeFunc(){
    return new Promise(async resolve=>{
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

async function executeReturnFunc(){
    return new Promise(async resolve=>{
        const newFunctionContainer = this.cloneNode(true);
        newFunctionContainer.x = this.x - 1;
        setRecursionSignature.call(newFunctionContainer);
        clearCommandHighlights.call(newFunctionContainer);
        setFunctionHighlight.call(newFunctionContainer);
        viewArea.appendChild(newFunctionContainer);
        await sleep(2000);
        const returnValue = await executeFunctionContainer.call(newFunctionContainer);
        this.y = returnValue;
        resolve();
    });
};

async function greyFunctionContainer(time=2000){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            this.getElementsByClassName("function-signature")[0].classList.add("function-disabled");
            this.getElementsByClassName("commands-container")[0].classList.add("function-disabled");
            [].forEach.call(this.getElementsByClassName("command"),ele=>
                {
                    ele.classList.add("function-disabled");
                    ele.classList.remove("command-highlight");
                    ele.getElementsByClassName("drag-image")[0].classList.add("function-disabled");
                });
            resolve();
        },time);
    });
}

async function executeStopCondition(){
    if(this.x === 0)
        this.functionRunning = false;
};
async function executeStopCondition1(){
    if(this.x === 0){
        this.functionRunning = false;
        this.returnValue = 1;
    }
};

async function executeReturnXY(){
    this.functionRunning = false;
    this.returnValue = this.x * this.y;
}

const executionTable = {
    "print-command":executePrint,
    "print-y-command":executePrintY,
    "print-command-free-text":executePrintFreeText,
    "func-command": executeFunc,
    "return-func-command": executeReturnFunc,
    "return-x-y": executeReturnXY,
    "stop-condition": executeStopCondition,
    "stop-condition-1": executeStopCondition1,
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
    const dragImage = event.target.getElementsByClassName("drag-image")[0];
    event.dataTransfer.setDragImage(dragImage,20,10);
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
        command.classList.add("command-execution");

        await executionTable[commandType].call(this,command);
        await sleep(COMMANDS_INTERVAL);
        command.classList.remove("command-highlight");
    }
    await greyFunctionContainer.call(this,0);
    return this.returnValue;
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
function fixatePrintCommandsIput(){
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    const commands = commandsContainer.getElementsByClassName("print-command-free-text");
    [].forEach.call(commands,(element)=>{
        const currButton = element.getElementsByTagName("button")[0];
        const currInputText = element.getElementsByTagName("input")[0];
        currButton.replaceChildren("print("+currInputText.value+")");
    });
}
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
function changeReplayToPause(){
    replayButton.classList.add("hidden");
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
function changeToReplay(){
    playButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
    resumeButton.classList.add("hidden");
    replayButton.classList.remove("hidden");
    replayButton.classList.remove("button-disabled");
    stopButton.classList.remove("hidden");
    stopButton.classList.remove("button-disabled");
}
function backupFunctionPrototype(){
    const fpb = storage.getElementsByClassName("function-prototype-backup")[0];
    const backup = this.cloneNode(true);
    backup.x = this.x;
    fpb.appendChild(backup);
}

const deactivatePlayButton = ()=>{
    resumeButton.classList.add("hidden");
    pauseButton.classList.add("hidden");
    playButton.classList.remove("hidden");
    replayButton.classList.add("hidden");
    playButton.classList.add("button-disabled");
    playButton.setAttribute("disabled",true); 
};


function clearTerminal(){
    terminal.replaceChildren();
}
function changePlayToPause(){
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    pauseButton.classList.remove("button-disabled");
}

function cloneFunctionFromStorageToViewArea(){
    const functionPrototype = storage.getElementsByClassName("function-container")[0];
    const functionPrototypeDuplicate = functionPrototype.cloneNode(true);
    functionPrototypeDuplicate.x = functionPrototype.x;
    viewArea.replaceChildren(functionPrototypeDuplicate);
    functionContainer = functionPrototypeDuplicate;
}

const onPlayClick = async (event)=>{
    const currFunctionContainer = functionContainer;
    changePlayToPause();
    stopButton.removeAttribute("disabled");
    setParameterVal.call(currFunctionContainer);
    disableDragability();
    activateStopButton();
    setRecursionSignature.call(currFunctionContainer);
    fixatePrintCommandsIput.call(currFunctionContainer);
    backupFunctionPrototype.call(currFunctionContainer);
    await sleep(2000);
    await executeFunctionContainer.call(currFunctionContainer);
    changeToReplay();
};

async function onReplayClick(){
    terminal.replaceChildren();

    changeReplayToPause();

    cloneFunctionFromStorageToViewArea();

    await executeFunctionContainer.call(functionContainer);
    changeToReplay();
};

const onResumeClick = (event)=>{
    CURR_RESOLVE();
    COMMANDS_INTERVAL = 2000;
    changeResumeToPause();
};

const onPauseClick = ()=>{
    console.log(COMMANDS_INTERVAL);
    COMMANDS_INTERVAL = 2000000000;
    console.log(COMMANDS_INTERVAL);

    changePauseToResume();
};

const onStopClick = ()=>{
    insertFunctionContainerToDOM();
    enableDragability();

    deactivatePlayButton();

    clearTerminal();
    stopButton.classList.add("button-disabled");
    stopButton.setAttribute("disabled",true);
};

function insertBubbleToFunctionSignature()
{
    const storage = document.getElementById("storage");
    const bubble = storage.getElementsByClassName("bubble")[0];
    const newBubble = bubble.cloneNode(true);
    const buttonOK = newBubble.getElementsByClassName("bubble-button")[0];
    buttonOK.addEventListener("click", (event)=>{
        event.target.parentNode.parentNode.parentNode.remove();
    });
    functionContainer.getElementsByClassName("function-signature")[0].appendChild(newBubble);
}

function insertFirstFunctionContainerToDOM()
{
    insertFunctionContainerToDOM();
    insertBubbleToFunctionSignature();
}

insertFirstFunctionContainerToDOM();

stopCondition.addEventListener("dragstart", onDragStart);
stopCondition.addEventListener("mouseenter", onMouseEnter);
stopCondition.addEventListener("mouseleave", onMouseLeave);

stopCondition1.addEventListener("dragstart", onDragStart);
stopCondition1.addEventListener("mouseenter", onMouseEnter);
stopCondition1.addEventListener("mouseleave", onMouseLeave);

printCommand.addEventListener("dragstart",onDragStart);
printCommand.addEventListener("mouseenter", onMouseEnter);
printCommand.addEventListener("mouseleave", onMouseLeave);

printYCommand.addEventListener("dragstart",onDragStart);
printYCommand.addEventListener("mouseenter", onMouseEnter);
printYCommand.addEventListener("mouseleave", onMouseLeave);

printCommandFreeText.addEventListener("dragstart",onDragStart);
printCommandFreeText.addEventListener("mouseenter", onMouseEnter);
printCommandFreeText.addEventListener("mouseleave", onMouseLeave);

funcCommand.addEventListener("dragstart",onDragStart);
funcCommand.addEventListener("mouseenter", onMouseEnter);
funcCommand.addEventListener("mouseleave", onMouseLeave);

returnFuncCommand.addEventListener("dragstart",onDragStart);
returnFuncCommand.addEventListener("mouseenter", onMouseEnter);
returnFuncCommand.addEventListener("mouseleave", onMouseLeave);

returnXY.addEventListener("dragstart",onDragStart);
returnXY.addEventListener("mouseenter", onMouseEnter);
returnXY.addEventListener("mouseleave", onMouseLeave);

playButton.addEventListener("click", onPlayClick);
resumeButton.addEventListener("click", onResumeClick);
pauseButton.addEventListener("click", onPauseClick);
replayButton.addEventListener("click", onReplayClick);
stopButton.addEventListener("click", onStopClick);


