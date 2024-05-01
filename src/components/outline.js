import React, { useState, useEffect, useCallback, useRef } from "react";
import Editor from "./editor";
import "./outline.css";
import { useCollapse } from "react-collapsed";
import ConnectPoint from "./connectpoint";
import Xarrow from 'react-xarrows';
import DraggablePoint from "./draggablepoint";
import { Box } from "./box";

export function Outline(props) {

  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [outlineID, setOutlineID] = useState("-1");
  const [colorToUse, setColorToUse] = useState("red");
  const [activeButton, setActiveButton] = useState("");  // Track active button
  const [showPopup, setShowPopup] = useState(false);     // Popup visibility state

  // Define folder structure and toggle functionality
  const [folders, setFolders] = useState([
    {
      name: "Home Page",
      children: [
        { name: "Parse info into files" },
        { name: "Format and Display Pics" },
      ],
      isOpen: false,
    },
    {
      name: "Order Online",
      children: [
        { name: "Connect Doordash API" },
        { name: "Read Menu to JSON" },
      ],
      isOpen: false,
    },
    {
      name: "Contact Us",
      children: [
        { name: "Format Footer" }
      ],
      isOpen: false,
    },
  ]
  );

  const toggleFolder = (folderName) => {
    setFolders(prevFolders =>
      prevFolders.map(folder =>
        folder.name === folderName ? { ...folder, isOpen: !folder.isOpen } : folder
      )
    );
  };

  // Fetch files when the component mounts
  useEffect(() => {
    async function fetchFiles() {
      try {
        const responses = await Promise.all([
          fetch('/example-code/apis.py'),
          fetch('/example-code/parse.py'),
          fetch('/example-code/setup.py')
        ]);
        if (responses.every(response => response.ok)) {
          const [apiText, parseText, setupText] = await Promise.all(responses.map(response => response.text()));
          console.log(apiText);
          const newFiles = [
            {
              name: "apis.py",
              content: apiText,
              linesToColor: {
                "-1": [],
                "1": [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
                "2": [19, 20, 21, 22, 23],
              },
            },
            {
              name: "parse.py",
              content: parseText,
              linesToColor: { "-1": [], "1": [], "2": [6, 7, 8, 9, 10, 11, 12] },
            },
            {
              name: "setup.py",
              content: setupText,
              linesToColor: { "-1": [], "1": [], "2": [6, 7, 8] },
            }
          ];
          setFiles(newFiles);
          setCurrentFile(newFiles[0]); // Set the first file as the current file after fetching
        } else {
          throw new Error('Failed to fetch one or more files');
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }
    fetchFiles();
  }, []);

  const handleContentChange = useCallback(
    ({ name, content, linesToColor }) => {
      if (currentFile) {
        const updatedFiles = files.map(file => {
          if (file.name === currentFile.name) {
            console.log("Updating file:", file.name);
            return { ...file, content, ...(linesToColor && { linesToColor }) };
          }
          return file;
        });
        setFiles(updatedFiles);
        setCurrentFile(prev => ({
          ...prev,
          content,
          ...(linesToColor && { linesToColor })
        }));
      }
    },
    [currentFile, files]
  );
  
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleEditOutlineClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  if (!currentFile) return <div>Loading files...</div>; 

  // Main App
  return (
    <div className="vscode-app">
      <main className="vscode-main">
        <section className="editor">
          <div className="editor-placeholder">
            <h1 className="editor-title">
              Outline
              <span className="material-symbols-outlined help">help</span>
            </h1>
            <FolderStructure
                folders={folders}
                onToggleFolder={toggleFolder}
            />
          </div>
            {/* Folder structure component */}
          <div className="edit-outline-container">
            {/* Popup Code */}
            <button
              className="primary-button edit-outline"
              onClick={handleEditOutlineClick}
            >
              Edit Outline
            </button>
          </div>
        </section>

        <aside className="terminal">
          <div className="editor-window">
            <div className="file-selector">
              {files.map((file) => {
                const is_highlighted =
                  file.linesToColor[outlineID].length !== 0;
                const is_hidden = outlineID !== "2" && file.name === "setup.py";
                const buttonStyle = is_highlighted
                  ? { borderBottom: `10px solid ${colorToUse}` }
                  : {};
                const buttonClass = is_hidden
                  ? "filename-button-hidden"
                  : "filename-button";

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
      </main>
      {showPopup && <Popup onClose={handlePopupClose} />}
    </div>
  );

  function FolderStructure({ folders, onToggleFolder }) {
    const [totalHeight, setTotalHeight] = useState(0);

    return (
      <div className="folder-structure">
        {folders.map((folder, index) => (
          <FolderItem
            key={folder.name}
            folder={folder}
            index={index}
            totalHeight={totalHeight}
            setTotalHeight={setTotalHeight}
            onToggleFolder={onToggleFolder}
            setOutlineID={setOutlineID} // Pass setOutlineID as a prop
            setColorToUse={setColorToUse} // Pass setColorToUse as a prop
          />
        ))}
      </div>
    );
  }

  function FolderItem({
    folder,
    index,
    totalHeight,
    setTotalHeight,
    onToggleFolder,
    setOutlineID,
    setColorToUse,
  }) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
      defaultExpanded: folder.isOpen,
    });

    const folderHeight = isExpanded ? 30 + folder.children.length * 20 : 30;
    const top = index === 0 ? 0 : totalHeight;

    const handleSubfolderClick = (e, subfolderName) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(subfolderName);
      if (subfolderName === "Connect Doordash API") {
        // When outlineID is -1, set it to 2 and colorToUse to blue
        setOutlineID("1");
        setColorToUse("#32D4CC");
      } else if (subfolderName === "Read Menu to JSON") {
        setOutlineID("2");
        setColorToUse("#FFEA99");
      } else {
        // When outlineID is not -1, set it to -1 and colorToUse to red
        setOutlineID("-1");
        setColorToUse("red");
      }
    };

    const [connections, setConnections] = useState([]);


    const [showPopup, setShowPopup] = useState(false);

    const handleDragEnd = (id, position) => {
      // Update connections with new end positions
      setConnections(current =>
        current.map(conn => (conn.end === id ? { ...conn, endPos: position } : conn))
      );
      // Show the popup after dragging ends
      setShowPopup(true);
    };

    const handleClosePopup = () => {
      setShowPopup(false);
    };
    const [arrows, setArrows] = useState([]);
    const addArrow = ({ start, end }) => {
      setArrows([...arrows, { start, end }]);
    };

    return (
      <div className="folder-item" style={{ top }}>
        <div
          className="folder-toggle"
          onClick={() => onToggleFolder(folder.name)}
          // {...getToggleProps()}
        >
          <span
            className={`material-symbols-outlined ${
              isExpanded ? "folder-open" : "folder"
            }`}
          >
            chevron_right
          </span>
          <span className="folder-name">{folder.name}</span>
        </div>
        {folder.children && isExpanded && (
          <ul className="subfolders" {...getCollapseProps()}>
            {folder.children.map((subfolder) => (
              <li key={subfolder.name} className="subfolder-item">
              <div class="subfolder-box">
              <div class="subfolder-text" onClick={(e) => handleSubfolderClick(e, subfolder.name)}>
                {subfolder.name}
              </div>
              <Box
                addArrow={addArrow}
                handler="right"
                boxId={subfolder.name}
              />
              </div>
              {arrows.map(ar => (
              <Xarrow
                start={ar.start}
                end={ar.end}
                key={ar.start + "-." + ar.end}
              />
              ))}
              </li>
            ))}
          </ul>
        )}
        {connections.map((conn, idx) => (
          <Xarrow
            key={idx}
            start={conn.start}
            end={conn.end}
            startAnchor="auto"
            endAnchor="auto"
            color="magenta"
          />
        ))}
      </div>
    );
  }
  function DragPopup({ onClose }) {
    return (
      <div className="dragpopup">
        <div className="popup-header">
          <h2 className="popup-title">
            Link Code to Note "Connect Doordash API"
          </h2>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          <label>
            <input
              type="radio"
              name="myRadio"
              value="option1"
              defaultChecked={true}
            />
            Link Line 7
          </label>
          <br></br>
          <label className="popup-deactivated">
            <input type="radio" name="myRadio" value="option2" />
            Link get_delivery
          </label>
          <br></br>
          <label className="popup-deactivated">
            <input type="radio" name="myRadio" value="option3" />
            Customize the range
          </label>
          <br></br>

          <label className="popup-deactivated">
            From: <input name="from" />
          </label>
          <br></br>
          <label className="popup-deactivated">
            To: <input name="to" />
          </label>
        </div>
        <div className="popup-footer">
          <button className="popup-button cancel">Cancel</button>
          <button className="popup-button save" onClick={onClose}>Save</button>
        </div>
      </div>
    );
  }

  function Popup({ onClose }) {
    const folders = [
      {
        name: "Bakery Website",
        children: [
          {
            name: "Home Page",
            children: [
              { name: "Parse info into files" },
              { name: "Format and Display Pics" },
            ],
          },
          {
            name: "Order Online",
            children: [
              { name: "Connect Doordash API" },
              { name: "Read Menu to JSON" },
            ],
          },
          {
            name: "Contact Us",
            children: [{ name: "Format Footer" }],
          },
        ],
      },
    ];

    const renderFolder = (folder) => (
      <div key={folder.name} className="folder">
        <span className="material-symbols-outlined">menu</span>
        <span className="folder-name">{folder.name}</span>
        {folder.children && (
          <ul className="subfolders">
            {folder.children.map((subfolder) => (
              <li key={subfolder.name} className="subfolder">
                <span className="material-symbols-outlined">menu</span>
                <span className="folder-name">{subfolder.name}</span>
                {subfolder.children && (
                  <ul className="sub-subfolders">
                    {subfolder.children.map((subSubfolder) => (
                      <li key={subSubfolder.name} className="sub-subfolder">
                        <span className="material-symbols-outlined">menu</span>
                        <span className="folder-name">{subSubfolder.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    );

    return (
      <div className="popup">
        <div className="popup-header">
          <h2 className="popup-title">Bakery Website</h2>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          {folders.map((folder) => renderFolder(folder))}
        </div>
        <div className="popup-footer">
          <button className="popup-button cancel">Cancel</button>
          <button className="popup-button save">Save</button>
        </div>
      </div>
    );
  }
}