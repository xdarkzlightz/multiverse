import { string } from "yup";

const name = /^[\w$-.^&#!%^]*$/;
export default string()
  .label("password")
  .trim()
  .matches(name)
  .min(8, { message: "Must be at least 8 characters long" })
  .max(30, { message: "cannot be over 30 characters long" })
  .required({ message: "Cannot be empty" });
