// components/ui/select.tsx
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  className?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  className,
  options,
  value,
  onChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div
      ref={selectRef}
      className={cn(
        "relative w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="block truncate">
        {selectedOption?.label || "Select an option"}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <svg
          className={cn("h-5 w-5 text-gray-400", isOpen && "rotate-180")}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "relative cursor-pointer select-none py-2 pl-3 pr-9",
                option.value === value && "bg-primary text-primary-foreground"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <span
                className={cn(
                  "block truncate",
                  option.value === value && "font-medium"
                )}
              >
                {option.label}
              </span>
              {option.value === value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
