import React, { useState, useEffect, useCallback } from "react";
import Editor from "./editor";
import "./outline.css";
import { useCollapse } from "react-collapsed";
import Xarrow from 'react-xarrows';
import { Box } from "./box";
import OpenAI from 'openai';


export function Outline(props) {

  const [isAIPopupOpen, setIsAIPopupOpen] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);


  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [outlineID, setOutlineID] = useState("");
  const [colorToUse, setColorToUse] = useState("");
  const [activeButton, setActiveButton] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const [editedFolders, setEditedFolders] = useState([]);
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
  ]);


  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const handleSubmit = async (e, projectIdea) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(projectIdea);
      const sysprompt = `You are a helpful outline generator for coding projects. Given a project idea from the user, you should output the outline of the project in a TODO-list like format. Each item should FEWER THAN 6 words long. Output as a list of JSON objects like this:
      [
          {
            "name": "Home Page",
            "children": [
              { "name": "Parse info into files" },
              { "name": "Format and Display Pics" }
            ],
            "isOpen": false,
          },
          {
            "name": "Order Online",
            "children": [
              { "name": "Connect Doordash API" },
              { "name": "Read Menu to JSON" }
            ],
            "isOpen": false,
          },
          {
            "name": "Contact Us",
            "children": [
              { "name": "Format Footer" }
            ],
            "isOpen": false,
          }
        ]
      You should generate 3 outer-layer items ("Home Page", "Order Online", and "Contact Us" is the above case). For the first outer-layer item, it should have 2 subitems. For the second outer-layer item, it should have 2 subitems. For the third outer-layer item, it should have 1 subitem!!! Only 1! Generate exactly as the format given.`;

      const shot1 = `[
        {
          "name": "Home Page",
          "children": [
            { "name": "Parse info into files" },
            { "name": "Format and Display Pics" }
          ],
          "isOpen": false,
        },
        {
          "name": "Order Online",
          "children": [
            { "name": "Connect Doordash API" },
            { "name": "Read Menu to JSON" }
          ],
          "isOpen": false,
        },
        {
          "name": "Contact Us",
          "children": [
            { "name": "Format Footer" }
          ],
          "isOpen": false,
        }
      ]`;
      const shot2 = `[
        {
          "name": "Home Page",
          "children": [
            { "name": "Design UI Layout" },
            { "name": "Implement Authentication System" }
          ],
          "isOpen": false
        },
        {
          "name": "Task Management",
          "children": [
            { "name": "Create Task CRUD Functionality" },
            { "name": "Add Priority and Due Date" }
          ],
          "isOpen": false
        },
        {
          "name": "Settings",
          "children": [
            { "name": "Allow User Preferences" }
          ],
          "isOpen": false
        }
      ]`;
      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "user", "content": "bakery website"},
          {"role": "assistant", "content": shot1},
          {"role": "user", "content": "todo list app"},
          {"role": "assistant", "content": shot2},
          {"role": "system", "content": sysprompt},
          {"role": "user", "content": projectIdea}
        ],
      });
      console.log(chatCompletion.choices[0].message.content);
      const jsonObject = JSON.parse(chatCompletion.choices[0].message.content);
      console.log(jsonObject);
      function transformFolders(folders) {
        return folders.map(folder => ({
          name: folder.name,
          children: folder.children.map(child => ({
            name: child.name
          })),
          isOpen: folder.isOpen
        }));
      }
      const jsobject = transformFolders(jsonObject);
      console.log(typeof jsobject)
      // setApiResponse(jsobject);
      setFolders(jsobject);
      // setShowPopup(true);
      // call popup
      handleEditOutlineClick();
    } catch (e) {
      console.error(e);
      setApiResponse("Something is going wrong, Please try again.");
    }
    setLoading(false);
  };

  const handleGenerateOutlineClick = () => {
    setIsAIPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsAIPopupOpen(false);
  };


  const handleSubmitForm = (e, projectIdea) => {
    e.preventDefault();
    handleSubmit(e, projectIdea);
    handleClosePopup();
  };

  const AiPopup = ({ isOpen, onClose, onSubmit }) => {
    const [projectIdea, setProjectIdea] = useState('');
    
    const handleInputChange = (e) => {
      setProjectIdea(e.target.value);
    };
    if (!isOpen) return null;
  
    return (
      <div className="popup" style={{height: 200}} >
        <h2>What project do you want to build?</h2>
        <form onSubmit={(e) => handleSubmitForm(e, projectIdea)}>
          <input
            type="text"
            value={projectIdea}
            onChange={handleInputChange}
            placeholder="Enter your project idea"
            style={{ width: '95%', padding: '10px', marginBottom: '10px' }}
          />
          <button className="popup-button save" type="submit" >
            Submit
          </button>
          <button onClick={onClose} className="popup-button save" >Close</button>
        </form>
      </div>
    );
  };

  const extractChildrenNames = (folders) => {
    return folders.flatMap(folder => folder.children.map(child => child.name));
  };

  const subfolderList = extractChildrenNames(folders);

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
          fetch('/example-code/format.py')
        ]);
        if (responses.every(response => response.ok)) {
          const [apiText, parseText, setupText] = await Promise.all(responses.map(response => response.text()));
          console.log(apiText);
          const newFiles = [
            {
              name: "apis.py",
              content: apiText,
              linesToColor: {
                "": [],
                "Parse info into files": [],
                "Format and Display Pics": [],
                "Connect Doordash API": [15, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114],
                "Read Menu to JSON": [19, 20, 21, 22, 23, 17, 18],
                "Format Footer": []
              },
            },
            {
              name: "parse.py",
              content: parseText,
              linesToColor: { "": [],
                "Parse info into files": [],
                "Format and Display Pics": [],
                "Connect Doordash API": [],
                "Read Menu to JSON": [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
                "Format Footer": []
              },
            },
            {
              name: "format.py",
              content: setupText,
              linesToColor: { "": [],
                "Parse info into files": [],
                "Format and Display Pics": [],
                "Connect Doordash API": [],
                "Read Menu to JSON": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
                "Format Footer": []
              },
            }
          ];
          setFiles(newFiles);
          setCurrentFile(newFiles[0]);
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
    setEditedFolders([...folders]);
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
              {/* New Generate New Outline Button */}
          <button
            className="primary-button edit-outline"
            onClick={handleGenerateOutlineClick}
          >
            Generate New Outline
          </button>
          </div>
        </section>

        <aside className="terminal">
          <div className="editor-window">
            <div className="file-selector">
              {files.map((file) => {
                const is_highlighted =
                  file.linesToColor[outlineID].length !== 0;
                const is_hidden = outlineID !== "Read Menu to JSON" && file.name === "format.py";
                const buttonStyle = is_highlighted
                  ? { borderBottom: `8px solid ${colorToUse}` }
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
      {isAIPopupOpen && <AiPopup isOpen={isAIPopupOpen} onClose={handleClosePopup} onSubmit={handleSubmitForm} />}
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
      if (outlineID === subfolderName) {
        setOutlineID("");
      } else {
        setOutlineID(subfolderName)
      }
      console.log(subfolderName);
      if (subfolderName === subfolderList[0]) {
        setColorToUse("#32D4CC");
      } else if (subfolderName === subfolderList[1]) {
        setColorToUse("#FFEA99");
      } else if (subfolderName === subfolderList[2]) {
        setColorToUse("#7F83D3");
      } else if (subfolderName === subfolderList[3]) {
        setColorToUse("#D47F9D");
      } else if (subfolderName === subfolderList[4]) {
        setColorToUse("#7FADD3");
      } else {
        setColorToUse("red");
      }
    };

    const [connections, setConnections] = useState([]);

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
              <div className="subfolder-box">
              <div className="subfolder-text" 
              onClick={(e) => handleSubfolderClick(e, subfolder.name)}
              style={{
                color: subfolder.name === outlineID ? colorToUse : 'white',
                fontWeight: subfolder.name === outlineID ? "bold" : "normal"
              }}>
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

  function Popup({ onClose }) {
    const [editedFolders, setEditedFolders] = useState([...folders]);

    const handleFolderNameChange = (e, folderIndex) => {
      const newFolders = editedFolders.map((folder, index) => {
        if (index === folderIndex) {
          return { ...folder, name: e.target.value };
        }
        return folder;
      });
      setEditedFolders(newFolders);
    };
  
    const handleSubfolderNameChange = (e, folderIndex, subfolderIndex) => {
      const newFolders = editedFolders.map((folder, index) => {
        if (index === folderIndex) {
          const newChildren = folder.children.map((subfolder, subIndex) => {
            if (subIndex === subfolderIndex) {
              return { ...subfolder, name: e.target.value };
            }
            return subfolder;
          });
          return { ...folder, children: newChildren };
        }
        return folder;
      });
      setEditedFolders(newFolders);
    };

    const renderFolder = (folder, folderIndex) => (
      <div key={folderIndex} className="popup-folder">
        <input
          type="text"
          value={folder.name}
          onChange={(e) => handleFolderNameChange(e, folderIndex)}
        />
        {folder.children && (
          <ul className="popup-subfolders">
            {folder.children.map((subfolder, subfolderIndex) => (
              <li key={subfolderIndex} className="popup-subfolder">
                <input
                  type="text"
                  value={subfolder.name}
                  onChange={(e) => handleSubfolderNameChange(e, folderIndex, subfolderIndex)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );

    return (
      <div className="popup">
        <div className="popup-header">
          <h2 className="popup-title">Project Outline</h2>
          <button className="popup-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          {editedFolders.map((folder, folderIndex) => renderFolder(folder, folderIndex))}
        </div>
        <div className="popup-footer">
          <button className="popup-button cancel" onClick={onClose}>Cancel</button>
          <button className="popup-button save" onClick={() => { onClose(); setFolders(editedFolders); }}>Save</button>
        </div>
      </div>
    );
  }
}