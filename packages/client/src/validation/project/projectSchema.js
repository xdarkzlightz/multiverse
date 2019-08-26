import { object } from "yup";
import name from "./name";
import path from "./path";

export default object().shape({
  name,
  path
});
