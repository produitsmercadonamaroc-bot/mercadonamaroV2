import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'center' | 'right';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, position = 'center' }) => {
  if (!isOpen) return null;

  const containerClasses = {
    center: 'justify-center items-center p-4',
    right: 'justify-end items-start',
  };

  const panelClasses = {
    center: 'w-full max-w-md max-h-[90vh] rounded-xl animate-fade-in-scale',
    right: 'w-full max-w-md h-full animate-slide-in-right',
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex transition-opacity duration-300 ${containerClasses[position]}`}
      onClick={onClose}
    >
      <div
        className={`bg-white shadow-2xl overflow-y-auto flex flex-col transform transition-all opacity-0 ${panelClasses[position]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;