import React, { useState, useCallback } from 'react';
import Editor from './components/editor/editor';
import './App.css'

function App() {
  // TODO: how to make the relevant files pop up?
  const [files] = useState([
    { name: "example.js", content: "// JavaScript content",
      linesToColor: {"-1": [],
                     "1" : [1, 2, 3, 4, 5],
                     "2" : [1, 2, 3]} },
    { name: "example.py", content: "# Python content", 
      linesToColor: {"-1": [],
                     "1" : [4, 5, 6, 7, 8, 9, 10],
                     "2" : [2, 3],
                     "3" : []} },
  ]);

  // State to keep track of the currently selected file
  // TODO: when the name of current file changes (when we switch to another file), update the lines to update as well
  const [currentFile, setCurrentFile] = useState(files[0]);

  const handleContentChange = useCallback((newFile) => {
    const fileIndex = files.findIndex(file => file.name === newFile.name);
    files[fileIndex].content = newFile.content;
  }, [currentFile]);


  const outlineID = "-1";
  const colorToUse = "blue";
  return (
    <div className="App">
      <div className='dummy-div'>
        <p> This is a dummy block -------------------!</p>
      </div>
      <div className='editor-window'>
        <div className="file-selector">
          {files.map(file => (
            <button className="filename-button" key={file.name} onClick={() => setCurrentFile(file)}>
              {file.name}
            </button>
          ))}
        </div>
        <Editor linesToColor={currentFile.linesToColor[outlineID]} colorToUse={colorToUse} currentFile={currentFile} onContentChange={handleContentChange} />
      </div>
    </div>
  );
}

export default App;
