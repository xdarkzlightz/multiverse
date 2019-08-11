import { string } from "yup";

const password = /^[\w$-.^&#!%^]*$/;
export default string()
  .label("confirmPassword")
  .trim()
  .matches(password)
  .min(8, { message: "Must be at least 8 characters long" })
  .max(30, { message: "cannot be over 30 characters long" })
  .required({ message: "Cannot be empty" })
  .test("passwords-match", "Passwords do not match", function(value) {
    return this.parent.newPassword === value;
  });
