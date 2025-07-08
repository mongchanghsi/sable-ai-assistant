import React, { SelectHTMLAttributes, forwardRef } from "react";

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
      <select
        ref={ref}
        className={`w-full p-2 border rounded-lg text-sm text-black bg-white focus:outline-none ${className}`}
        {...props}
      >
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
