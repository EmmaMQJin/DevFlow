import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, gutter, GutterMarker, lineNumbers } from '@codemirror/view';
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import './editor.css';

// Function to determine the language extension based on the file name
const getLanguageExtension = (fileName) => {
  if (fileName.endsWith('.js')) {
    return javascript();
  } else if (fileName.endsWith('.py')) {
    return python();
  }
  return [];
};

class ColoredGutterMarker extends GutterMarker {
  constructor(color) {
    super(); // Call the parent class constructor
    this.color = color; // Store the color value
  }
  toDOM() {
    const marker = document.createElement('div');
    marker.style.background = this.color;
    marker.style.width = '5px'; // Set the width of the block
    marker.style.height = '100%'
    return marker;
  }
}
// Editor component
const Editor = ({ linesToColor, colorToUse, currentFile, onContentChange }) => {
  const editorRef = useRef(null);
  console.log("editor file: ", currentFile);
  useEffect(() => {
    if (!editorRef.current) return;
    // TODO: should we only update the actual content when we switch to other files??
    // TODO: actually, when we switch context states, when we switch back, only then create
    // a new editor and pull from the file contents?
    const updateListener = EditorView.updateListener.of((update) => {
      // we just want to write to the file contents here
      if (update.docChanged) {
        const newContent = update.state.doc.toString();
        console.log("new content:", newContent);
        onContentChange({name: currentFile.name, content: newContent});
      }
    });

    const langExtension = getLanguageExtension(currentFile.name);
    // Initialize editor state with custom gutter
    const startState = EditorState.create({
      doc: currentFile.content,
      extensions: [
        gutter({
          class: 'custom-gutter',
          lineMarker: (view, line) => {
            // Check if the current line number should have a marker
            const lineNumber = view.state.doc.lineAt(line.from).number;
            if (linesToColor.includes(lineNumber)) {
              return new ColoredGutterMarker(colorToUse);
            }
            return null; 
          },
        }),
        lineNumbers(),
        basicSetup(),
        langExtension,
        updateListener
      ],
    });

    // Create a new EditorView if:
      // the line numbers we want to color updates
    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    // Cleanup function to destroy the editor view when the component unmounts
    return () => {
      view.destroy();
    };
  }, [currentFile.name, linesToColor]); //, currentFile.linesToColor Dependency array to re-initialize the editor if linesToColor change

  return <div ref={editorRef} className='editor-div' />;
};

export default Editor;

