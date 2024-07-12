/*
git add . && git commit -m "initial commit" && git push
*/
const printCommandFreeText = document.getElementById("print-command-free-text");
const commandFreeText = document.getElementById("command-free-text");
const ifCommandFreeText = document.getElementById("if-command-free-text");
const funcCommand = document.getElementById("func-command");
const returnStatementFreeText = document.getElementById("return-statement-free-text");

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

function getOperandNumericValue(str){
    if(str in this)
        return Number(this[str]);
    return Number(str);
}

async function expressionParser(str){
    while(str.includes("func")){
        const funcIndex = str.indexOf("func");
        const openBracketsIndex = str.indexOf("(");
        const closeBracketsIndex = str.indexOf(")");
        
        const funcParamExpression = str.slice(openBracketsIndex+1,closeBracketsIndex);
        const funcParamExpressionEvaluation = await expressionParser.call(this,funcParamExpression);
        //every thing is ready of the next iteration
        // i can literaly oopen another container with all the commands
        // and i can fixate its signature
        const funcEvaluation = await executeFunc.call(this,funcParamExpressionEvaluation);

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

    while(evaluation.includes("*")){
        const index = evaluation.indexOf("*");
        const leftOperand = getOperandNumericValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandNumericValue.call(this,evaluation[index+1]);
        const res = leftOperand * rightOperand;
        evaluation.splice(index-1,3,res);
    }
    while(evaluation.includes("/")){
        const index = evaluation.indexOf("/");
        const leftOperand = getOperandNumericValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandNumericValue.call(this,evaluation[index+1]);
        const res = ~~( leftOperand / rightOperand);
        evaluation.splice(index-1,3,res);
    }
    
    while(evaluation.includes("-")){
        const index = evaluation.indexOf("-");
        const leftOperand = getOperandNumericValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandNumericValue.call(this,evaluation[index+1]);
        const res = leftOperand - rightOperand;
        evaluation.splice(index-1,3,res);
    }
    while(evaluation.includes("+")){
        const index = evaluation.indexOf("+");
        const leftOperand = getOperandNumericValue.call(this,evaluation[index-1]);
        const rightOperand = getOperandNumericValue.call(this,evaluation[index+1]);
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

async function getValueFromPrintFreeText(command){
    const txt = command.getElementsByTagName("button")[0].innerText;
    const openBracketsIndex = txt.indexOf("(");
    const closeBracketsIndex = txt.indexOf(")");
    const parameterExpression = txt.slice(openBracketsIndex+1,closeBracketsIndex);
    const val = await expressionParser.call(this,parameterExpression);
    return val;
}
async function executePrintFreeText(command){
    const line = document.createElement("p");
    line.style.fontWeight = "700";
    line.innerText = await getValueFromPrintFreeText.call(this,command);
    line.style.scrollMargin = "50px";
    line.style.width = "20px";
    line.style.fontSize = "20px";
    line.classList.add("terminal-text-appearance");
    terminal.appendChild(line);
    line.scrollIntoView({block:"end"});
};

async function executeFreeText(command){
    let inputText = command.getElementsByTagName("button")[0].innerText;
    inputText = inputText.split(" ").join("");
    if(inputText.includes("=")){
        const parts = inputText.split("=");
        const lhs = parts[0];
        const rhs = parts[1];
        
        const rhsEvaluation = await expressionParser.call(this,rhs);
        this[lhs] = Number(rhsEvaluation);
    }
    else{
        await expressionParser.call(this,inputText);
    }
};
function splitConditionByDelimiter(condition,delim){

}
function splitCondition(condition){
    const delimiters = ["==","!=",">=","<=",">","<"];
    let parts = [];
    let i = -1;
    do{
        i++;
        parts = condition.split(delimiters[i]);
    }while(parts.length<2);
    parts.splice(1,0,delimiters[i]);
    return parts;
}
function isConditionTrue(ifStatement){
    const leftBracketsIndex = ifStatement.indexOf("(");
    const rightBracketsIndex = ifStatement.indexOf(")");
    const condition = ifStatement.slice(leftBracketsIndex+1,rightBracketsIndex);
    const parts = splitCondition(condition);

    const left = parts[0];
    const right = parts[2];
    const leftVal = getOperandNumericValue.call(this,left);
    const rightVal = getOperandNumericValue.call(this,right);
    const operator = parts[1];
    switch(operator){
        case "==":
            return leftVal == rightVal;
        case "!=":
            return leftVal != rightVal;
        case ">":
            return leftVal > rightVal;
        case ">=":
            return leftVal >= rightVal;
        case "<":
            return leftVal < rightVal;
        case "<=":
            return leftVal <= rightVal;
    }
}
function getReturnStatementValue(returnStatement){
    const returnWordIndex = returnStatement.indexOf("return");
    return returnStatement.slice(returnWordIndex+6);
}
async function executeStopConditionFreeText(command){
    const ifStatementText = command.getElementsByClassName("if-statement")[0].innerText;
    const returnStatementText = command.getElementsByClassName("return-statement")[0].innerText;

    const conditionVal = isConditionTrue.call(this,ifStatementText);
    if(conditionVal){
        let returnStatementValue = getReturnStatementValue(returnStatementText);
        returnStatementValue = returnStatementValue.split(" ").join("");
        const returnVal = await expressionParser.call(this,returnStatementValue);
        this.returnValue = returnVal;
        this.functionRunning = false;
    }
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

async function executeFunc(x){
    return new Promise(async resolve=>{
        const newFunctionContainer = this.cloneNode(true);
        newFunctionContainer.x = x;//X SHOULD BE THE PARAMETER OF THE FUNCTION
        setRecursionSignature.call(newFunctionContainer);
        clearCommandHighlights.call(newFunctionContainer);
        setFunctionHighlight.call(newFunctionContainer);
        viewArea.appendChild(newFunctionContainer);
        await sleep(2000);
        dimAllFunctionContainers();
        undimThisContainer.call(newFunctionContainer);
        const returnedValue = await executeFunctionContainer.call(newFunctionContainer);
        dimAllFunctionContainers();
        undimThisContainer.call(this);
        resolve(returnedValue);
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
                    ele.getElementsByClassName("drag-image")[0]?.classList.add("function-disabled");
                });
            resolve();
        },time);
    });
}

