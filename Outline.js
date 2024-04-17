import React, { useState, useEffect } from "react";
import "./styles.css";
import { useCollapse } from "react-collapsed";

export function Outline(props) {
  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };const [activeButton, setActiveButton] = useState(""); // Track active button
  
  // Folder Structure and dropdown toggle
  const [folders, setFolders] = useState([
  {
    name: "Home Page",
    children: [
      { name: "Parse info into files" },
      { name: "Format and Display Pics" },
    ],
    isOpen: false, // Initial state: Open
    helpText: "This is the Home Page folder.",

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
      folder.name === folderName ? { ...folder, isOpen: !folder.isOpen } : folder
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
      {/* ... other components ... */}
      <header className="vscode-header">
        <div className="logo">DevFlow</div>
        <nav className="menu">
          {/* Add menu items here */}
          <a href="#">File</a>
          <a href="#">Edit</a>
          <a href="#">View</a>
          <a href="#">Go</a>
          <a href="#">Debug</a>
          <a href="#">Run & Debug</a>
          <a href="#">Terminal</a>
          <a href="#">Help</a>
        </nav>
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>
      </header>

      <main className="vscode-main">
        <aside className="sidebar">
          {/* ... sidebar elements ... */}
          <div className="explorer">
            <span class="material-symbols-outlined">folder</span>
            {/* List of files and folders */}
          </div>
          <div className="debug">
            <span class="material-symbols-outlined">settings</span>
            {/* Debug controls */}
          </div>
          <div className="extensions">
            <span class="material-symbols-outlined">extension</span>
            {/* List of installed extensions */}
          </div>
        </aside>

        <section className="editor">
        <div className="editor-placeholder">
          <h1 className="editor-title">Outline<span className="material-symbols-outlined help">help</span></h1>
          <div className="style-buttons">
          
          <button
            className={`primary-button ${activeButton === "bulletList" ? "active" : ""}`}
            onClick={() => handleButtonClick("bulletList")}
          >
            Bullet List
          </button>
          <button
            className={`primary-button ${activeButton === "canvas" ? "active" : ""}`}
            onClick={() => handleButtonClick("canvas")}
          >
            Canvas
          </button>
          
            <FolderStructure folders={folders} onToggleFolder={toggleFolder} />
          </div>
          {/* Folder structure component */}
          
        </div>
        <div className="edit-outline-container">
       {/* Popup Code */}
        <button className="primary-button edit-outline" onClick={handleEditOutlineClick}>
              Edit Outline
            </button>
          </div>
       </section>
        
        <aside className="terminal">
          {/* ... terminal elements ... */}
          <h2 className="terminal-heading">DevFlow</h2>
          <p className="terminal-subheading">Link, Discover, Code.</p>
          <button className="terminal-button">Show all commands</button>
          <button className="terminal-button">Go to Files</button>
          <button className="terminal-button">Find in Files</button>
          <button className="terminal-button">Toggle Full Screen</button>
          <button className="terminal-button">Show Settings</button>
        </aside>
      </main>

{/* Popup Code */}
      {/* Popup Window */}
      {showPopup && <Popup onClose={handlePopupClose} />}

      <footer className="vscode-footer">
        <span>© 2024 DevFlow. All rights reserved.</span>
      </footer>
      {/* ... footer ... */}
    </div>
  );
}

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
        />
      ))}
    </div>
  );
}

function FolderItem({ folder, index, totalHeight, setTotalHeight, onToggleFolder }) {
  const { getCollapseProps, getToggleProps, isExpanded } = useCollapse({
    defaultExpanded: folder.isOpen,
  });

  const folderHeight = isExpanded ? 30 + folder.children.length * 20 : 30;
  const top = index === 0 ? 0 : totalHeight;

  const [showHelpBox, setShowHelpBox] = useState(false);


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
      <div className="folder-toggle" onClick={() => onToggleFolder(folder.name)} {...getToggleProps()}>
        <span className={`material-symbols-outlined ${isExpanded ? "folder-open" : "folder"}`}>chevron_right</span>
        <span className="folder-name">{folder.name}</span>
      </div>
      {folder.children && isExpanded && (
        <ul className="subfolders" {...getCollapseProps()}>
          {folder.children.map((subfolder) => (
            <li key={subfolder.name} className="subfolder-item">
              <a href="#">{subfolder.name}</a>
            </li>
          ))}
        </ul>
      )}

{showHelpBox && (
        <div className="help-box">{folder.helpText}</div>
      )}

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