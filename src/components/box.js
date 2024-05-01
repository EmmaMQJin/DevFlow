import React, { useRef } from 'react';
import Xarrow from 'react-xarrows';

const connectPointStyle = {
    position: "absolute",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    // transform: "translate(-50%, -50%)",  // Center in the larger area
    cursor: "pointer"  // Indicates this is a draggable area
  };

  const connectPointWrapperStyle = {
    position: "absolute",
    width: "30px",  // Larger touch area
    height: "30px",  // Larger touch area
    left: "50%",  // Centering the wrapper on the desired point
    top: "50%",  // Centering the wrapper on the desired point
    transform: "translate(-50%, -50%)",  // Ensuring it's centered correctly
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10  // Ensures it's above other content
};

const ConnectPointsWrapper = ({ boxId, handler, ref0 }) => {
  const ref1 = useRef();
  const [position, setPosition] = React.useState({});
  const [beingDragged, setBeingDragged] = React.useState(false);
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
            onDragEnd={e => {
                setPosition({});
                setBeingDragged(false);
            }}
            ref={ref1}
        >
            <div className="connectPoint" style={connectPointStyle} />
        </div>
        {beingDragged && <Xarrow start={ref0} end={ref1} color="#8D6EAC" />}
    </React.Fragment>
  );
};

const boxStyle = {
  border: "1px solid #333333",
  width: "20px",
  height: "20px", 
  position: "relative",
  borderRadius: "50%", 
//   padding: "20px 10px"
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
