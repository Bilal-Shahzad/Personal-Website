(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

    // (IIFE) that wraps the entire code in a module definition
    
    const P = require('bluebird');
    
    // Importing the bluebird  and assigning it to   'P'
    
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
    async function CheckIfSpecialCommand(line){
        // checks if a line starts with ;
        if(line[0]==';'){
            // change the state
            let lineParts = line.split(" ");
            
            if(CheckIfDelayCommand(lineParts[1])){
                await HandleDelayCommand(parseInt(lineParts[2]));
            }
            else if(CheckIfTogglePause(lineParts[1])){
                HandleTogglePauseCommand();
            }
            else{
                // styling command
                HandleStylingCommand(lineParts);
            }
    
            return true;
        }
    
        return false;
    }
    
    function CheckIfTogglePause(command) {
        return command === "TOGGLE_PAUSE";
    }
    
    function CheckIfDelayCommand(command){
        return command === "DELAY";
    }
    
    function HandleTogglePauseCommand() {
        ignorePause = !ignorePause;
    }
    
    async function HandleDelayCommand(delayDuration) {
        await P.delay(parseInt(delayDuration));
    }
    
    function HandleStylingCommand(lineParts) {
        state.element = document.getElementById(lineParts[1]);
        state.isStyled = (lineParts[2] === "true" || lineParts[2] === "t");
    
        switch(parseInt(lineParts[3])){
            case 0:
                state.delay = ultra;
                break;
            case 1:
                state.delay = fast;
                break;
            case 2:
                state.delay = normal;
                break;
            default:
                state.delay = normal;
                break;
        }
    }
    
    function WriteSimpleChar(char){
        state.element.innerHTML += char;
    }
    window.scrollTo(0, document.body.scrollHeight);

    state.element.scrollTop = state.element.scrollHeight;

    if(state.isStyled){
        outputBuffer += '\n';
        styledLineStorage += '\n';
    }
    state.element.innerHTML += "<br>";
},

async function CheckIfSpecialCommand(line){
    // checks if a line starts with ;
    if(line[0]==';'){
        // change the state
        let lineParts = line.split(" ");
        
        if(CheckIfDelayCommand(lineParts[1])){
            await HandleDelayCommand(parseInt(lineParts[2]));
        }
        else if(CheckIfTogglePause(lineParts[1])){
            HandleTogglePauseCommand();
        }
        else{
            // styling command
            HandleStylingCommand(lineParts);
        }

        return true;
    }

    return false;
},

function CheckIfTogglePause(command) {
    return command === "TOGGLE_PAUSE";
},

function CheckIfDelayCommand(command){
    return command === "DELAY";
},

function HandleTogglePauseCommand() {
    ignorePause = !ignorePause;
},

async function HandleDelayCommand(delayDuration) {
    await P.delay(parseInt(delayDuration));
},

function HandleStylingCommand(lineParts) {
    state.element = document.getElementById(lineParts[1]);
    state.isStyled = (lineParts[2] === "true" || lineParts[2] === "t");

    switch(parseInt(lineParts[3])){
        case 0:
            state.delay = ultra;
            break;
        case 1:
            state.delay = fast;
            break;
        case 2:
            state.delay = normal;
            break;
        default:
            state.delay = normal;
            break;
    }
},

function WriteSimpleChar(char){
    state.element.innerHTML += char;
},

async function WriteStyledChar(char){

    // add char to storages
    styledLineStorage += char;
    outputBuffer += char;

    // update element in body
    styledLineStorage = outputBuffer;
    styledLineStorage = addStylingToStorage(styledLineStorage);
    
    // update what the user sees
    state.element.innerHTML = styledLineStorage;

    // when char is not alphanumeric, update the style tag
    // (Avoids flickers)
    if(!char.match(/[a-zA-Z0-9]/)){
        trueStyleElement.innerHTML = outputBuffer;
        state.element.innerHTML = styledLineStorage;
    }

},

