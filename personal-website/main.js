let lineList = [];

// Element references
let stylesElement;
let resumeElement;
let trueStyleElement = document.getElementById("true-style");

// Writing Delays in ms
const isDev = window.location.hostname === '127.0.0.1';
const normal = (isDev) ? 0 : 20;
const fast = (isDev) ? 0 : 5;
const ultra = 0;
const speechPause = 500;
let ignorePause = false;

// Storages
let styledLineStorage = ""; // insert into body
let outputBuffer = ""; // insert to style tag

// REGEX Matches
const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectNumber = /\d+/g;
const selectCssProperty = / {4}[a-zA-Z-]+:/g;
const selectCssValue = / .+;/g;
const selectCssSelector = /[* @#:\(\).a-zA-Z0-9-]+  /g
const selectMedia = /@media/g;

// State
let state;

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