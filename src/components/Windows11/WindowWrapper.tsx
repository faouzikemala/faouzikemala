import React, { useState, useRef, useEffect } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowWrapperProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  onMaximizeChange?: (isMaximized: boolean) => void;
  zIndex: number;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  children: React.ReactNode;
}

export const WindowWrapper: React.FC<WindowWrapperProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  onClose,
  onMinimize,
  onFocus,
  onMaximizeChange,
  zIndex,
  initialWidth = 840,
  initialHeight = 580,
  initialX,
  initialY,
  children
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = () => {
    const nextMax = !isMaximized;
    setIsMaximized(nextMax);
    onMaximizeChange?.(nextMax);
  };
  const [position, setPosition] = useState({
    x: initialX ?? Math.max(20, (window.innerWidth - initialWidth) / 2 + (Math.random() * 40 - 20)),
    y: initialY ?? Math.max(30, (window.innerHeight - initialHeight) / 2 - 30 + (Math.random() * 30 - 15))
  });
  const [size, setSize] = useState({
    width: Math.min(initialWidth, window.innerWidth - 40),
    height: Math.min(initialHeight, window.innerHeight - 100)
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPosX: 0, startPosY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isMaximized) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 100, dragStartRef.current.startPosX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 80, dragStartRef.current.startPosY + dy))
      });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMaximized]);

  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    // Only drag with left mouse click and not on control buttons
    if (e.button !== 0 || isMaximized) return;
    onFocus();
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  if (!isOpen) return null;

  return (
    <div
      id={`win11-window-${id}`}
      onMouseDown={isMinimized ? undefined : onFocus}
      style={{
        zIndex: isMinimized ? -20 : isMaximized ? Math.max(zIndex, 35) : zIndex,
        left: isMaximized ? 0 : `${position.x}px`,
        top: isMaximized ? 0 : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`,
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto',
        transform: isMinimized ? 'scale(0.85) translateY(120px)' : 'none',
        visibility: isMinimized ? 'hidden' : 'visible',
        transition: isDraggingRef.current
          ? 'none'
          : 'width 0.15s ease, height 0.15s ease, border-radius 0.15s ease, opacity 0.2s ease, transform 0.2s ease'
      }}
      className={`fixed flex flex-col bg-slate-900/90 backdrop-blur-2xl border border-white/15 text-slate-100 shadow-2xl overflow-hidden ${
        isMaximized ? 'rounded-none' : 'rounded-xl ring-1 ring-black/40'
      }`}
    >
      {/* Windows 11 Title Bar */}
      <div
        id={`win11-titlebar-${id}`}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={toggleMaximize}
        className="h-10 select-none flex items-center justify-between px-3 bg-slate-950/40 border-b border-white/10 cursor-default"
      >
        {/* Left: Window Icon & Title */}
        <div className="flex items-center space-x-2.5 overflow-hidden pr-2">
          {icon && <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>}
          <span className="text-xs font-medium tracking-wide text-slate-200 truncate">
            {title}
          </span>
        </div>

        {/* Right: Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center h-full -mr-3">
          <button
            id={`win11-btn-min-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onMinimize();
            }}
            className="w-11 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            id={`win11-btn-max-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            className="w-11 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={isMaximized ? 'Restore Down' : 'Maximize'}
          >
            {isMaximized ? <Copy className="w-3 h-3 rotate-180" /> : <Square className="w-3 h-3" />}
          </button>
          <button
            id={`win11-btn-close-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-11 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Body Content */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {children}
      </div>
    </div>
  );
};
