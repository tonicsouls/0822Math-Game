import React, { useState } from 'react';

interface DialogueBoxProps {
    messages: string[];
    onClose: () => void;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ messages, onClose }) => {
    const [messageIndex, setMessageIndex] = useState(0);

    const handleNext = () => {
        if (messageIndex < messages.length - 1) {
            setMessageIndex(prev => prev + 1);
        } else {
            onClose();
        }
    };

    return (
        <div className="dialogue-box" onClick={handleNext}>
            <p>{messages[messageIndex]}</p>
            <button>{messageIndex < messages.length - 1 ? 'Next >' : 'Close'}</button>
        </div>
    );
};

export default DialogueBox;
