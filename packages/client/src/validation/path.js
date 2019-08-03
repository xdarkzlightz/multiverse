import { string } from "yup";

const schema = string()
  .label("Path")
  .trim()
  .required({ message: "Cannot be empty" });

export default schema;
