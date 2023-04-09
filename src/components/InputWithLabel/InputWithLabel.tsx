import React from "react";

type InputWithLabelProps = {
  id: string,
  value: string
  search: string
  type?: string
  isFocused: boolean
  children?: React.ReactNode
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputWithLabel: React.FC<InputWithLabelProps> = ({
  id,
  value,
  type = 'text',
  onInputChange,
  isFocused,
  children,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>

  );
};