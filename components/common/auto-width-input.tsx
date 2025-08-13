import { cn } from "@/lib/utils";
import React, { useRef, useEffect, InputHTMLAttributes } from "react";

interface AutoWidthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AutoWidthInput: React.FC<AutoWidthInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder,
  ...props
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 10}px`;
    }
  }, [value, placeholder]);

  return (
    <div className="inline-block relative">
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
        className={cn(
          "p-0 text-2xl font-bold bg-transparent focus:outline-none focus-visible:ring-transparent focus:ring-0 border-0",
          className,
        )}
        style={{
          width: "5ch",
          minWidth: "5ch",
          maxWidth: "100%",
        }}
      />
      {/* Hidden span for measuring input width */}
      <span
        ref={spanRef}
        className="absolute invisible text-2xl font-bold h-0 overflow-scroll whitespace-pre"
      >
        {value || placeholder || ""}
      </span>
    </div>
  );
};

export default AutoWidthInput;
