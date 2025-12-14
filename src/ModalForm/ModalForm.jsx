import React from "react";
import ModalContent from "./ModalContent";

export default function ModalForm({ isOpen, onClose, children, title, modalForm, modalContentMod }) {
    if (!isOpen) return null;
    return(
        <div className={`modal ${isOpen && "modal__opened"}`}>
        <div className="modal-overlay" onClick={onClose}>
        <div className={modalContentMod}>
            <h2 className="modal__title">{title}</h2>
            <form action="" className={modalForm}>
            {children}
            <button className="modal__close" onClick={onClose}></button>
            </form>
        </div>
        </div>
        </div>
    )
}