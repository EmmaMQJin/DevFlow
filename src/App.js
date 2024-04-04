import React, { useState, useCallback } from 'react';
import Editor from './components/editor/editor';
import './App.css'

function App() {
  const [files] = useState([
    { name: "example.js", content: "// JavaScript content", linesToColor: [1, 2, 3, 4, 5, 10] },
    { name: "example.py", content: "# Python content", linesToColor: [4, 5, 6, 7] },
    // Add more files as needed
  ]);

  // State to keep track of the currently selected file
  // TODO: when the name of current file changes (when we switch to another file), update the lines to update as well
  const [currentFile, setCurrentFile] = useState(files[0]);

  const handleContentChange = useCallback((newFile) => {
    const fileIndex = files.findIndex(file => file.name === newFile.name);
    files[fileIndex].content = newFile.content;
  }, [currentFile]);

  const colorToUse = "red";
  return (
    <div className="App">
      <div className='editor-window'>
        <div className="file-selector">
          {files.map(file => (
            <button className="filename-button" key={file.name} onClick={() => setCurrentFile(file)}>
              {file.name}
            </button>
          ))}
        </div>
        <Editor linesToColor={currentFile.linesToColor} colorToUse={colorToUse} currentFile={currentFile} onContentChange={handleContentChange} />
      </div>
    </div>
  );
}

export default App;
