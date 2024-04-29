import React from 'react';
import Editor from './editor'; // Assuming 'Editor' component is accessible from this path

// Define the 'Terminal' component
function Terminal({ files, currentFile, setCurrentFile, outlineID, colorToUse, handleContentChange }) {
  return (
    <aside className="terminal">
      <div className="editor-window">
        <div className="file-selector">
          {files.map((file) => {
            const is_highlighted = file.linesToColor[outlineID].length !== 0;
            const is_hidden = outlineID !== "2" && file.name === "setup.py";
            const buttonStyle = is_highlighted ? { borderBottom: `10px solid ${colorToUse}` } : {};
            const buttonClass = is_hidden ? "filename-button-hidden" : "filename-button";

            return (
              <button
                style={buttonStyle}
                className={buttonClass}
                key={file.name}
                onClick={() => setCurrentFile(file)}
              >
                {file.name}
              </button>
            );
          })}
        </div>
        <Editor
          linesToColor={currentFile.linesToColor[outlineID]}
          colorToUse={colorToUse}
          currentFile={currentFile}
          onContentChange={handleContentChange}
        />
      </div>
    </aside>
  );
}

export default Terminal;
