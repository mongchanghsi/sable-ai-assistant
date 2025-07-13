import { SelectHTMLAttributes, forwardRef } from "react";
import "./style.css";

type Option = {
  label: string;
  value: string;
};

type DropdownProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
};

const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ options, className = "", ...props }, ref) => {
    return (
      <select ref={ref} className={`dropdown ${className}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

export default Dropdown;
