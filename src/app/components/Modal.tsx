'use client'

import React from 'react';

type ModalProps = {
    isOpen: boolean;
    children: React.ReactNode;
}
export default function Modal({ isOpen, children} : ModalProps) {
    if(!isOpen) return null;
    return (
        <div className="modal-background">
            <div className="modal">
                {children}
            </div>
        </div>
    )
}