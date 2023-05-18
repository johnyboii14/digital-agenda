interface ToggleSwitchProps {
  isChecked: boolean;
  onChange: () => void;
}

const ToggleSwitch = ({
  isChecked,
  onChange,
}: ToggleSwitchProps): JSX.Element => (
  <label className="toggle-switch">
    <input type="checkbox" checked={isChecked} onChange={onChange} />
    <span className="switch" />
  </label>
);

export default ToggleSwitch;
