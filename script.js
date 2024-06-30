const stopCondition = document.getElementById("stop-condition");
const printCommand = document.getElementById("print-command");
const funcCommand = document.getElementById("func-command");
const functionCommands = document.getElementById("commands-container");
const playButton = document.getElementById("play-button");
const functionContainerElement = document.getElementsByClassName("function-container")[0];
const viewArea = document.getElementById("view-area");
const terminal = document.getElementById("footer");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function executePrint(){
    const line = document.createElement("p");
    line.style.margin = "1rem";
    line.style.fontSize = "5rem";
    line.style.fontWeight = "700";
    line.innerText = this.x;
    terminal.appendChild(line);
    line.scrollIntoView();
};

function clearCommandHighlights(){
    const commands = this.getElementsByClassName("command");
    for(let i = 0 ; i < commands.length; i++)
    {
        commands[i].classList.remove("command-highlight");
    }
};

async function executeFunc(){
    return new Promise(async resolve=>{
        await sleep(2000);
        const newFunctionContainer = this.cloneNode(true);
        newFunctionContainer.x = this.x - 1;
        setRecursionSignature.call(newFunctionContainer);
        clearCommandHighlights.call(newFunctionContainer);
        viewArea.appendChild(newFunctionContainer);
        await sleep(2000);
        await executeFunctionContainer.call(newFunctionContainer);
        resolve();
    });
};

async function executeStopCondition(){
    if(this.x === 0)
        this.functionRunning = false;
};

const executionTable = {
    "print-command":executePrint,
    "func-command": executeFunc,
    "stop-condition": executeStopCondition,
};

const onDragStart = (event)=>{
    event.dataTransfer.setData("text",event.target.id);

    // set red background to function container
    if(functionCommands.children.length === 0)
        functionCommands.classList.add('dropit');
};

const onDragOver = (event)=>{
    event.preventDefault();
};

const onDragEnd = (event)=>{
    functionCommands.classList.remove('dropit');
}

const onDrop = (event)=>{
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    const origNode = document.getElementById(id);
    const newNode = origNode.cloneNode(true);
    newNode.removeAttribute("draggable");
    newNode.removeAttribute("id");
    newNode.removeEventListener("drop", onDrop);
    newNode.classList.remove("draggable");
    event.currentTarget.appendChild(newNode);
};

stopCondition.addEventListener("dragstart", onDragStart);
stopCondition.addEventListener("dragend", onDragEnd);

printCommand.addEventListener("dragstart",onDragStart);
printCommand.addEventListener("dragend",onDragEnd);
funcCommand.addEventListener("dragstart",onDragStart);
funcCommand.addEventListener("dragend",onDragEnd);

functionCommands.addEventListener("dragover", onDragOver);
functionCommands.addEventListener("drop", onDrop);

function getCommandType(command){
    for(let i = 0; i < command.classList.length; i++)
    {
        if(command.classList[i] in executionTable )
            return command.classList[i];
    }
};

async function executeFunctionContainer(){
    this.functionRunning = true;
    const x = this.x;
    const commandsContainer = this.getElementsByClassName("commands-container")[0];
    for(let i = 0; this.functionRunning === true && i < commandsContainer.children.length; i++)
    {
        const command = commandsContainer.children[i];

        const commandType = getCommandType(command);
        command.classList.add("command-highlight");
        await executionTable[commandType].call(this);
        await sleep(2000);
        command.classList.remove("command-highlight");
    }
}

async function setParameterVal(){
    return new Promise((resolve)=>{
        const functionSignature = this.getElementsByClassName("function-signature")[0];
        const inputElement = functionSignature.getElementsByTagName("input")[0];
        this.x = inputElement.value;
    });
};

async function setRecursionSignature(){
    return new Promise((resolve)=>{
        const functionSignature = this.getElementsByClassName("function-signature")[0];
        functionSignature.replaceChildren("func("+this.x+")");
        resolve();
    });
};

const onClick = async (event)=>{
    setParameterVal.call(functionContainerElement);
    await setRecursionSignature.call(functionContainerElement);
    await sleep(2000);
    await executeFunctionContainer.call(functionContainerElement);
};

playButton.addEventListener("click", onClick);