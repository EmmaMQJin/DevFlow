import React from 'react';

// This is a functional component for DragPopup
function DragPopup({ onClose, folderName }) {
    return (
        <div className="dragpopup">
            <div className="popup-header">
                <h2 className="popup-title">
                    Link Code to Note "{folderName}"
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
                <br />
                <label className="popup-deactivated">
                    <input type="radio" name="myRadio" value="option2" />
                    Link get_delivery
                </label>
                <br />
                <label className="popup-deactivated">
                    <input type="radio" name="myRadio" value="option3" />
                    Customize the range
                </label>
                <br />

                <label className="popup-deactivated">
                    From: <input name="from" />
                </label>
                <br />
                <label className="popup-deactivated">
                    To: <input name="to" />
                </label>
            </div>
            <div className="popup-footer">
                <button className="popup-button cancel">Cancel</button>
                <button className="popup-button save" onClick={onClose}>Save</button>
            </div>
        </div>
    );
}

export default DragPopup;
