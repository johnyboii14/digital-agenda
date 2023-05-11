import React from "react";

interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({ isChecked, onChange }: ToggleSwitchProps) => {
  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span className="switch" />
    </label>
  );
};

export default ToggleSwitch;
