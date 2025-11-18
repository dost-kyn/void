import React from 'react'


export default function Alert({ isOpen, text, type = 'info', onClose }) {
    if (!isOpen) return null;

    const alertClass = `Alert Alert--${type}`;

    return (
        <div className={alertClass}>
            <div className="Alert_container">
                <p className="Alert_container_text">{text}</p>
                <div className="Alert_container_btn">
                    <button 
                        className="Alert_container_button"
                        onClick={onClose}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )
}