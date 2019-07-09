import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export default ({ label, type, placeholder, disabled, onChange, onEnter }) => {
  if (!type) type = "text";
  const [value, setValue] = useState("");

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
            onEnter();
          }
        }}
        onChange={e => {
          onChange(e.target.value);
          setValue(e.target.value);
        }}
      />
    </Form.Group>
  );
};
