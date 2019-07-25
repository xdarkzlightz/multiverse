import Joi from "joi-browser";
import name from "./name";
import path from "./path";

export default Joi.object().keys({
  name,
  path
});
