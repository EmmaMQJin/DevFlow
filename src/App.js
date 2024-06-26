import React, { useState, useCallback } from "react";
import "./App.css";
import { Outline } from "./components/outline"; // Import the Outline component from the Outline.js file

export default App;

function App() {
  // TODO: how to make the relevant files pop up?
  // 1: connect doordash api
  // 2: read menu to json

  const [activeFile, setActiveFile] = useState("main");

  const handleFileClick = (file) => {
    setActiveFile(file === "outline" ? "outline" : "main");
  };

  return (
    <div className="vscode-app">
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
          {/* Add sidebar elements here */}
          <div className="explorer">
            <span className="material-symbols-outlined">folder</span>
            {/* List of files and folders */}
          </div>
          <div className="debug">
            <span className="material-symbols-outlined">settings</span>
            {/* Debug controls */}
          </div>
          <div className="extensions">
            <span className="material-symbols-outlined">extension</span>
            {/* List of installed extensions */}
          </div>
        </aside>

        <section className="editor">
          {activeFile === "main" ? (
            <div className="editor-placeholder">
              <p className="placeholder-header">Get Started!</p>
              <button className="primary-button">Create New Outline</button>
              <p className="button-label">Start a new project from scratch.</p>

              <p className="or">Or</p>

              <button className="secondary-button">Import from Files</button>
              <p className="button-label">
                Open an existing outline from your computer.
              </p>
              <p className="placeholder-header">Recent Files</p>
              <ul className="recent-files">
                <li className="file-item">
                  <a href="#" onClick={() => handleFileClick("outline")}>
                    Bakery Website.txt
                  </a>
                </li>
                <li className="file-item">
                  <a href="#">Research Paper Draft.docx</a>
                </li>
                {/* Add more recent files here */}
              </ul>
              <p className="placeholder-header">Help</p>
              <ul className="faq">
                <li className="faq-item">
                  <a href="#">How do I create a new outline?</a>
                </li>
                <li className="faq-item">
                  <a href="#">What file formats can I import?</a>
                </li>
                {/* Add more frequently asked questions here */}
              </ul>
            </div>
          ) : (
            <Outline />
          )}
        </section>
        <aside className="terminal">
          <h2 className="terminal-heading">DevFlow</h2>
          <p className="terminal-subheading">Link, Discover, Code.</p>
          <button className="terminal-button">Show all commands</button>
          <button className="terminal-button">Go to Files</button>
          <button className="terminal-button">Find in Files</button>
          <button className="terminal-button">Toggle Full Screen</button>
          <button className="terminal-button">Show Settings</button>
        </aside>
      </main>
      <footer className="vscode-footer">
        <span>© 2024 DevFlow. All rights reserved.</span>
      </footer>
    </div>
  );
}

//Log to console
console.log("Hello console");
