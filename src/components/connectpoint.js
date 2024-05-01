import React, { useRef, useState, useEffect } from 'react';
import Xarrow from 'react-xarrows';

const connectPointStyle = {
  position: "absolute",
  width: 20,
  height: 20,
  background: "black"
};
const connectPointOffset = {
  right: { left: "100%", top: "50%", transform: "translate(0%, -50%)" },
};

const ConnectPoint = ({ subfolderName, handler, handleClick, updateArrows, boxId }) => {
  const textRef = useRef(null);
  const pointRef = useRef(null);
  const [beingDragged, setBeingDragged] = useState(false);

  useEffect(() => {
    updateArrows(boxId, textRef, pointRef);
  }, [beingDragged, boxId, updateArrows]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <span
        ref={textRef}
        onClick={(e) => handleClick(e, subfolderName)}
        style={{ marginRight: '10px', cursor: 'pointer' }}
      >
        {subfolderName}
      </span>
      <div
        className="connectPoint"
        style={{
          ...connectPointStyle,
          ...connectPointOffset[handler]
        }}
        draggable
        onDragStart={e => {
          setBeingDragged(true);
          e.dataTransfer.setData("boxId", boxId);
        }}
        onDragEnd={e => {
          setBeingDragged(false);
        }}
        ref={pointRef}
      />
    </div>
  );
};

export default ConnectPoint;
