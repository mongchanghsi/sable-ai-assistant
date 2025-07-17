import { forwardRef, TextareaHTMLAttributes } from "react";
import "./style.css";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => (
    <textarea ref={ref} className={`textarea ${className}`} {...props} />
  )
);

export default Textarea;
