import React, { useState, useRef } from 'react';
import Xarrow from 'react-xarrows';
import DragPopup from './dragpopup';

const connectPointStyle = {
    position: "absolute",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    cursor: "pointer"
  };

  const connectPointWrapperStyle = {
    position: "absolute",
    width: "30px",
    height: "30px",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10 
};

const ConnectPointsWrapper = ({ ref0, handler, boxId}) => {
  const ref1 = useRef();
  const [position, setPosition] = React.useState({});
  const [beingDragged, setBeingDragged] = React.useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  const handleDragEnd = e => {
    setPosition({});
    setBeingDragged(false);
    setShowPopup(true); // Show the popup when dragging ends
  };

  return (
    <React.Fragment>
        <div
            className="connectPointWrapper"
            style={{ ...connectPointWrapperStyle, ...position }}
            draggable
            onDragStart={e => {
                setBeingDragged(true);
                e.dataTransfer.setData("arrow", boxId);
            }}
            onDrag={e => {
                setPosition({
                    position: "fixed",
                    left: e.clientX,
                    top: e.clientY,
                    transform: "translate(-50%, -50%)",
                    opacity: 0
                });
            }}
            onDragEnd={handleDragEnd}
            ref={ref1}
        >
            <div className="connectPoint" style={connectPointStyle} />
        </div>
        {beingDragged && <Xarrow start={ref0} end={ref1} color="#8D6EAC" />}
        {showPopup && <DragPopup onClose={() => setShowPopup(false)}  folderName={boxId} />}
    </React.Fragment>
  );
};

const boxStyle = {
  border: "1px solid #333333",
  width: "20px",
  height: "20px", 
  position: "relative",
  borderRadius: "50%", 
};


export const Box = ({ handler, addArrow, boxId }) => {
  const ref0 = useRef();
  return (
    <div
    class="circle-box"
      id={boxId}
      style={boxStyle}
      ref={ref0}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        if (e.dataTransfer.getData("arrow") === boxId) {
          console.log(e.dataTransfer.getData("arrow"), boxId);
        } else {
          const refs = { start: e.dataTransfer.getData("arrow"), end: boxId };
          addArrow(refs);
          console.log("dropped!", refs);
        }
      }}
    >
      <ConnectPointsWrapper {...{ boxId, handler, ref0 }} />
    </div>
  );
};
