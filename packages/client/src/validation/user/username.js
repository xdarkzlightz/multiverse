import { string } from "yup";

const name = /^[\w-.]+$/;
export default string()
  .label("username")
  .trim()
  .matches(name, { message: "Only characters a-z A-Z _-. are allowed" })
  .min(3, { message: "Must be at least 3 characters long" })
  .max(20, { message: "cannot be over 20 characters long" })
  .required({ message: "Cannot be empty" });
