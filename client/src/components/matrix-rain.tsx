import React, { useEffect, useRef } from "react";

export default function MatrixRain() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    
    const createMatrixColumn = () => {
      const column = document.createElement('div');
      column.className = 'matrix-column';
      column.style.left = Math.random() * 100 + '%';
      column.style.animationDelay = Math.random() * 3 + 's';
      column.style.animationDuration = (Math.random() * 3 + 2) + 's';
      
      let text = '';
      for (let i = 0; i < 20; i++) {
        text += characters.charAt(Math.floor(Math.random() * characters.length)) + '<br>';
      }
      column.innerHTML = text;
      
      container.appendChild(column);
      
      setTimeout(() => {
        if (column.parentNode) {
          column.parentNode.removeChild(column);
        }
      }, 5000);
    };
    
    const interval = setInterval(createMatrixColumn, 200);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={containerRef} className="matrix-rain" />;
}
