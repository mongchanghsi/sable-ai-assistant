import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

type ExpandingTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: ReactNode;
  handleSubmit?: () => void;
};

export type ExpandingTextareaRef = {
  resetHeight: () => void;
};

const ExpandingTextarea = forwardRef<
  ExpandingTextareaRef,
  ExpandingTextareaProps
>(
  (
    { icon, handleSubmit, rows = 1, style, className, onInput, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
      resetHeight: () => {
        const el = internalRef.current;
        if (el) {
          el.style.height = "auto";
        }
      },
    }));

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const el = internalRef.current;
      if (el) {
        const borderOffset = el.offsetHeight - el.clientHeight;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight + borderOffset, 120) + "px"; // cap at ~5 rows
        el.scrollTop = el.scrollHeight;
      }
      onInput?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (handleSubmit) handleSubmit();
      }
    };

    return (
      <div className="relative w-full">
        <textarea
          {...props}
          ref={internalRef}
          rows={rows}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className={`w-full pr-8 resize-none overflow-y-auto p-2 border rounded-lg leading-snug bg-transparent text-sm text-black scrollbar-none focus:outline-none ${className || ""}`}
          style={{
            height: "auto",
            maxHeight: "120px", // ~5 lines of 24px
            lineHeight: "1.5",
            minHeight: "1.5em", // ensure 1 line is comfortably visible
            ...style,
          }}
        />

        {icon && (
          <div className="absolute right-2 top-[45%] -translate-y-1/2">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

export default ExpandingTextarea;
