import * as React from 'react';
import { useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

const rulesModal = document.querySelector("#rules_modal") as HTMLElement;

interface ModalProps {
    children?: ReactNode;
}

const Modal = ({children} : ModalProps) => {
    const el = useRef(document.createElement("div"));

    useEffect(() => {
        const current = el.current;

        rulesModal!.appendChild(current);
        return () => void rulesModal!.removeChild(current);
    }, []);

    return createPortal(children, el.current);
}

export default Modal;