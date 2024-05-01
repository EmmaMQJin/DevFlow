// DraggablePoint.js
import React, { useRef } from 'react';

const DraggablePoint = ({ id, name, onDragEnd, onDrop }) => {
  const ref = useRef(null);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span style={{ marginRight: '10px' }}>{name}</span>
      <div
        ref={ref}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", id);
        }}
        onDragEnd={(e) => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            onDragEnd(id, { x: rect.left + window.scrollX, y: rect.top + window.scrollY });
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedId = e.dataTransfer.getData("text/plain");
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            onDrop(draggedId, { x: rect.left + window.scrollX, y: rect.top + window.scrollY });
          }
        }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'black',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

export default DraggablePoint;
