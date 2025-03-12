import React, { useState } from "react";

interface InfoTooltipProps {
  text: string;
  position?: "top" | "right" | "bottom" | "left";
  children?: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({
  text,
  position = "top",
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Position classes
  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
  };

  // Arrow classes
  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-gray-800",
    right: "right-full top-1/2 transform -translate-y-1/2 border-r-gray-800",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-gray-800",
  };

  return (
    <div
      className="inline-block relative cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children || (
        <svg
          className="w-4 h-4 text-gray-500 hover:text-indigo-600 transition-colors duration-200 inline-block ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}

      {isVisible && (
        <>
          <div
            className={`absolute z-10 w-64 bg-gray-800 text-white text-sm rounded-md shadow-lg p-2 ${positionClasses[position]}`}
            role="tooltip"
          >
            {text}
          </div>
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
          ></div>
        </>
      )}
    </div>
  );
};

export default InfoTooltip;
