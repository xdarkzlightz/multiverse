import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default props => {
  let {
    label,
    type,
    placeholder,
    def,
    disabled,
    validator,
    onChange,
    onEnter
  } = props;
  if (!type) type = "text";
  const [value, setValue] = useState(def || "");

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onKeyPress={e => {
          if (e.key === "Enter") {
            setValue("");
            if (onEnter) onEnter();
          }
        }}
        onChange={e => {
          onChange(e.target.value);
          setValue(e.target.value);
          validator(e.target.value);
        }}
      />
    </Form.Group>
  );
};
