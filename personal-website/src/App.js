import React, { useEffect } from 'react';
import './App.css'; 
import Promise from 'bluebird'; 

function App() {
  const selectComment = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
  const selectNumber = /\d+/g;


  function addStylingToStorage(styledLineStorage) {
    styledLineStorage = styledLineStorage.replace(selectComment, (match) => {
      return `<span class="comment">${match}</span>`;
    });
  
    styledLineStorage = styledLineStorage.replace(selectNumber, (match) => {
      return `<span class="number">${match}</span>`;
    });
  
    return styledLineStorage;
  }
  

  function ReadFile(fileId) {
    let oFrame = document.getElementById(fileId);
    let strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
    while (strRawContents.indexOf("\r") >= 0)
      strRawContents = strRawContents.replace("\r", "");
    let arrLines = strRawContents.split("\n");

    console.log(arrLines);
  }

  function GetElements() {
    let stylesElement = document.getElementById("styles");
    let resumeElement = document.getElementById("resume");
    let trueStyleElement = document.getElementById("true-style");
  }
  
  

  async function StartAnimation(lineList, stylesElement) {
    while (lineList.length > 0) {
      const line = lineList.shift();
      await WriteLine(line, stylesElement, true, 20);
    }
  }  
  

  async function WriteLine(line, element, isStyled, delay) {
    for (let char of line) {
      if (isStyled) {
        WriteStyledChar(element, char, line);
      } else {
        WriteSimpleChar(element, char);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    element.innerHTML += "<br>";
  }
  

  async function WriteSimpleChar(element, char) {
    element.innerHTML += char;
  }
  
  function WriteStyledChar(element, char, line, styledLineStorage, outputBuffer, trueStyleElement) {
    styledLineStorage += char;
    outputBuffer += char;
    
    styledLineStorage = outputBuffer;
    styledLineStorage = addStylingToStorage(styledLineStorage);
    element.innerHTML = styledLineStorage;
    
    trueStyleElement.innerHTML = outputBuffer;
  }
  
  

  useEffect(() => {
    let lineList = [];
    let stylesElement;
    let resumeElement;
    let trueStyleElement = document.getElementById("true-style");


    document.onreadystatechange = () => {
      if (document.readyState === 'complete') {
        ReadFile("initial");
        GetElements();
        StartAnimation();
      }
    };

  }, []);

  return (
    <div>
      <div className="number">This is a number</div>
      <div className="comment">This is a comment</div>
    </div>
  );
}

export default App;
