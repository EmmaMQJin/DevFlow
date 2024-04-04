import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, Decoration, gutterLineClass  } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';

const Editor = ({ value, onChange }) => {
  const editorParentRef = useRef(null);

  useEffect(() => {
    if (!editorParentRef.current) return;

    // Line numbers styling extension
    const customLineNumberStyle = EditorView.baseTheme({
      '.cm-lineNumbers .cm-gutterElement': {
        color: '#f00', // Example color: red
        fontFamily: 'Monaco, monospace',
        fontSize: '0.85em',
      }
    });

    const startState = EditorState.create({
      doc: value,
      extensions: [lineNumbers(), customLineNumberStyle, javascript()],
    });

    const view = new EditorView({
      state: startState,
      parent: editorParentRef.current,
    });

    // Cleanup to avoid memory leaks
    return () => {
      view.destroy();
    };
  }, [value, onChange]);

  return <div ref={editorParentRef} style={{ border: '1px solid #ddd', height: '400px' }} />;
};

export default Editor;



