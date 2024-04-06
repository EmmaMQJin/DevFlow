import React, { useState, useCallback } from 'react';
import Editor from './components/editor/editor';
import './App.css'

const api_contents = `"""
file for defining all APIs and endpoints used,
as well as related utils
"""
from parse import parse_info

def get_delivery(info):
  # define doordash deliveries endpoint
  endpoint = "https://openapi.doordash.com/drive/v2/deliveries/"

  headers = {"Accept-Encoding": "application/json",
             "Authorization": "Bearer " + token,
             "Content-Type": "application/json"}

  # Create POST request
  create_delivery = requests.post(endpoint, headers=headers, json=info) 


def read_menu(filename):
  # read and parse menu txt




















`

const parse_contents = `"""
util functions for parsing
"""
import json

def parse_info(lines):
    outfile_path = "menu_info.json"
    for line in lines:
        parsed = line.strip().split('|')
        name, pic_link, price = parsed[0], parsed[1], parsed[2]
        json_obj = {name : name, pic: pic_link, price: price}
        json.dump(json_obj, outfile_path, indent=4)

`


function App() {
  // TODO: how to make the relevant files pop up?
  // 1: connect doordash api
  // 2: read menu to json
  const [files] = useState([
    { name: "apis.py", content: api_contents,
      linesToColor: {"-1": [],
                     "1" : [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                     "2" : [19, 20, 21, 22, 23]} },
    { name: "parse.py", content: parse_contents, 
      linesToColor: {"-1": [],
                     "1" : [],
                     "2" : [6, 7, 8, 9, 10, 11, 12]} },
    { name: "setup.py", content: "# Python content\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", 
    linesToColor: {"-1": [],
                  "1" : [],
                  "2" : [6, 7, 8]} },

  ]);

  // State to keep track of the currently selected file
  // TODO: when the name of current file changes (when we switch to another file), update the lines to update as well
  const [currentFile, setCurrentFile] = useState(files[0]);

  const handleContentChange = useCallback((newFile) => {
    const fileIndex = files.findIndex(file => file.name === newFile.name);
    files[fileIndex].content = newFile.content;
  }, [currentFile]);


  const outlineID = "2";
  const colorToUse = "#7F83D3"; // #FF9999, #FFEA99, #32D4CC
  return (
    <div className="App">
      <div className='dummy-div'>
        <p> This is a dummy block -------------------!</p>
      </div>
      <div className='editor-window'>
        <div className="file-selector">
          {files.map((file) =>  {
            const is_highlighted = (file.linesToColor[outlineID].length !== 0);
            const is_hidden = outlineID !== "2" && file.name === "setup.py";
            const buttonStyle = is_highlighted ? { borderBottom: `5px solid ${colorToUse}` } : {};
            const buttonClass = is_hidden ? "filename-button-hidden" : "filename-button";

            return(
            <button style={buttonStyle} className={buttonClass} key={file.name} onClick={() => setCurrentFile(file)}>
              {file.name}
            </button>
            )
          })}
        </div>
        <Editor linesToColor={currentFile.linesToColor[outlineID]} colorToUse={colorToUse} currentFile={currentFile} onContentChange={handleContentChange} />
      </div>
    </div>
  );
}

export default App;
