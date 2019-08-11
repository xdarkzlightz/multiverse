import { object } from "yup";
import oldPassword from "./oldPassword";
import newPassword from "./newPassword";
import confirmPassword from "./confirmPassword";

export default object().shape({
  oldPassword,
  newPassword,
  confirmPassword
});
