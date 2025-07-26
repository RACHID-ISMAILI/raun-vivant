import React from "react";

export default function SimpleMatrix() {
  return (
    <div className="fixed inset-0 bg-black overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-20">
        {/* Matrix effect simulé avec CSS animations */}
        <div className="animate-pulse text-green-400 text-xs font-mono leading-3 whitespace-pre-wrap">
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} className="absolute opacity-60" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}>
              01アイウエオ
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}