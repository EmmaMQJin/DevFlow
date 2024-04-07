import React, { useState, useEffect, useCallback, useRef } from "react";
import Editor from "./editor";
import "./outline.css";
import { useCollapse } from "react-collapsed";

import Xarrow from "react-xarrows";

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
  # read and parse menu txt`;

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

`;

export function Outline(props) {
  const connectPointStyle = {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "white",
  };
  const connectPointOffset = {
    left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
    right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
    top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
    bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
  };
  const [showDragPopup, setShowDragPopup] = useState(false);

  const ConnectPointsWrapper = ({ boxId, handler, ref0 }) => {
    const ref1 = useRef();

    const [position, setPosition] = useState({});
    const [beingDragged, setBeingDragged] = useState(false);
    return (
      <React.Fragment>
        <div
          className="connectPoint"
          style={{
            ...connectPointStyle,
            ...connectPointOffset[handler],
            ...position,
          }}
          draggable
          onDragStart={(e) => {
            setBeingDragged(true);
            e.dataTransfer.setData("arrow", boxId);
          }}
          onDrag={(e) => {
            setPosition({
              position: "fixed",
              left: e.clientX,
              top: e.clientY,
              transform: "none",
              opacity: 0,
            });
          }}
          ref={ref1}
          onDragEnd={(e) => {
            setPosition({});
            // e.dataTransfer.setData("arrow", null);
            setBeingDragged(false);
            setShowDragPopup(true);
          }}
        />
        {beingDragged ? <Xarrow start={ref0} end={ref1} /> : null}
      </React.Fragment>
    );
  };

  const boxStyle = {
    position: "relative",
    padding: "0px 0px",
    fontSize: 20,
  };

  const Box = ({ text, handler, addArrow, boxId }) => {
    const ref0 = useRef();
    return (
      <div
        id={boxId}
        style={boxStyle}
        ref={ref0}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          if (e.dataTransfer.getData("arrow") === boxId) {
            console.log(e.dataTransfer.getData("arrow"), boxId);
          } else {
            const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
            addArrow(refs);
            console.log("droped!", refs);
          }
        }}
      >
        {text}
        <ConnectPointsWrapper {...{ boxId, handler, ref0 }} />
      </div>
    );
  };
  //Arrow SAtate
  const [arrows, setArrows] = useState([]);
  const addArrow = ({ start, end }) => {
    setArrows([...arrows, { start, end }]);
  };

  // State to keep track of the outlineID and colorToUse
  const [outlineID, setOutlineID] = useState("-1");
  const [colorToUse, setColorToUse] = useState("red");
  const [files] = useState([
    {
      name: "apis.py",
      content: api_contents,
      linesToColor: {
        "-1": [],
        1: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        2: [19, 20, 21, 22, 23],
      },
    },
    {
      name: "parse.py",
      content: parse_contents,
      linesToColor: { "-1": [], 1: [], 2: [6, 7, 8, 9, 10, 11, 12] },
    },
    {
      name: "setup.py",
      content: "# Python content\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
      linesToColor: { "-1": [], 1: [], 2: [6, 7, 8] },
    },
  ]);

  // State to keep track of the currently selected file
  // TODO: when the name of current file changes (when we switch to another file), update the lines to update as well
  const [currentFile, setCurrentFile] = useState(files[0]);

  const handleContentChange = useCallback(
    (newFile) => {
      const fileIndex = files.findIndex((file) => file.name === newFile.name);
      files[fileIndex].content = newFile.content;
    },
    [currentFile]
  );

  // Define handleClickOutline function

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  const [activeButton, setActiveButton] = useState(""); // Track active button

  // Folder Structure and dropdown toggle
  const [folders, setFolders] = useState([
    {
      name: "Home Page",
      children: [
        { name: "Parse info into files" },
        { name: "Format and Display Pics" },
      ],
      isOpen: false, // Initial state: Open
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
  ]);

  const toggleFolder = (folderName) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.name === folderName
          ? { ...folder, isOpen: !folder.isOpen }
          : folder
      )
    );
  };

  // Popup window constants
  const [showPopup, setShowPopup] = useState(false);

  const handleEditOutlineClick = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

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
            <div className="style-buttons">
              <button
                className={`primary-button ${
                  activeButton === "bulletList" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("bulletList")}
              >
                Bullet List
              </button>
              <button
                className={`primary-button ${
                  activeButton === "canvas" ? "active" : ""
                }`}
                onClick={() => handleButtonClick("canvas")}
              >
                Canvas
              </button>

              <FolderStructure
                folders={folders}
                onToggleFolder={toggleFolder}
              />
            </div>
            {/* Folder structure component */}
          </div>
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
          {/* ... terminal elements ... */}
          <div className="editor-window">
            <div className="file-selector">
              {files.map((file) => {
                const is_highlighted =
                  file.linesToColor[outlineID].length !== 0;
                const is_hidden = outlineID !== "2" && file.name === "setup.py";
                const buttonStyle = is_highlighted
                  ? { borderBottom: `5px solid ${colorToUse}` }
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

      {/* Popup Code */}
      {/* Popup Window */}
      {showPopup && <Popup onClose={handlePopupClose} />}
      {showDragPopup && <DragPopup onClose={() => setShowDragPopup(false)} />}

      <footer className="vscode-footer">
        <span>© 2024 DevFlow. All rights reserved.</span>
      </footer>
      {/* ... footer ... */}
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
    setOutlineID, // Add setOutlineID as a prop
    setColorToUse, // Add setColorToUse as a prop
  }) {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
      defaultExpanded: folder.isOpen,
    });

    const folderHeight = isExpanded ? 30 + folder.children.length * 20 : 30;
    const top = index === 0 ? 0 : totalHeight;

    const handleSubfolderClick = () => {
      if (outlineID === "-1") {
        // When outlineID is -1, set it to 2 and colorToUse to blue
        setOutlineID("2");
        setColorToUse("blue");
      } else {
        // When outlineID is not -1, set it to -1 and colorToUse to red
        setOutlineID("-1");
        setColorToUse("red");
      }
    };

    useEffect(() => {
      if (isExpanded) {
        setTotalHeight((prevHeight) => prevHeight + folderHeight);
      } else {
        const collapsedHeight = 30 + folder.children.length * 20;
        setTotalHeight((prevHeight) => prevHeight - collapsedHeight);
      }
    }, [isExpanded, folderHeight, folder.children.length, setTotalHeight]);

    return (
      <div className="folder-item" style={{ top }}>
        <div
          className="folder-toggle"
          onClick={() => onToggleFolder(folder.name)}
          {...getToggleProps()}
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
                <a href="#" onClick={handleSubfolderClick}>
                  <Box
                    text={subfolder.name}
                    {...{ addArrow, handler: "right", boxId: "box2_1" }}
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
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
          <button className="popup-button save">Save</button>
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

  console.log("Hello console");
}
