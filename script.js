/*
git add . && git commit -m "initial commit" && git push
*/
const stopCondition = document.getElementById("stop-condition");
const printCommand = document.getElementById("print-command");
const funcCommand = document.getElementById("func-command");
const functionCommands = document.getElementById("commands-container");
const playButton = document.getElementsByClassName("play-button")[0];
const functionContainerElement = document.getElementsByClassName("function-container")[0];
const viewArea = document.getElementById("view-area");
const terminal = document.getElementById("footer");
let COMMANDS_INTERVAL = 2000;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    if(functionCommands.children.length === 0)
        {
            const img = document.createElement("img");
            img.classList.add('dropit');
            functionCommands.appendChild(img);
        }
}

function removeDropit()
{
    const dropit = functionCommands.getElementsByTagName("img")[0];
    if(dropit != null)
        functionCommands.removeChild(dropit);
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
};

function onMouseEnter(){
    addDropit();
}

function onMouseLeave(){
    removeDropit();
}

stopCondition.addEventListener("dragstart", onDragStart);
stopCondition.addEventListener("mouseenter", onMouseEnter);
stopCondition.addEventListener("mouseleave", onMouseLeave);


printCommand.addEventListener("dragstart",onDragStart);
printCommand.addEventListener("mouseenter", onMouseEnter);
printCommand.addEventListener("mouseleave", onMouseLeave);

funcCommand.addEventListener("dragstart",onDragStart);
funcCommand.addEventListener("mouseenter", onMouseEnter);
funcCommand.addEventListener("mouseleave", onMouseLeave);

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

async function setRecursionSignature(){
    return new Promise((resolve)=>{
        const functionSignature = this.getElementsByClassName("function-signature")[0];
        functionSignature.replaceChildren("func("+this.x+")");
        resolve();
    });
};

function disableDragability(){
    [].forEach.call(document.getElementsByClassName("draggable"), ele=>ele.setAttribute("draggable", false));
}

const onClick = async (event)=>{
    setParameterVal.call(functionContainerElement);
    disableDragability();
    await setRecursionSignature.call(functionContainerElement);
    await sleep(2000);
    await executeFunctionContainer.call(functionContainerElement);
};

playButton.addEventListener("click", onClick);