async function executeReturnStatementFreeText(command){
    this.functionRunning = false;
    
    let text = getReturnStatementValue(command.innerText);
    text = text.split(" ").join("");
    const value = await expressionParser.call(this,text);
    this.returnValue = value;
}

const executionTable = {
    "print-command-free-text":executePrintFreeText,
    "command-free-text":executeFreeText,
    "if-command-free-text":executeStopConditionFreeText,
    "return-statement-free-text": executeReturnStatementFreeText,
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

function dimAllFunctionContainers(){
    const functionContainers = viewArea.getElementsByClassName("function-container");
    [].forEach.call(functionContainers,(functionContainer)=>{
        functionContainer.classList.add("dimmed");
    });
}

function undimThisContainer(){
    this.classList.remove("dimmed");
}

async function executeFunctionContainer(){

    addObserverForFunctionContainerRemoval.call(this);
    dimAllFunctionContainers();
    undimThisContainer.call(this);

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
function fixateFreeTextCommands(){
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    const commands = commandsContainer.getElementsByClassName("command-free-text");
    [].forEach.call(commands,(element)=>{
        const currButton = element.getElementsByTagName("button")[0];
        const currInputText = element.getElementsByTagName("input")[0];
        currButton.replaceChildren(currInputText.value);
    });
}
function getIfStatementString(statement){
    const leftOperand = statement.getElementsByClassName("left")[0].value;
    const operator = statement.getElementsByClassName("operator")[0];
    const operatorVal = operator.selectedOptions[0].label;
    const rightOperand = statement.getElementsByClassName("right")[0].value;
    return leftOperand+operatorVal+rightOperand;
}
function getReturnStatementString(statement){
    const returnExpressionValue = statement.getElementsByClassName("return-expression")[0].value;
    return returnExpressionValue;
}
function fixateStopConditionFreeTextCommands(){
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    const commands = commandsContainer.getElementsByClassName("if-command-free-text");
    [].forEach.call(commands,(element)=>{
        const ifStatementElement = element.getElementsByClassName("if-statement")[0];
        const ifStatementString = getIfStatementString(ifStatementElement);
        ifStatementElement.replaceChildren("if("+ifStatementString+")");

        const returnStatementElement = element.getElementsByClassName("return-statement")[0];
        const returnStatementString = getReturnStatementString(returnStatementElement);
        returnStatementElement.replaceChildren("return "+returnStatementString);
    });
}
function fixateReturnFreeTextCommands(){
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    const commands = commandsContainer.getElementsByClassName("return-statement-free-text");
    [].forEach.call(commands,(command)=>{
        const inputText = command.getElementsByTagName("input")[0].value;
        command.innerText = "return "+inputText;
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
    fixateFreeTextCommands.call(currFunctionContainer);
    fixateStopConditionFreeTextCommands.call(currFunctionContainer);
    fixateReturnFreeTextCommands.call(currFunctionContainer);
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

printCommandFreeText.addEventListener("dragstart",onDragStart);
printCommandFreeText.addEventListener("mouseenter", onMouseEnter);
printCommandFreeText.addEventListener("mouseleave", onMouseLeave);

commandFreeText.addEventListener("dragstart",onDragStart);
commandFreeText.addEventListener("mouseenter", onMouseEnter);
commandFreeText.addEventListener("mouseleave", onMouseLeave);

ifCommandFreeText.addEventListener("dragstart",onDragStart);
ifCommandFreeText.addEventListener("mouseenter", onMouseEnter);
ifCommandFreeText.addEventListener("mouseleave", onMouseLeave);

returnStatementFreeText.addEventListener("dragstart",onDragStart);
returnStatementFreeText.addEventListener("mouseenter", onMouseEnter);
returnStatementFreeText.addEventListener("mouseleave", onMouseLeave);

playButton.addEventListener("click", onPlayClick);
resumeButton.addEventListener("click", onResumeClick);
pauseButton.addEventListener("click", onPauseClick);
replayButton.addEventListener("click", onReplayClick);
stopButton.addEventListener("click", onStopClick);


