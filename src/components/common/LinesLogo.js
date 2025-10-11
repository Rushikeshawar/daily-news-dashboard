// src/components/common/LinesLogo.js
import React, { useState, useEffect } from 'react';

const LinesLogo = ({ 
  height = 40, 
  showTagline = false, 
  animated = false,
  className = ""
}) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    if (animated) {
      const intervals = [
        setTimeout(() => setAnimationStage(1), 100),
        setTimeout(() => setAnimationStage(2), 300),
        setTimeout(() => setAnimationStage(3), 500),
        setTimeout(() => setAnimationStage(4), 800),
      ];

      return () => intervals.forEach(clearTimeout);
    }
  }, [animated]);

  const lineHeight = height * 0.15;
  const lineWidth = height * 0.7;
  const spacing = height * 0.08;

  const lineStyle = {
    height: `${lineHeight}px`,
    backgroundColor: '#3B82F6', // Primary blue color
    borderRadius: `${lineHeight / 2}px`,
    transition: animated ? 'width 0.3s ease-out' : 'none',
  };

  const getLineWidth = (lineIndex) => {
    if (!animated) return `${lineWidth}px`;
    
    const shouldShow = animationStage >= lineIndex;
    return shouldShow ? `${lineWidth}px` : '0px';
  };

  const textOpacity = animated ? (animationStage >= 4 ? 1 : 0) : 1;
  const textTransform = animated ? (animationStage >= 4 ? 'translateX(0)' : 'translateX(20px)') : 'translateX(0)';

  return (
    <div className={`flex items-center ${className}`} style={{ height: `${height}px` }}>
      {/* Logo Icon (Three equal lines) */}
      <div 
        className="flex flex-col justify-center"
        style={{ width: `${height * 0.8}px` }}
      >
        {/* Line 1 */}
        <div
          style={{
            ...lineStyle,
            width: getLineWidth(1),
          }}
        />
        
        {/* Spacing */}
        <div style={{ height: `${spacing}px` }} />
        
        {/* Line 2 */}
        <div
          style={{
            ...lineStyle,
            width: getLineWidth(2),
          }}
        />
        
        {/* Spacing */}
        <div style={{ height: `${spacing}px` }} />
        
        {/* Line 3 */}
        <div
          style={{
            ...lineStyle,
            width: getLineWidth(3),
          }}
        />
      </div>

      {/* Spacing between icon and text */}
      <div style={{ width: `${height * 0.3}px` }} />

      {/* Text Logo */}
      <div 
        className="flex flex-col justify-center"
        style={{
          opacity: textOpacity,
          transform: textTransform,
          transition: animated ? 'opacity 0.3s ease-out, transform 0.3s ease-out' : 'none',
        }}
      >
        <div
          className="font-bold text-gray-900"
          style={{
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            fontSize: `${height * 0.45}px`,
            letterSpacing: '2px',
            lineHeight: '1',
          }}
        >
          LINES
        </div>
        
        {showTagline && (
          <>
            <div style={{ height: `${height * 0.02}px` }} />
            <div
              className="font-medium text-gray-600"
              style={{
                fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                fontSize: `${height * 0.20}px`,
                letterSpacing: '0.5px',
                lineHeight: '1',
              }}
            >
              The World in One Line
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LinesLogo;