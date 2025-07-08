import { forwardRef, TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`w-full pr-8 resize-none overflow-y-auto p-2 border rounded-lg leading-snug bg-transparent text-sm text-black scrollbar-none focus:outline-none ${className}`}
        {...props}
      />
    );
  }
);

export default Textarea;
