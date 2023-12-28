(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    // (IIFE) that wraps the entire code in a module definition
    
    const P = require('bluebird');
    
    // Importing the bluebird  and assigning it to the  'P'
    
    let lineList = [];
    
    // Declaring an empty array lineList to store lines of text
    
    // Element references
    let stylesElement;
    let resumeElement;
    let trueStyleElement = document.getElementById("true-style");
    
    // Declaring variables to store references to HTML elements with specific IDs
    
    // Writing Delays in ms
    const isDev = window.location.hostname === '127.0.0.1';
    const normal = (isDev) ? 0 : 20;
    const fast = (isDev) ? 0 : 5;
    const ultra = 0;
    const speechPause = 500;
    let ignorePause = false;
    
    // Setting delay values based on whether the code is running in a development environment
    
    // Storages
    let styledLineStorage = ""; // insert into body
    let outputBuffer = ""; // insert to style tag
    
    // Declaring variables to store styled text and output buffer
    
    // REGEX Matches
    const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
    const selectNumber = /\d+/g;
    const selectCssProperty = / {4}[a-zA-Z-]+:/g;
    const selectCssValue = / .+;/g;
    const selectCssSelector = /[* @#:\(\).a-zA-Z0-9-]+  /g
    const selectMedia = /@media/g;
    
    // Defining regular expressions for pattern matching
    
    // State
    let state;
    
    // Declaring a variable 'state' without assigning a value
    
    document.onreadystatechange = () => {
        // Need to wait for iframes to load
        if (document.readyState === 'complete') {
          ReadFile("initial");
          GetElements();
          AddEventListeners();
          InitializeState();
          StartAnimation();
        }
    };
    
    // Event handler for when the document state changes
    
    function AddEventListeners(){
        stylesElement.addEventListener('input', function() {
            trueStyleElement.textContent = stylesElement.textContent;
        });
    }
    
    //  updates the trueStyleElement content when the input changes
    
    function ReadFile(fileId){
        let oFrame = document.getElementById(fileId);
        let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
        while (strRawContents.indexOf("\r") >= 0)
            strRawContents = strRawContents.replace("\r", "");
        let arrLines = strRawContents.split("\n");
        
        lineList = lineList.concat(arrLines);
        console.log(lineList);
    }
    
    
    function GetElements(){
        stylesElement = document.getElementById("styles");
        resumeElement = document.getElementById("resume");
        trueStyleElement = document.getElementById("true-style");
    }
    
    
    function InitializeState(){
        state = {
            element: stylesElement,
            isStyled: true,
            delay: normal,
        }
    }
    
    // Function to initialize the 'state' object with initial values.

    async function StartAnimation(){
        while(lineList.length > 0){
            await WriteLine(lineList.shift());
        }
    }
    
    // Async function to start the animation by iterating over the 'lineList' and calling the 'WriteLine' function for each line.
    
    async function WriteLine(line){
        if(await CheckIfSpecialCommand(line)){
            return;
        }
    
        for(let char of line){
            if(state.isStyled){
                WriteStyledChar(char);
                if(!ignorePause && (char === '.' || char === '!' || char === '?')){
                    await P.delay(speechPause);
                }
                else{
                    await P.delay(state.delay);
                }
            }
            else{
                WriteSimpleChar(char);
                await P.delay(state.delay);
            }
        }    
        window.scrollTo(0, document.body.scrollHeight);

        state.element.scrollTop = state.element.scrollHeight;
    
        if(state.isStyled){
            outputBuffer += '\n';
            styledLineStorage += '\n';
        }
        state.element.innerHTML += "<br>";
    }
}]}