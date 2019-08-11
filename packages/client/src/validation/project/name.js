import { string } from "yup";

const name = /^[\w-.]+$/;
const schema = string()
  .label("Project Name")
  .trim()
  .matches(name, { message: "Only characters a-z A-Z _-. are allowed" })
  .min(3, { message: "Must be at least 3 characters long" })
  .max(20, { message: "cannot be over 20 characters long" })
  .required({ message: "Cannot be empty " });

export default schema;