function addStylingToStorage(lineStorage){

    lineStorage = lineStorage.replace(selectComment, (match) => {
        return `<span class="comment">${match}</span>`;
    });

    lineStorage = lineStorage.replace(selectNumber, (match) => {
        return `<span class="number">${match}</span>`;
    });

    // lineStorage = lineStorage.replace(selectCssValue, (match) => {
    //     return `<span class="value">${match}</span>`;
    // });

    lineStorage = lineStorage.replace(selectCssProperty, (match) => {
        return `<span class="property">${match}</span>`;
    });

    lineStorage = lineStorage.replace(selectCssSelector, (match) => {
        return `<span class="selector">${match}</span>`;
    });

    lineStorage = lineStorage.replace(selectMedia, (match) => {
        return `<span class="media">${match}</span>`;
    });

    return lineStorage;
},

function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Promise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof _dereq_=="function"&&_dereq_;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof _dereq_=="function"&&_dereq_;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise) {
var SomePromiseArray = Promise._SomePromiseArray;
function any(promises) {
    var ret = new SomePromiseArray(promises);
    var promise = ret.promise();
    ret.setHowMany(1);
    ret.setUnwrap();
    ret.init();
    return promise;
}

Promise.any = function (promises) {
    return any(promises);
};

Promise.prototype.any = function () {
    return any(this);
};

};

},{}],2:[function(_dereq_,module,exports){
"use strict";
var firstLineError;
try {throw new Error(); } catch (e) {firstLineError = e;}
var schedule = _dereq_("./schedule");
var Queue = _dereq_("./queue"); 

function Async() {
    this._customScheduler = false;
    this._isTickUsed = false;
    this._lateQueue = new Queue(16);
    this._normalQueue = new Queue(16);
    this._haveDrainedQueues = false;
    var self = this;
    this.drainQueues = function () {
        self._drainQueues();
    };
    this._schedule = schedule;
}

Async.prototype.setScheduler = function(fn) {
    var prev = this._schedule;
    this._schedule = fn;
    this._customScheduler = true;
    return prev;
};

Async.prototype.hasCustomScheduler = function() {
    return this._customScheduler;
};

Async.prototype.haveItemsQueued = function () {
    return this._isTickUsed || this._haveDrainedQueues;
};


Async.prototype.fatalError = function(e, isNode) {
    if (isNode) {
        process.stderr.write("Fatal " + (e instanceof Error ? e.stack : e) +
            "\n");
        process.exit(2);
    } else {
        this.throwLater(e);
    }
};

Async.prototype.throwLater = function(fn, arg) {
    if (arguments.length === 1) {
        arg = fn;
        fn = function () { throw arg; };
    }
    if (typeof setTimeout !== "undefined") {
        setTimeout(function() {
            fn(arg);
        }, 0);
    } else try {
        this._schedule(function() {
            fn(arg);
        });
    } catch (e) {
        throw new Error("No async scheduler available\u000a\u000a    See http://goo.gl/MqrFmX\u000a");
    }
};

function AsyncInvokeLater(fn, receiver, arg) {
    this._lateQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncInvoke(fn, receiver, arg) {
    this._normalQueue.push(fn, receiver, arg);
    this._queueTick();
}

function AsyncSettlePromises(promise) {
    this._normalQueue._pushOne(promise);
    this._queueTick();
}

Async.prototype.invokeLater = AsyncInvokeLater;
Async.prototype.invoke = AsyncInvoke;
Async.prototype.settlePromises = AsyncSettlePromises;


function _drainQueue(queue) {
    while (queue.length() > 0) {
        _drainQueueStep(queue);
    }
}
function _drainQueueStep(queue) {
    var fn = queue.shift();
    if (typeof fn !== "function") {
        fn._settlePromises();
    } else {
        var receiver = queue.shift();
        var arg = queue.shift();
        fn.call(receiver, arg);
    }
}

Async.prototype._drainQueues = function () {
    _drainQueue(this._normalQueue);
    this._reset();
    this._haveDrainedQueues = true;
    _drainQueue(this._lateQueue);
};

Async.prototype._queueTick = function () {
    if (!this._isTickUsed) {
        this._isTickUsed = true;
        this._schedule(this.drainQueues);
    }
};

Async.prototype._reset = function () {
    this._isTickUsed = false;
};

module.exports = Async;
module.exports.firstLineError = firstLineError;

},{"./queue":26,"./schedule":29}],3:[function(_dereq_,module,exports){
"use strict";
module.exports = function(Promise, INTERNAL, tryConvertToPromise, debug) {
var calledBind = false;
var rejectThis = function(_, e) {
    this._reject(e);
};

var targetRejected = function(e, context) {
    context.promiseRejectionQueued = true;
    context.bindingPromise._then(rejectThis, rejectThis, null, this, e);
};

var bindingResolved = function(thisArg, context) {
    if (((this._bitField & 50397184) === 0)) {
        this._resolveCallback(context.target);
    }
};

var bindingRejected = function(e, context) {
    if (!context.promiseRejectionQueued) this._reject(e);
};

Promise.prototype.bind = function (thisArg) {
    if (!calledBind) {
        calledBind = true;
        Promise.prototype._propagateFrom = debug.propagateFromFunction();
        Promise.prototype._boundValue = debug.boundValueFunction();
    }
    var maybePromise = tryConvertToPromise(thisArg);
    var ret = new Promise(INTERNAL);
    ret._propagateFrom(this, 1);
    var target = this._target();
    ret._setBoundTo(maybePromise);
    if (maybePromise instanceof Promise) {
        var context = {
            promiseRejectionQueued: false,
            promise: ret,
            target: target,
            bindingPromise: maybePromise
        };
        target._then(INTERNAL, targetRejected, undefined, ret, context);
        maybePromise._then(
            bindingResolved, bindingRejected, undefined, ret, context);
        ret._setOnCancel(maybePromise);
    } else {
        ret._resolveCallback(target);
    }
    return ret;
};

Promise.prototype._setBoundTo = function (obj) {
    if (obj !== undefined) {
        this._bitField = this._bitField | 2097152;
        this._boundTo = obj;
    } else {
        this._bitField = this._bitField & (~2097152);
    }
};

Promise.prototype._isBound = function () {
    return (this._bitField & 2097152) === 2097152;
};

Promise.bind = function (thisArg, value) {
    return Promise.resolve(value).bind(thisArg);
};
};

},{}],4:[function(_dereq_,module,exports){
"use strict";
var old;
if (typeof Promise !== "undefined") old = Promise;
function noConflict() {
    try { if (Promise === bluebird) Promise = old; }
    catch (e) {}
    return bluebird;
}
var bluebird = _dereq_("./promise")();
bluebird.noConflict = noConflict;
module.exports = bluebird;

},{"./promise":22}],5:[function(_dereq_,module,exports){
"use strict";
var cr = Object.create;
if (cr) {
    var callerCache = cr(null);
    var getterCache = cr(null);
    callerCache[" size"] = getterCache[" size"] = 0;
}

module.exports = function(Promise) {
var util = _dereq_("./util");
var canEvaluate = util.canEvaluate;
var isIdentifier = util.isIdentifier;

var getMethodCaller;
var getGetter;
if (!true) {
var makeMethodCaller = function (methodName) {
    return new Function("ensureMethod", "                                    \n\
        return function(obj) {                                               \n\
            'use strict'                                                     \n\
            var len = this.length;                                           \n\
            ensureMethod(obj, 'methodName');                                 \n\
            switch(len) {                                                    \n\
                case 1: return obj.methodName(this[0]);                      \n\
                case 2: return obj.methodName(this[0], this[1]);             \n\
                case 3: return obj.methodName(this[0], this[1], this[2]);    \n\
                case 0: return obj.methodName();                             \n\
                default:                                                     \n\
                    return obj.methodName.apply(obj, this);                  \n\
            }                                                                \n\
        };                                                                   \n\
        ".replace(/methodName/g, methodName))(ensureMethod);
};
