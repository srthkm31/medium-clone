import { useRef } from "react";

interface Props {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  autoFocus?: boolean;
}

const AutoResizeTextarea = ({ onChange, placeholder, autoFocus }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  return (
    <textarea
      ref={textareaRef}
      onInput={handleInput}
      className="2xl:w-[1000px] xl:w-[800px] lg:w-[600px] sm:w-[500px] w-[300px] p-2 resize-none overflow-hidden focus:outline-none "
      rows={1}
      required
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

export default AutoResizeTextarea;
