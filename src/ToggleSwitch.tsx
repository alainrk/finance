import React from "react";

interface ToggleSwitchProps {
  leftLabel: string;
  rightLabel: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  leftLabel,
  rightLabel,
  checked,
  onChange,
}) => {
  return (
    <div className="flex  space-x-2">
      <span
        className={`text-sm ${checked ? "text-gray-500" : "text-gray-900 font-medium"}`}
      >
        {leftLabel}
      </span>
      <div className="relative inline-block w-14 h-8 select-none transition duration-200 ease-in">
        <input
          type="checkbox"
          name="toggle"
          id="toggle"
          className="toggle-checkbox absolute w-8 h-8 rounded-full bg-white border-4 appearance-none cursor-pointer transition duration-200 ease-in"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label
          htmlFor="toggle"
          className="toggle-label block overflow-hidden h-8 rounded-full bg-gray-300 cursor-pointer transition duration-200 ease-in"
        ></label>
      </div>
      <span
        className={`text-sm ${checked ? "text-gray-900 font-medium" : "text-gray-500"}`}
      >
        {rightLabel}
      </span>
    </div>
  );
};

export default ToggleSwitch;
