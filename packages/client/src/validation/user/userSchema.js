import { object } from "yup";
import username from "./username";
import password from "./password";

export default object().shape({
  username,
  password
});
